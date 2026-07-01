import { supabase } from "@/lib/supabase";
import type {
  CheckUsernameAvailabilityResult,
  CreateProfilePayload,
  CreateProfileResult,
  GetProfilesResult,
  UpdateAvatarPayload,
  UpdateUsernamePayload,
} from "@/types/profile.types";
import { deleteSquadsByFounderService } from "../squad/squad.service";

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

// -- Delete Old Avatar If It's An Upload -- //
const deleteOldAvatarIfUpload = async (
  avatarType: string | null,
  avatarValue: string | null,
): Promise<void> => {
  if (avatarType === "upload" && avatarValue) {
    const { error } = await supabase.storage
      .from("avatars")
      .remove([avatarValue]);

    if (error) {
      console.error(`Failed to delete old avatar: ${avatarValue}`, error);
    }
  }
};

const syncLeagueSeasonDriverProfileSnapshot = async (
  profileId: string,
  updates: {
    display_name?: string;
    avatar_type?: "preset" | "upload";
    avatar_value?: string;
  },
) => {
  const { error } = await supabase
    .from("league_season_driver")
    .update(updates)
    .eq("profile_id", profileId);

  if (error) {
    return {
      success: false as const,
      error,
    };
  }

  return {
    success: true as const,
  };
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
  // Fetch the old avatar to delete it if it's an upload
  const { data: oldProfileData } = await supabase
    .from("profiles")
    .select("avatar_type, avatar_value")
    .eq("id", profileId)
    .single();

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

  // Delete old avatar if it was an upload and we're either switching to preset or uploading new image
  if (oldProfileData && (avatar.type === "preset" || avatarType === "upload")) {
    await deleteOldAvatarIfUpload(oldProfileData.avatar_type, oldProfileData.avatar_value);
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

  const driverAvatarSync = await syncLeagueSeasonDriverProfileSnapshot(profileId, {
    avatar_type: avatarType,
    avatar_value: resolvedAvatar,
  });

  if (!driverAvatarSync.success) {
    return {
      success: false,
      error: {
        message: driverAvatarSync.error.message,
        code: driverAvatarSync.error.code || "LEAGUE_SEASON_DRIVER_SYNC_FAILED",
        status: 500,
      },
    };
  }

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

  const driverUsernameSync = await syncLeagueSeasonDriverProfileSnapshot(profileId, {
    display_name: username,
  });

  if (!driverUsernameSync.success) {
    return {
      success: false,
      error: {
        message: driverUsernameSync.error.message,
        code: driverUsernameSync.error.code || "LEAGUE_SEASON_DRIVER_SYNC_FAILED",
        status: 500,
      },
    };
  }

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
) => {
  // Fetch the profile to get avatar and account ID for cleanup
  const { data: profileData, error: profileLookupError } = await supabase
    .from("profiles")
    .select("account_id, avatar_type, avatar_value")
    .eq("id", profileId)
    .single();

  if (profileLookupError) {
    return {
      success: false,
      error: {
        message: profileLookupError.message,
        code: profileLookupError.code || "PROFILE_FETCH_FAILED",
        status: 500,
      },
    };
  }

  // Delete uploaded avatar from storage if it's an upload type (non-blocking)
  if (profileData.avatar_type === "upload" && profileData.avatar_value) {
    await deleteOldAvatarIfUpload(profileData.avatar_type, profileData.avatar_value);
  }

  // Remove all follow relationships linked to this profile before deleting it.
  // This covers both:
  // 1) profiles this profile follows (follower_id)
  // 2) profiles that follow this profile (following_id)
  const { error: followDeleteError } = await supabase
    .from("profile_follows")
    .delete()
    .or(`follower_id.eq.${profileId},following_id.eq.${profileId}`);

  if (followDeleteError) {
    return {
      success: false,
      error: {
        message: followDeleteError.message,
        code: followDeleteError.code || "PROFILE_FOLLOWS_DELETION_FAILED",
        status: 500,
      },
    };
  }

  // Remove squad follow relationships for this profile before deleting it.
  // This ensures a deleted profile no longer follows any squads.
  const { error: squadFollowDeleteError } = await supabase
    .from("squad_follows")
    .delete()
    .eq("follower_id", profileId);

  if (squadFollowDeleteError) {
    return {
      success: false,
      error: {
        message: squadFollowDeleteError.message,
        code: squadFollowDeleteError.code || "SQUAD_FOLLOWS_DELETION_FAILED",
        status: 500,
      },
    };
  }
  // Delete any squads founded by this profile before deleting the profile itself, to avoid orphaned squads without founders.
  const deleteFoundedSquadsResult = await deleteSquadsByFounderService(
    profileId,
  );

  if (!deleteFoundedSquadsResult.success) {
    return {
      success: false,
      error: {
        message: deleteFoundedSquadsResult.error?.message || "Failed to delete founded squads",
        code: deleteFoundedSquadsResult.error?.code || "FOUNDED_SQUADS_DELETION_FAILED",
        status: deleteFoundedSquadsResult.error?.status || 500,
      },
    };
  }

  // Remove league participant role rows linked to this profile's participant rows.
  const { data: participantRows, error: participantFetchError } = await supabase
    .from("league_participants")
    .select("id")
    .eq("profile_id", profileId);

  if (participantFetchError) {
    return {
      success: false,
      error: {
        message: participantFetchError.message,
        code: participantFetchError.code || "LEAGUE_PARTICIPANTS_FETCH_FAILED",
        status: 500,
      },
    };
  }

  const participantIds = (participantRows ?? []).map((participant) => participant.id);

  if (participantIds.length > 0) {
    const { error: participantRolesDeleteError } = await supabase
      .from("league_participants_role")
      .delete()
      .in("participant_id", participantIds);

    if (participantRolesDeleteError) {
      return {
        success: false,
        error: {
          message: participantRolesDeleteError.message,
          code: participantRolesDeleteError.code || "LEAGUE_PARTICIPANT_ROLES_DELETION_FAILED",
          status: 500,
        },
      };
    }
  }

  const { error: participantsDeleteError } = await supabase
    .from("league_participants")
    .delete()
    .eq("profile_id", profileId);

  if (participantsDeleteError) {
    return {
      success: false,
      error: {
        message: participantsDeleteError.message,
        code: participantsDeleteError.code || "LEAGUE_PARTICIPANTS_DELETION_FAILED",
        status: 500,
      },
    };
  }

  const { error: leagueFollowsDeleteError } = await supabase
    .from("league_follows")
    .delete()
    .eq("follower_id", profileId);

  if (leagueFollowsDeleteError) {
    return {
      success: false,
      error: {
        message: leagueFollowsDeleteError.message,
        code: leagueFollowsDeleteError.code || "LEAGUE_FOLLOWS_DELETION_FAILED",
        status: 500,
      },
    };
  }

  const { error: leagueInvitesDeleteError } = await supabase
    .from("league_invites")
    .delete()
    .eq("profile_id", profileId);

  if (leagueInvitesDeleteError) {
    return {
      success: false,
      error: {
        message: leagueInvitesDeleteError.message,
        code: leagueInvitesDeleteError.code || "LEAGUE_INVITES_DELETION_FAILED",
        status: 500,
      },
    };
  }

  const { error: leagueJoinRequestsDeleteError } = await supabase
    .from("league_join_request")
    .delete()
    .eq("profile_id", profileId);

  if (leagueJoinRequestsDeleteError) {
    return {
      success: false,
      error: {
        message: leagueJoinRequestsDeleteError.message,
        code: leagueJoinRequestsDeleteError.code || "LEAGUE_JOIN_REQUESTS_DELETION_FAILED",
        status: 500,
      },
    };
  }

  const { error: squadInvitesDeleteError } = await supabase
    .from("squad_invites")
    .delete()
    .eq("profile_id", profileId);

  if (squadInvitesDeleteError) {
    return {
      success: false,
      error: {
        message: squadInvitesDeleteError.message,
        code: squadInvitesDeleteError.code || "SQUAD_INVITES_DELETION_FAILED",
        status: 500,
      },
    };
  }

  const { error: squadMembersDeleteError } = await supabase
    .from("squad_members")
    .delete()
    .eq("profile_id", profileId);

  if (squadMembersDeleteError) {
    return {
      success: false,
      error: {
        message: squadMembersDeleteError.message,
        code: squadMembersDeleteError.code || "SQUAD_MEMBERS_DELETION_FAILED",
        status: 500,
      },
    };
  }

  const { error: notificationsDeleteError } = await supabase
    .from("notifications")
    .delete()
    .or(`recipient_profile_id.eq.${profileId},sender_profile_id.eq.${profileId}`);

  if (notificationsDeleteError) {
    return {
      success: false,
      error: {
        message: notificationsDeleteError.message,
        code: notificationsDeleteError.code || "NOTIFICATIONS_DELETION_FAILED",
        status: 500,
      },
    };
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

// -- Get All Profiles (with optional search and minus current user) -- //
// Used for search functionality, returns all profiles except the current user's profile, with optional search by username
export const getAllProfiles = async (
  currentUserId?: string,
  search?: string,
  signal?: AbortSignal,
  includeOwnProfiles: boolean = false,
): Promise<GetProfilesResult> => {
  let query = supabase
    .from("profiles")
    .select("*");

  // SEARCH: Partial match on username
  if (search) {
    query = query.ilike("username", `%${search}%`);
  }

  // EXCLUSION: Return everyone EXCEPT the person searching
  if (currentUserId && !includeOwnProfiles) {
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

