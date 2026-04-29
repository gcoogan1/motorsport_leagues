import { supabase } from "@/lib/supabase";
import type { GetFollowersResult } from "@/types/profile.types";
import type { FollowSquadPayload, FollowSquadResult, UnfollowSquadPayload, UnfollowSquadResult, RemoveSquadFollowerPayload, RemoveSquadFollowerResult, GetSquadFollowingResult } from "@/types/squad.types";
import { resolveAvatarValue } from "../profile/profile.service";
import { resolveBannerValue } from "./squad.service";

// --- Squad Follow Service --- //

// -- Follow a Squad -- //
export const followSquadService = async (
  { squadId, profileId, accountId }: FollowSquadPayload,
): Promise<FollowSquadResult> => {
  const { error } = await supabase
    .from("squad_follows")
    .insert({
      follower_id: profileId,
      follower_account_id: accountId,
      squad_id: squadId,
    });

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

  return { success: true };
};

// -- Unfollow a Squad -- //
export const unfollowSquadService = async (
  { squadId, accountId }: UnfollowSquadPayload,
): Promise<UnfollowSquadResult> => {
  const { error } = await supabase
    .from("squad_follows")
    .delete()
    .eq("follower_account_id", accountId)
    .eq("squad_id", squadId);

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

  return { success: true };
};

// -- Check if Profile is Following Squad -- //
export const isFollowingSquadService = async (
  squadId: string,
  accountId: string,
): Promise<boolean> => {
  const { data, error } = await supabase
    .from("squad_follows")
    .select("squad_id")
    .eq("follower_account_id", accountId)
    .eq("squad_id", squadId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No rows found means the profile is not following the squad
      return false;
    }

    // For any other error, log it and assume the profile is not following the squad to avoid blocking the user due to a transient error
    console.error("Error checking if profile is following squad:", error);
    return false;
  }

  return !!data; // If data is returned, the profile is following the squad; if no data, it's not
};

// -- Get Followers of a Squad -- //
export const getSquadFollowersService = async (
  squadId: string,
): Promise<GetFollowersResult> => {
  const { data: followRows, error: followsError } = await supabase
    .from("squad_follows")
    .select("follower_id")
    .eq("squad_id", squadId);

  if (followsError) {
    return {
      success: false,
      error: {
        message: followsError.message,
        code: followsError.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  if (!followRows.length) {
    return {
      success: true,
      data: [],
    };
  }

  const profileIds = followRows.map((row) => row.follower_id);

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("*")
    .in("id", profileIds);

  if (profilesError) {
    return {
      success: false,
      error: {
        message: profilesError.message,
        code: profilesError.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  return {
    success: true,
    data: profiles.map((profile) => ({
      ...profile,
      avatar_value: resolveAvatarValue(
        profile.avatar_type,
        profile.avatar_value,
      ),
    })),
  };
};

// -- Get Squads Followed by an Account -- //
export const getFollowingSquads = async (
  accountId: string,
): Promise<GetSquadFollowingResult> => {
  const { data: followRows, error: followsError } = await supabase
    .from("squad_follows")
    .select("squad_id")
    .eq("follower_account_id", accountId);

  if (followsError) {
    return {
      success: false,
      error: {
        message: followsError.message,
        code: followsError.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  if (!followRows.length) {
    return {
      success: true,
      data: [],
    };
  }

  const squadIds = followRows.map((row) => row.squad_id);

  const { data: squads, error: squadsError } = await supabase
    .from("squads")
    .select("*, squad_members(count)")
    .in("id", squadIds);

  if (squadsError) {
    return {
      success: false,
      error: {
        message: squadsError.message,
        code: squadsError.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  return {
    success: true,
    data: squads.map((squad) => ({
      ...squad,
      member_count: squad.squad_members?.[0]?.count ?? 0,
      banner_value: resolveBannerValue(squad.banner_type, squad.banner_value),
    })),
  };
};

// -- Remove Follower From Squad -- //
export const removeSquadFollowerService = async (
  { squadId, followerProfileId }: RemoveSquadFollowerPayload,
): Promise<RemoveSquadFollowerResult> => {
  const { error } = await supabase
    .from("squad_follows")
    .delete()
    .eq("squad_id", squadId)
    .eq("follower_id", followerProfileId);

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

  return { success: true };
};

// -- Check if Following a Squad -- //
export const checkIfFollowingSquad = async (
  squadId: string,
  accountId: string,
): Promise<boolean> => {
  const { data, error } = await supabase
    .from("squad_follows")
    .select("squad_id")
    .eq("follower_account_id", accountId)
    .eq("squad_id", squadId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return false;
    }

    return false;
  }

  return !!data;
};