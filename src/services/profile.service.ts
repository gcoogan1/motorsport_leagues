import { supabase } from "@/lib/supabase";
import type {
  CheckUsernameAvailabilityResult,
  CreateProfilePayload,
  CreateProfileResult,
  GetProfilesResult,
  UpdateAvatarPayload,
  UpdateUsernamePayload,
} from "@/types/profile.types";

//TODO: Create Supabase Edge Function to handle profile deletion and all associated data (Squads, Leagues, Results, etc.) in a single transaction, to ensure data integrity and avoid orphaned records. 
// The deleteProfile function below will call this Edge Function, passing the profile ID and avatar value (if applicable) as parameters.

// --- Profile Supabase Services -- //

// -- Resolve Avatar Value to Public URL -- //
// NOTE: This should be used for every function that returns profile data, to ensure that the avatar_value is always a public URL regardless of whether it's a preset or uploaded avatar
export const resolveAvatarValue = (
  avatarType: "preset" | "upload",
  avatarValue: string,
) => {
  if (avatarType !== "upload") return avatarValue;

  // Get the public URL for the uploaded avatar from Supabase Storage
  const { data } = supabase.storage
    .from("avatars")
    .getPublicUrl(avatarValue);

  return data.publicUrl;
};

// -- Get Profiles by User ID -- //
export const getProfilesByUserId = async (
  userId: string,
): Promise<GetProfilesResult> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("account_id", userId);

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  // Resolve the avatar value to a public URL for each profile before returning the data
  return {
    success: true,
    data: data.map((profile) => ({
      ...profile,
      avatar_value: resolveAvatarValue(
        profile.avatar_type,
        profile.avatar_value,
      ),
    })),
  };
};

// -- Check Profile Username Availability -- //
export const isProfileUsernameAvailable = async (
  username: string,
  game_type?: string,
): Promise<CheckUsernameAvailabilityResult> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .eq("game_type", game_type)
    .maybeSingle();

  if (data) {
    return {
      success: false,
      error: {
        message: "Username already exists",
        code: "EXISTING_USERNAME",
        status: 409,
      },
    };
  }

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  // If no data is returned, the username is available
  return {
    success: true,
  };
};

// -- Create Profile with Avatar -- //
export const createProfileWithAvatar = async ({
  accountId,
  username,
  gameType,
  avatar,
}: CreateProfilePayload): Promise<CreateProfileResult> => {
  let avatarType: "preset" | "upload";
  let avatarValue: string;

  // --- Handle avatar ---
  if (avatar.type === "preset") {
    avatarType = "preset";
    avatarValue = avatar.variant;
  } else {
    avatarType = "upload";

    // Generate a unique file path for the avatar upload
    const fileExt = avatar.file.name.split(".").pop();
    const filePath = `${accountId}/${crypto.randomUUID()}.${fileExt}`;

    // Upload the avatar file to Supabase Storage
    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, avatar.file, {
        upsert: true,
        contentType: avatar.file.type,
      });

    if (error) {
      return {
        success: false,
        error: {
          message: error.message,
          code: "UPLOAD_FAILED",
          status: 500,
        },
      };
    }

    // If upload is successful, set the avatarValue to the file path in storage
    avatarValue = filePath;
  }

  // --- Insert profile ---
  const { data, error } = await supabase
    .from("profiles")
    .insert({
      account_id: accountId,
      username,
      game_type: gameType,
      avatar_type: avatarType,
      avatar_value: avatarValue,
    })
    .select()
    .single();

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code || "PROFILE_CREATION_FAILED",
        status: 500,
      },
    };
  }

  // Resolve the avatar value to a public URL before returning the profile data
  const resolvedAvatar = resolveAvatarValue(
    avatarType,
    avatarValue,
  );

  // Return the created profile data with the resolved avatar URL
  return {
    success: true,
    data: {
      ...data,
      avatar_type: avatarType,
      avatar_value: resolvedAvatar,
    },
  };
};

