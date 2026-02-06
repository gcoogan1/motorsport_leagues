import { supabase } from "@/lib/supabase";
import type { CheckUsernameAvailabilityResult, CreateProfilePayload, CreateProfileResult, GetProfilesResult } from "@/types/profile.types";
// --- Profile Supabase Services -- //

// -- Get Profiles by User ID -- //
export const getProfilesByUserId = async (userId: string): Promise<GetProfilesResult> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("account_id", userId);

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error?.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  if (data) {
    return {
      success: true,
      data: data.map((profile) => {
        let finalAvatarValue = profile.avatar_value;

        // If it's an upload, resolve the full public URL from Supabase
        if (profile.avatar_type === "upload") {
          const { data: urlData } = supabase.storage
            .from("avatars")
            .getPublicUrl(profile.avatar_value);
          
          finalAvatarValue = urlData.publicUrl;
        }

        return {
          ...profile,
          avatar_value: finalAvatarValue,
        };
      }),
    };
  }

  return {
    success: false,
    error: { message: "No profiles found", code: "NOT_FOUND", status: 404 },
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

  // Handle avatar upload or preset selection
  if (avatar.type === "preset") {
    avatarType = "preset";
    avatarValue = avatar.variant;
  } else {
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
          code: "UPLOAD_FAILED",
          status: 500,
        },
      };
    }

    avatarValue = filePath;
  }

  // Insert new profile record into the database
  const { data, error } = await supabase
    .from("profiles")
    .insert([
      {
        account_id: accountId,
        username,
        game_type: gameType,
        avatar_type: avatarType,
        avatar_value: avatarValue,
      },
    ])
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

  // Return the created profile data
  return {
    success: true,
    data: {
      id: data.id,
      created_at: data.created_at,
      account_id: data.account_id,
      username: data.username,
      game_type: data.game_type,
      avatar_type: avatarType,
      avatar_value: avatarValue,
    },
  };
};

// -- Get Profile by Profile ID -- //
// Used when guest views a profile
export const getProfilebyProfileId = async (profileId: string): Promise<GetProfilesResult> => {
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
        code: error?.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  if (data) {
    let finalAvatarValue = data.avatar_value;

    // If it's an upload, resolve the full public URL from Supabase
    if (data.avatar_type === "upload") {
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(data.avatar_value);
      
      finalAvatarValue = urlData.publicUrl;
    }

    return {
      success: true,
      data: [{
        ...data,
        avatar_value: finalAvatarValue,
      }],
    };
  }

  return {
    success: false,
    error: { message: "Profile not found", code: "NOT_FOUND", status: 404 },
  };
}
