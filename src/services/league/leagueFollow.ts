import { supabase } from "@/lib/supabase";
import type {
  FollowLeaguePayload,
  FollowLeagueResult,
  GetLeagueFollowersResult,
  GetLeagueFollowingResult,
  GetLeaguesResult,
  RemoveLeagueFollowerPayload,
  RemoveLeagueFollowerResult,
  UnfollowLeaguePayload,
  UnfollowLeagueResult,
} from "@/types/league.types";
import { resolveAvatarValue } from "../profile/profile.service";
import { resolveCoverValue } from "./league.service";

// --- League Follow Service --- //

// -- Follow a League -- //
export const followLeagueService = async (
  { leagueId, profileId, accountId }: FollowLeaguePayload,
): Promise<FollowLeagueResult> => {
  const { error } = await supabase
    .from("league_follows")
    .insert({
      follower_id: profileId,
      follower_account_id: accountId,
      league_id: leagueId,
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

// -- Unfollow a League -- //
export const unfollowLeagueService = async (
  { leagueId, accountId }: UnfollowLeaguePayload,
): Promise<UnfollowLeagueResult> => {
  const { error } = await supabase
    .from("league_follows")
    .delete()
    .eq("follower_account_id", accountId)
    .eq("league_id", leagueId);

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

// -- Check if Profile is Following League -- //
export const isFollowingLeagueService = async (
  leagueId: string,
  accountId: string,
): Promise<boolean> => {
  const { data, error } = await supabase
    .from("league_follows")
    .select("league_id")
    .eq("follower_account_id", accountId)
    .eq("league_id", leagueId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return false;
    }

    console.error("Error checking if profile is following league:", error);
    return false;
  }

  return !!data;
};

// Get Followers of a League -- //
export const getLeagueFollowersService = async (
  leagueId: string,
): Promise<GetLeagueFollowersResult> => {
  const { data: followRows, error: followsError } = await supabase
    .from("league_follows")
    .select("follower_id")
    .eq("league_id", leagueId);

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

// -- Remove Follower From League -- //
export const removeLeagueFollowerService = async (
  { leagueId, followerProfileId }: RemoveLeagueFollowerPayload,
): Promise<RemoveLeagueFollowerResult> => {
  const { error } = await supabase
    .from("league_follows")
    .delete()
    .eq("league_id", leagueId)
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

// -- Get Leagues Followed by an Account -- //
export const getFollowingLeagues = async (
  accountId: string,
): Promise<GetLeagueFollowingResult> => {
  const { data: followRows, error: followsError } = await supabase
    .from("league_follows")
    .select("league_id")
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

  const leagueIds = followRows.map((row) => row.league_id);

  const { data: leagues, error: leaguesError } = await supabase
    .from("leagues")
    .select("*")
    .in("id", leagueIds)
    .order("created_at", { ascending: false });

  if (leaguesError) {
    return {
      success: false,
      error: {
        message: leaguesError.message,
        code: leaguesError.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  return {
    success: true,
    data: leagues.map((league) => ({
      ...league,
      cover_value: resolveCoverValue(league.cover_type, league.cover_value),
    })),
  };
};

// -- Follow a League -- //
export const followLeague = async (
  leagueId: string,
  profileId: string,
): Promise<boolean> => {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("account_id")
    .eq("id", profileId)
    .single();

  if (error) {
    return false;
  }

  const result = await followLeagueService({
    leagueId,
    profileId,
    accountId: profile.account_id,
  });

  return result.success;
};

// -- Unfollow a League (Backward-Compatible) -- //
export const unfollowLeague = async (
  leagueId: string,
  profileId: string,
): Promise<boolean> => {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("account_id")
    .eq("id", profileId)
    .single();

  if (error) {
    return false;
  }

  const result = await unfollowLeagueService({
    leagueId,
    accountId: profile.account_id,
  });

  return result.success;
};

// -- Get Followers of a League -- //
export const getLeagueFollowers = async (
  leagueId: string,
) => {
  const result = await getLeagueFollowersService(leagueId);
  return result.success ? result.data : [];
};

// -- Check if Profile is Following League -- //
export const isFollowingLeague = async (
  leagueId: string,
  profileId: string,
): Promise<boolean> => {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("account_id")
    .eq("id", profileId)
    .single();

  if (error) {
    return false;
  }

  return isFollowingLeagueService(leagueId, profile.account_id);
};

// -- Remove Follower From League -- //
export const removeFollowerFromLeague = async (
  leagueId: string,
  followerProfileId: string,
): Promise<boolean> => {
  const result = await removeLeagueFollowerService({
    leagueId,
    followerProfileId,
  });

  return result.success;
};

// -- Check if Account is Following League -- //
export const checkIfFollowingLeague = async (
  leagueId: string,
  accountId: string,
): Promise<boolean> => isFollowingLeagueService(leagueId, accountId);

// -- Get Leagues Followed by an Account -- //
export const getFollowedLeaguesByAccountId = async (
  accountId: string,
): Promise<GetLeaguesResult> => getFollowingLeagues(accountId);
