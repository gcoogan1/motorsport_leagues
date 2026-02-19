import { supabase } from "@/lib/supabase";
import type {
  CheckUsernameAvailabilityResult,
  CreateProfilePayload,
  CreateProfileResult,
  FollowProfileVariables,
  GetFollowersResult,
  GetFollowingResult,
  GetProfilesResult,
  ProfileTable,
  RemoveFollowerVariables,
  UnfollowProfileVariables,
  UpdateAvatarPayload,
  UpdateUsernamePayload,
} from "@/types/profile.types";

// TODO: Make sure delete cascades are set up correctly in the database

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
  profileId?: string,
): Promise<CheckUsernameAvailabilityResult> => {
  let query = supabase
    .from("profiles")
    .select("id")
    .ilike("username", username)
    .eq("game_type", game_type);

  // If profileId is provided, exclude it from the check (allows owner to change capitalization)
  if (profileId) {
    query = query.neq("id", profileId);
  }

  const { data, error } = await query;

  if (data && data.length > 0) {
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

// -- Get All Profiles (with optional search) -- //
// Used for search functionality, returns all profiles except the current user's profile, with optional search by username
export const getAllProfiles = async (
  currentUserId?: string,
  search?: string,
  signal?: AbortSignal,
): Promise<GetProfilesResult> => {
  let query = supabase
    .from("profiles")
    .select("*");

  // SEARCH: Partial match on username
  if (search) {
    query = query.ilike("username", `%${search}%`);
  }

  // EXCLUSION: Return everyone EXCEPT the person searching
  if (currentUserId) {
    query = query.neq("account_id", currentUserId);
  }

  // ABORT: Connect the signal to kill the request if user types more
  if (signal) {
    query = query.abortSignal(signal);
  }

  const { data, error } = await query;

  if (error) {
    // Standard Supabase abort error code is '20' or 'ABORT' depending on environment
    if (error.code === "ABORT" || error.message?.includes("abort")) {
      return { success: true, data: [] };
    }

    return {
      success: false,
      error: {
        message: error.message,
        code: error.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  return {
    success: true,
    data: (data || []).map((profile) => ({
      ...profile,
      avatar_value: resolveAvatarValue(
        profile.avatar_type,
        profile.avatar_value,
      ),
    })),
  };
};

// -- Follow a profile -- //
export const followProfileService = async (
  { userId, followerProfileId, followingProfileId }: FollowProfileVariables,
) => {
  if (!userId) throw new Error("Not authenticated");

  const { error } = await supabase.from("profile_follows").insert({
    follower_account_id: userId,
    follower_id: followerProfileId,
    following_id: followingProfileId,
  });

  if (error) throw error;

  return true;
};

// Unfollow a profile
export const unfollowProfileService = async (
  { userId, followingProfileId }: UnfollowProfileVariables,
) => {
  if (!userId) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("profile_follows")
    .delete()
    .eq("follower_account_id", userId)
    .eq("following_id", followingProfileId);

  if (error) throw error;

  return true;
};

// -- Check if following -- //
export const isFollowingService = async (userId: string, profileId: string) => {
  if (!userId) return false;

  const { data } = await supabase
    .from("profile_follows")
    .select("*")
    .eq("follower_account_id", userId)
    .eq("following_id", profileId)
    .maybeSingle();

  return !!data;
};

// -- Get followers of a profile -- //
export const getFollowersService = async (
  profileId: string,
): Promise<GetFollowersResult> => {
  const { data, error } = await supabase
    .from("profile_follows")
    .select(`
      profiles!profile_follows_follower_id_fkey (*)
    `)
    .eq("following_id", profileId);

  console.log("Joined followers data:", data);

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

  // The join returns the follower profile data nested under the "profiles" key. We need to extract it and resolve the avatar URL for each follower profile.
  const normalized = (data ?? [])
    .map((row) => row.profiles as unknown as ProfileTable | null)
    .filter((profile): profile is ProfileTable => !!profile)
    .map((profile) => ({
      ...profile,
      avatar_value: resolveAvatarValue(
        profile.avatar_type,
        profile.avatar_value,
      ),
    }));

  return {
    success: true,
    data: normalized,
  };
};

// -- Get all following for the current account -- //
export const getFollowingService = async (
  userId: string,
): Promise<GetFollowingResult> => {
  if (!userId) return { success: true, data: [] };

  // Get following by joining the profile_follows table with the profiles table to get the followed profile data, filtering by the follower_account_id (the current user's account ID)
  const { data, error } = await supabase
    .from("profile_follows")
    .select(`
      profiles!profile_follows_following_id_fkey (
        *
      )
    `)
    .eq("follower_account_id", userId);

    console.log("Joined following data:", data);

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

   // The join returns the follower profile data nested under the "profiles" key. We need to extract it and resolve the avatar URL for each follower profile.
  const normalized = (data ?? [])
    .map((row) => row.profiles as unknown as ProfileTable | null)
    .filter((profile): profile is ProfileTable => !!profile)
    .map((profile) => ({
      ...profile,
      avatar_value: resolveAvatarValue(
        profile.avatar_type,
        profile.avatar_value,
      ),
    }));

  return {
    success: true,
    data: normalized,
  };
};

// -- Remove a follower (used when user removes someone from their followers list) -- //
export const removeFollowerService = async ({ currentProfileId, followerProfileId }: RemoveFollowerVariables) => {
  if (!followerProfileId) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("profile_follows")
    .delete()
    .eq("follower_id", followerProfileId)
    .eq("following_id", currentProfileId);

  if (error) throw error;

  return true;
}
