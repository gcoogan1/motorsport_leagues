import { supabase } from "@/lib/supabase";
import type {
  CheckUsernameAvailabilityResult,
  CreateProfilePayload,
  CreateProfileResult,
  GetProfilesResult,
} from "@/types/profile.types";
// --- Profile Supabase Services -- //

// -- Resolve Avatar Value to Public URL -- // Used for profiles with uploaded avatars to get the full public URL from Supabase Storage
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
};;
