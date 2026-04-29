import { supabase } from "@/lib/supabase";
import type { AddLeagueParticipantPayload, AddLeagueParticipantResult, AddLeagueParticipantRolePayload, AddLeagueParticipantRoleResult, RemoveLeagueParticipantRolePayload, RemoveLeagueParticipantRoleResult, RemoveLeagueParticipantPayload, RemoveLeagueParticipantResult, GetLeagueParticipantsResult, LEAGUE_PARTICIPANT_ROLES, JoinLeagueWithRolesPayload, JoinLeagueWithRolesResult } from "@/types/league.types";
import { resolveAvatarValue } from "../profile.service";
import { isFollowingLeagueService, unfollowLeagueService } from "./leagueFollower";

// --- League Participant and Participant Role Service --- //


// --- Participant --- //

// -- Add League Participant -- //
export const addLeagueParticipant = async (
  {
    leagueId,
    profileId,
    contactInfo,
  }: AddLeagueParticipantPayload,
): Promise<AddLeagueParticipantResult> => {
  const { data, error } = await supabase
    .from("league_participants")
    .insert({
      league_id: leagueId,
      profile_id: profileId,
      contact_info: contactInfo?.trim() ? contactInfo.trim() : null,
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

// -- Get League Participants by League ID -- //
export const getLeagueParticipantsByLeagueId = async (
  leagueId: string,
  signal?: AbortSignal,
): Promise<GetLeagueParticipantsResult> => {
  let participantsQuery = supabase
    .from("league_participants")
    .select("id, profile_id, contact_info")
    .eq("league_id", leagueId);

  if (signal) {
    participantsQuery = participantsQuery.abortSignal(signal);
  }

  const { data: participantRows, error: participantsError } =
    await participantsQuery;

  if (participantsError) {
    if (
      participantsError.code === "ABORT" ||
      participantsError.message?.includes("abort")
    ) {
      return { success: true, data: [] };
    }

    return {
      success: false,
      error: {
        message: participantsError.message,
        code: participantsError.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  if (!participantRows.length) {
    return {
      success: true,
      data: [],
    };
  }

  const profileIds = [
    ...new Set(participantRows.map((participant) => participant.profile_id)),
  ];

  let profilesQuery = supabase
    .from("profiles")
    .select("id, account_id, username, game_type, avatar_type, avatar_value")
    .in("id", profileIds);

  if (signal) {
    profilesQuery = profilesQuery.abortSignal(signal);
  }

  const { data: profiles, error: profilesError } = await profilesQuery;

  if (profilesError) {
    if (
      profilesError.code === "ABORT" ||
      profilesError.message?.includes("abort")
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
    profiles.map((profile) => [
      profile.id,
      {
        ...profile,
      },
    ]),
  );

  // Fetch roles for all participants
  const { data: rolesData, error: rolesError } = await supabase
    .from("league_participants_role")
    .select("participant_id, role")
    .in(
      "participant_id",
      participantRows.map((p) => p.id),
    );

  if (rolesError) {
    if (rolesError.code === "ABORT" || rolesError.message?.includes("abort")) {
      return { success: true, data: [] };
    }

    return {
      success: false,
      error: {
        message: rolesError.message,
        code: rolesError.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  // Build a map of participant IDs to their roles
  const rolesMap = new Map<string, typeof LEAGUE_PARTICIPANT_ROLES[number][]>();
  (rolesData ?? []).forEach((roleRow) => {
    const roles = rolesMap.get(roleRow.participant_id) ?? [];
    roles.push(roleRow.role as typeof LEAGUE_PARTICIPANT_ROLES[number]);
    rolesMap.set(roleRow.participant_id, roles);
  });

  return {
    success: true,
    data: participantRows
      .map((participant) => {
        const profile = profilesMap.get(participant.profile_id);

        if (!profile) return null;

        return {
          id: participant.id,
          profile_id: participant.profile_id,
          account_id: profile.account_id,
          contact_info: participant.contact_info ?? undefined,
          username: profile.username,
          game_type: profile.game_type,
          avatar_type: profile.avatar_type,
          avatar_value: resolveAvatarValue(
            profile.avatar_type,
            profile.avatar_value,
          ),
          roles: rolesMap.get(participant.id) ?? [],
        };
      })
      .filter(
        (participant): participant is NonNullable<typeof participant> =>
          participant !== null,
      ),
  };
};

// -- Remove League Participant -- //
export const removeLeagueParticipant = async (
  { leagueId, profileId }: RemoveLeagueParticipantPayload,
  signal?: AbortSignal,
): Promise<RemoveLeagueParticipantResult> => {
  let query = supabase
    .from("league_participants")
    .delete()
    .eq("league_id", leagueId)
    .eq("profile_id", profileId);

  if (signal) {
    query = query.abortSignal(signal);
  }

  const { error } = await query;

  if (error) {
    if (error.code === "ABORT" || error.message?.includes("abort")) {
      return { success: true };
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
  };
};


// --- Participant Role --- //

// -- Add League Participant Role -- //
export const addLeagueParticipantRole = async (
  {
    participantId,
    role,
  }: AddLeagueParticipantRolePayload,
): Promise<AddLeagueParticipantRoleResult> => {
  const { data, error } = await supabase
    .from("league_participants_role")
    .insert({
      participant_id: participantId,
      role,
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

// -- Join League with Roles (atomic-like with rollback) -- //
export const joinLeagueWithRolesService = async (
  {
    leagueId,
    profileId,
    accountId,
    contactInfo,
    roles,
  }: JoinLeagueWithRolesPayload,
): Promise<JoinLeagueWithRolesResult> => {
  // If the account follows this league, remove follow first.
  const following = await isFollowingLeagueService(leagueId, accountId);

  if (following) {
    const unfollowResult = await unfollowLeagueService({ leagueId, accountId });

    if (!unfollowResult.success) {
      return {
        success: false,
        error: {
          message: unfollowResult.error.message,
          code: unfollowResult.error.code || "SERVER_ERROR",
          status: unfollowResult.error.status,
        },
      };
    }
  }

  const participantResult = await addLeagueParticipant({
    leagueId,
    profileId,
    contactInfo,
  });

  if (!participantResult.success) {
    return participantResult;
  }

  // De-duplicate requested roles to avoid duplicate insert errors.
  const uniqueRoles = [...new Set(roles)];

  for (const role of uniqueRoles) {
    const roleResult = await addLeagueParticipantRole({
      participantId: participantResult.data.id,
      role,
    });

    if (!roleResult.success) {
      // Roll back participant creation if any role assignment fails.
      const rollbackResult = await removeLeagueParticipant({
        leagueId,
        profileId,
      });

      if (!rollbackResult.success) {
        return {
          success: false,
          error: {
            message:
              `Role assignment failed and rollback failed: ${roleResult.error.message}`,
            code: roleResult.error.code || "SERVER_ERROR",
            status: roleResult.error.status,
          },
        };
      }

      return {
        success: false,
        error: {
          message: roleResult.error.message,
          code: roleResult.error.code || "SERVER_ERROR",
          status: roleResult.error.status,
        },
      };
    }
  }

  return {
    success: true,
    data: participantResult.data,
  };
};

// -- Remove League Participant Role -- //
export const removeLeagueParticipantRole = async (
  {
    participantId,
    role,
  }: RemoveLeagueParticipantRolePayload,
): Promise<RemoveLeagueParticipantRoleResult> => {
  const { error } = await supabase
    .from("league_participants_role")
    .delete()
    .eq("participant_id", participantId)
    .eq("role", role);

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

// -- Update League Participant Role -- //
// export const updateLeagueParticipantRole = async (
//   {
//     leagueId,
//     profileId,
//     newLeagueRole,
//   }: UpdateLeagueParticipantRolePayload,
// ): Promise<UpdateLeagueParticipantRoleResult> => {
//   // Fetch the participant to get their ID
//   const { data: participant, error: participantError } = await supabase
//     .from("league_participants")
//     .select("id")
//     .eq("league_id", leagueId)
//     .eq("profile_id", profileId)
//     .single();

//   if (participantError) {
//     return {
//       success: false,
//       error: {
//         message: participantError.message,
//         code: participantError.code || "SERVER_ERROR",
//         status: 500,
//       },
//     };
//   }

//   // Get all current roles for this participant
//   const { data: currentRoles, error: rolesError } = await supabase
//     .from("league_participant_roles")
//     .select("role")
//     .eq("participant_id", participant.id);

//   if (rolesError) {
//     return {
//       success: false,
//       error: {
//         message: rolesError.message,
//         code: rolesError.code || "SERVER_ERROR",
//         status: 500,
//       },
//     };
//   }

//   // If the new role already exists, return success
//   if (currentRoles.some((r) => r.role === newLeagueRole)) {
//     return { success: true };
//   }

//   // Remove old role and add new role (assuming single role per participant for now)
//   if (currentRoles.length > 0) {
//     const { error: deleteError } = await supabase
//       .from("league_participant_roles")
//       .delete()
//       .eq("participant_id", participant.id);

//     if (deleteError) {
//       return {
//         success: false,
//         error: {
//           message: deleteError.message,
//           code: deleteError.code || "SERVER_ERROR",
//           status: 500,
//         },
//       };
//     }
//   }

//   // Add the new role
//   const { error: insertError } = await supabase
//     .from("league_participants_role")
//     .insert({
//       participant_id: participant.id,
//       role: newLeagueRole,
//     });

//   if (insertError) {
//     return {
//       success: false,
//       error: {
//         message: insertError.message,
//         code: insertError.code || "SERVER_ERROR",
//         status: 500,
//       },
//     };
//   }

//   return {
//     success: true,
//   };
// };