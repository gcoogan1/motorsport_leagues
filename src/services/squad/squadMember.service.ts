import { supabase } from "@/lib/supabase";
import type { AddSquadMemberPayload, AddSquadMemberResult, GetSquadMembersResult, UpdateSquadMemberRolePayload, UpdateSquadMemberRoleResult, RemoveSquadMemberPayload, RemoveSquadMemberResult, GetSquadsResult } from "@/types/squad.types";
import { resolveAvatarValue } from "../profile/profile.service";
import { resolveBannerValue } from "./squad.service";

// --- Squad Member Service --- //

// -- Add Member to Squad -- //
export const addMemberToSquad = async (
  { squadId, profileId, role }: AddSquadMemberPayload,
): Promise<AddSquadMemberResult> => {
  // Resolve the account that owns the joining profile.
  const { data: joiningProfile, error: joiningProfileError } = await supabase
    .from("profiles")
    .select("account_id")
    .eq("id", profileId)
    .single();

  if (joiningProfileError) {
    return {
      success: false,
      error: {
        message: joiningProfileError.message,
        code: joiningProfileError.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  // Fetch every profile owned by this account so we can clear follows across all profiles.
  const { data: accountProfiles, error: accountProfilesError } = await supabase
    .from("profiles")
    .select("id")
    .eq("account_id", joiningProfile.account_id);

  if (accountProfilesError) {
    return {
      success: false,
      error: {
        message: accountProfilesError.message,
        code: accountProfilesError.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  const accountProfileIds = accountProfiles.map((profile) => profile.id);

  if (accountProfileIds.length) {
    const { error: unfollowError } = await supabase
      .from("squad_follows")
      .delete()
      .eq("squad_id", squadId)
      .in("follower_id", accountProfileIds);

    if (unfollowError) {
      return {
        success: false,
        error: {
          message: unfollowError.message,
          code: unfollowError.code || "SERVER_ERROR",
          status: 500,
        },
      };
    }
  }

  const { data, error } = await supabase
    .from("squad_members")
    .insert({
      squad_id: squadId,
      profile_id: profileId,
      role: role,
    })
    .select()
    .single();

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

// -- Get Squads where Account is a Member -- //
export const getMemberSquadsByAccountId = async (
  accountId: string,
  signal?: AbortSignal,
): Promise<GetSquadsResult> => {
  let profilesQuery = supabase
    .from("profiles")
    .select("id")
    .eq("account_id", accountId);

  if (signal) {
    profilesQuery = profilesQuery.abortSignal(signal);
  }

  const { data: profiles, error: profilesError } = await profilesQuery;
  // If there's an error fetching profiles, return it. If the error is an abort, return an empty squad list since the request was cancelled.
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

  if (!profiles.length) {
    return {
      success: true,
      data: [],
    };
  }

  const profileIds = profiles.map((profile) => profile.id);
  // Get the squad memberships for all profiles associated with the account, then fetch the corresponding squads.
  // Exclude founder memberships since founded squads are shown separately.
  let membersQuery = supabase
    .from("squad_members")
    .select("squad_id")
    .in("profile_id", profileIds)
    .neq("role", "founder");

  // Attach the abort signal to the members query, so that if the original request is cancelled (e.g., when the component unmounts or the accountId changes), this one will be too.
  // This prevents unnecessary database load and potential memory leaks from unresolved promises.
  if (signal) {
    membersQuery = membersQuery.abortSignal(signal);
  }

  const { data: memberRows, error: membersError } = await membersQuery;

  if (membersError) {
    if (
      membersError.code === "ABORT" || membersError.message?.includes("abort")
    ) {
      return { success: true, data: [] };
    }

    return {
      success: false,
      error: {
        message: membersError.message,
        code: membersError.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  // Extract unique squad IDs from the member rows to fetch the squad details
  const squadIds = [...new Set(memberRows.map((member) => member.squad_id))];

  if (!squadIds.length) {
    return {
      success: true,
      data: [],
    };
  }

  // Fetch the squad details for all squads that the account's profiles are members of, including the member count for each squad.
  // This is done in a single query to optimize performance and reduce latency, especially for accounts that are members of many squads.
  let squadsQuery = supabase
    .from("squads")
    .select("*, squad_members(count)")
    .in("id", squadIds);

  if (signal) {
    squadsQuery = squadsQuery.abortSignal(signal);
  }

  const { data: squads, error: squadsError } = await squadsQuery;

  if (squadsError) {
    if (
      squadsError.code === "ABORT" || squadsError.message?.includes("abort")
    ) {
      return { success: true, data: [] };
    }

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

// -- Get Squad Members by Squad ID -- //
export const getSquadMembersBySquadId = async (
  squadId: string,
  signal?: AbortSignal,
): Promise<GetSquadMembersResult> => {
  let membersQuery = supabase
    .from("squad_members")
    .select("id, profile_id, role")
    .eq("squad_id", squadId);

  // Attach the abort signal to the query if provided, allowing the request to be cancelled if needed (e.g., when the component unmounts or the squadId changes)
  if (signal) {
    membersQuery = membersQuery.abortSignal(signal);
  }

  const { data: memberRows, error: membersError } = await membersQuery;

  if (membersError) {
    if (
      membersError.code === "ABORT" || membersError.message?.includes("abort")
    ) {
      return { success: true, data: [] };
    }

    return {
      success: false,
      error: {
        message: membersError.message,
        code: membersError.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  if (!memberRows.length) {
    return {
      success: true,
      data: [],
    };
  }

  // Get profile IDs from the member rows to fetch their profile details in a single query
  const profileIds = [
    ...new Set(memberRows.map((member) => member.profile_id)),
  ];

  let profilesQuery = supabase
    .from("profiles")
    .select("id, username, game_type, avatar_type, avatar_value")
    .in("id", profileIds);

  // Attach the abort signal to the profiles query as well, so that if the original request is cancelled, this one will be too
  if (signal) {
    profilesQuery = profilesQuery.abortSignal(signal);
  }

  // Get the profile details for all members in a single query to optimize performance and reduce latency, especially for squads with many members
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

  // Map the profile details to the corresponding squad members, resolving their avatar values to public URLs if needed
  const profilesMap = new Map(
    profiles.map((profile) => [
      profile.id,
      {
        ...profile,
        avatar_value: resolveAvatarValue(
          profile.avatar_type,
          profile.avatar_value,
        ),
      },
    ]),
  );

  // Return the squad members with their profile details
  return {
    success: true,
    data: memberRows
      .map((member) => {
        const profile = profilesMap.get(member.profile_id);

        if (!profile) return null;

        return {
          id: member.id,
          profile_id: member.profile_id,
          username: profile.username,
          game_type: profile.game_type,
          avatar_type: profile.avatar_type,
          avatar_value: profile.avatar_value,
          role: member.role,
        };
      })
      .filter((member): member is NonNullable<typeof member> =>
        member !== null
      ), // Type guard to filter out any null members in case of missing profile data
  };
};

// -- Update Member Role in Squad -- // (e.g., promote to founder, demote to member)
export const updateSquadMemberRole = async (
  { squadId, profileId, newRole }: UpdateSquadMemberRolePayload,
): Promise<UpdateSquadMemberRoleResult> => {
  const { error } = await supabase
    .from("squad_members")
    .update({ role: newRole })
    .eq("squad_id", squadId)
    .eq("profile_id", profileId)
    .select()
    .single();

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

// -- Remove Member from Squad -- //
export const removeMemberFromSquad = async (
  { squadId, profileId }: RemoveSquadMemberPayload,
  signal?: AbortSignal,
): Promise<RemoveSquadMemberResult> => {
  let query = supabase
    .from("squad_members")
    .delete()
    .eq("squad_id", squadId)
    .eq("profile_id", profileId);

  if (signal) {
    query = query.abortSignal(signal);
  }

  const { error } = await query;

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