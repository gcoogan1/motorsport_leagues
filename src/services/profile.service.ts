import { supabase } from "@/lib/supabase";
import type { CreateProfilePayload, CreateProfileResult, GetProfilesResult } from "@/types/profile.types";
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
      data: data.map((profile) => ({
        id: profile.id,
        created_at: profile.created_at,
        account_id: profile.account_id,
        username: profile.username,
        game_type: profile.game_type,
        avatar_type: profile.avatar_type,
        avatar_value: profile.avatar_value,
      })),
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
): Promise<boolean> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .eq("game_type", game_type)
    .single();

  console.log("Username check data:", data, "error:", error);

  if (data) {
    return false;
  }

  // If no data is returned, the username is available
  return true;
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
    const filePath = `avatars/${accountId}/${crypto.randomUUID()}.${fileExt}`;

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