// -- Get Profile by Profile ID -- //
// Used when guest views a profile
export const getProfileByProfileId = async (
  profileId: string,
): Promise<GetProfilesResult> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", profileId)
    .maybeSingle();

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  if (!data) {
    return {
      success: false,
      error: { message: "Profile not found", code: "NOT_FOUND", status: 404 },
    };
  }

  // Resolve the avatar value to a public URL before returning the profile data
  return {
    success: true,
    data: [
      {
        ...data,
        avatar_value: resolveAvatarValue(
          data.avatar_type,
          data.avatar_value,
        ),
      },
    ],
  };
};

// -- Update Profile Avatar -- //
export const updateProfileAvatar = async ({
  profileId,
  accountId,
  avatar,
}: UpdateAvatarPayload): Promise<CreateProfileResult> => {
  let avatarType: "preset" | "upload";
  let avatarValue: string;

  // ---- PRESET AVATAR ----
  if (avatar.type === "preset") {
    avatarType = "preset";
    avatarValue = avatar.variant;
  } // ---- UPLOADED AVATAR ----
  else {
    avatarType = "upload";

    const fileExt = avatar.file.name.split(".").pop();
    const filePath = `${accountId}/${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, avatar.file, {
        upsert: true,
        contentType: avatar.file.type,
      });

    if (uploadError) {
      return {
        success: false,
        error: {
          message: uploadError.message,
          code: "AVATAR_UPLOAD_FAILED",
          status: 500,
        },
      };
    }

    avatarValue = filePath;
  }

  // ---- UPDATE PROFILE ----
  const { data, error } = await supabase
    .from("profiles")
    .update({
      avatar_type: avatarType,
      avatar_value: avatarValue,
    })
    .eq("id", profileId)
    .select()
    .single();

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code || "AVATAR_UPDATE_FAILED",
        status: 500,
      },
    };
  }

  // ---- RESOLVE PUBLIC URL FOR UPLOADS ----
  const resolvedAvatar = resolveAvatarValue(
    avatarType,
    avatarValue,
  );

  return {
    success: true,
    data: {
      ...data,
      avatar_type: avatarType,
      avatar_value: resolvedAvatar,
    },
  };
};

// -- Update Profile Username -- //
export const updateProfileUsername = async ({
  profileId,
  username,
}: UpdateUsernamePayload): Promise<CreateProfileResult> => {
  const { data, error } = await supabase
    .from("profiles")
    .update({ username })
    .eq("id", profileId)
    .select()
    .single();

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code || "USERNAME_UPDATE_FAILED",
        status: 500,
      },
    };
  }

  // Resolve the avatar value to a public URL before returning the profile data
  const resolvedAvatar = resolveAvatarValue(
    data.avatar_type,
    data.avatar_value,
  );

  return {
    success: true,
    data: {
      ...data,
      avatar_value: resolvedAvatar,
    },
  };
};

// -- Delete Avatar from Supabase Storage -- //
export const deleteAvatarFromStorage = async (avatarValue: string) => {
  const { error } = await supabase.storage
    .from("avatars")
    .remove([avatarValue]);

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: "AVATAR_DELETION_FAILED",
        status: 500,
      },
    };
  }

  return {
    success: true,
  };
};

// -- Delete Profile -- //
export const deleteProfile = async (
  profileId: string,
  avatarValue?: string,
) => {
  if (avatarValue) {
    // Delete any uploaded avatar from Supabase Storage
    const avatarDeletionResult = await deleteAvatarFromStorage(avatarValue);

    if (!avatarDeletionResult.success) {
      return {
        success: false,
        error: {
          message: avatarDeletionResult.error?.message ||
            "Failed to delete avatar",
          code: "AVATAR_DELETION_FAILED",
          status: 500,
        },
      };
    }
  }

  // Delete the profile from the database 
  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", profileId);

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code || "PROFILE_DELETION_FAILED",
        status: 500,
      },
    };
  }

  return {
    success: true,
  };
};
