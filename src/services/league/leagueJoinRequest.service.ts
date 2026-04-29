import { supabase } from "@/lib/supabase";
import type { CreateLeagueJoinRequestPayload, CreateLeagueJoinRequestResult, GetLeagueJoinRequestsResult, RemoveLeagueJoinRequestPayload, RemoveLeagueJoinRequestResult } from "@/types/league.types";
import { resolveAvatarValue } from "../profile/profile.service";

// --- League Join Request Service --- //

// -- Create League Join Request (one role per row) -- //
export const createLeagueJoinRequestService = async (
  {
    leagueId,
    profileId,
    accountId,
    contactInfo,
    roles,
  }: CreateLeagueJoinRequestPayload,
): Promise<CreateLeagueJoinRequestResult> => {
  const uniqueRoles = [...new Set(roles)];

  if (!uniqueRoles.length) {
    return {
      success: false,
      error: {
        message: "At least one role is required.",
        code: "VALIDATION_ERROR",
        status: 400,
      },
    };
  }

  // Check for existing requests for this profile+league with the same roles
  const { data: existing, error: fetchError } = await supabase
    .from("league_join_request")
    .select("requested_role")
    .eq("league_id", leagueId)
    .eq("profile_id", profileId)
    .in("requested_role", uniqueRoles);

  if (fetchError) {
    return {
      success: false,
      error: {
        message: fetchError.message,
        code: fetchError.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  const existingRoles = new Set((existing ?? []).map((r) => r.requested_role));
  const newRoles = uniqueRoles.filter((role) => !existingRoles.has(role));

  if (!newRoles.length) {
    return { success: true, data: [] };
  }

  const requestRows = newRoles.map((role) => ({
    league_id: leagueId,
    profile_id: profileId,
    account_id: accountId,
    contact_info: contactInfo.trim(),
    requested_role: role,
  }));

  const { data, error } = await supabase
    .from("league_join_request")
    .insert(requestRows)
    .select();

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

  return {
    success: true,
    data,
  };
};

// -- Get League Join Requests By League Id -- //
export const getLeagueJoinRequestsByLeagueId = async (
  leagueId: string,
  signal?: AbortSignal,
): Promise<GetLeagueJoinRequestsResult> => {
  let joinRequestsQuery = supabase
    .from("league_join_request")
    .select(
      "id, created_at, league_id, profile_id, account_id, contact_info, requested_role",
    )
    .eq("league_id", leagueId)
    .order("created_at", { ascending: false });

  if (signal) {
    joinRequestsQuery = joinRequestsQuery.abortSignal(signal);
  }

  const { data: joinRequests, error: joinRequestsError } =
    await joinRequestsQuery;

  if (joinRequestsError) {
    if (
      joinRequestsError.code === "ABORT" ||
      joinRequestsError.message?.includes("abort")
    ) {
      return { success: true, data: [] };
    }

    return {
      success: false,
      error: {
        message: joinRequestsError.message,
        code: joinRequestsError.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  if (!joinRequests?.length) {
    return {
      success: true,
      data: [],
    };
  }

  const profileIds = [
    ...new Set(joinRequests.map((request) => request.profile_id)),
  ];

  let profilesQuery = supabase
    .from("profiles")
    .select("id, username, avatar_type, avatar_value")
    .in("id", profileIds);

  if (signal) {
    profilesQuery = profilesQuery.abortSignal(signal);
  }

  const { data: profiles, error: profilesError } = await profilesQuery;

  if (profilesError) {
    if (
      profilesError.code === "ABORT" || profilesError.message?.includes("abort")
    ) {
      return { success: true, data: [] };
    }

    return {
      success: false,
      error: {
        message: profilesError.message,
        code: profilesError.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  const profilesMap = new Map(
    (profiles ?? []).map((profile) => [profile.id, profile]),
  );

  return {
    success: true,
    data: joinRequests
      .map((request) => {
        const profile = profilesMap.get(request.profile_id);

        if (!profile) {
          return null;
        }

        return {
          ...request,
          username: profile.username,
          avatar_type: profile.avatar_type,
          avatar_value: resolveAvatarValue(
            profile.avatar_type,
            profile.avatar_value,
          ),
        };
      })
      .filter((request): request is NonNullable<typeof request> =>
        request !== null
      ),
  };
};

// -- Remove League Join Request -- //
export const removeLeagueJoinRequestService = async (
  { requestId }: RemoveLeagueJoinRequestPayload,
): Promise<RemoveLeagueJoinRequestResult> => {
  const { error } = await supabase
    .from("league_join_request")
    .delete()
    .eq("id", requestId);

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

  return {
    success: true,
  };
};