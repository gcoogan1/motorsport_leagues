import { supabase } from "@/lib/supabase";
import type {
  AddLeagueParticipantPayload,
  AddLeagueParticipantResult,
  AddLeagueParticipantRolePayload,
  AddLeagueParticipantRoleResult,
  CreateLeaguePayload,
  CreateLeagueResult,
  CreateLeagueSeasonPayload,
  CreateLeagueSeasonResult,
  GetLeaguesWithInfoResult,
  DeleteLeagueResult,
  LeagueParticipantProfile,
  GetLeagueParticipantsResult,
  GetLeagueSeasonsResult,
  GetLeaguesResult,
  RemoveLeagueParticipantPayload,
  RemoveLeagueParticipantResult,
  RemoveLeagueParticipantRolePayload,
  RemoveLeagueParticipantRoleResult,
  RemoveLeagueSeasonPayload,
  RemoveLeagueSeasonResult,
  // UpdateLeagueParticipantRolePayload,
  // UpdateLeagueParticipantRoleResult,
  UpdateLeaguePayload,
  UpdateLeagueResult,
  UpdateLeagueSeasonPayload,
  UpdateLeagueSeasonResult,
} from "@/types/league.types";
import { LEAGUE_PARTICIPANT_ROLES } from "@/types/league.types";
import { convertGameTypeToFullName } from "@/utils/convertGameTypes";
import { normalizeName } from "@/utils/normalizeName";
import { getCurrentTimezone } from "@/utils/timezone";

export const resolveCoverValue = (
  coverType: "preset" | "upload",
  coverValue: string,
) => {
  if (coverType !== "upload") return coverValue;

  // Get the public URL for the uploaded cover from Supabase Storage
  const { data } = supabase.storage
    .from("covers")
    .getPublicUrl(coverValue);

  return data.publicUrl;
};

// -- Get Leagues by Account ID -- //
export const getLeaguesByAccountId = async (
  accountId: string,
): Promise<GetLeaguesResult> => {
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id")
    .eq("account_id", accountId);

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

  if (!profiles.length) {
    return { success: true, data: [] };
  }

  const profileIds = profiles.map((profile) => profile.id);

  const { data: participantRows, error: participantsError } = await supabase
    .from("league_participants")
    .select("league_id")
    .in("profile_id", profileIds);

  if (participantsError) {
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
    return { success: true, data: [] };
  }

  const leagueIds = [...new Set(participantRows.map((row) => row.league_id))];

  const { data, error } = await supabase
    .from("leagues")
    .select("*")
    .in("id", leagueIds)
    .order("created_at", { ascending: false });

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
    data: data.map((league) => ({
      ...league,
      cover_value: resolveCoverValue(league.cover_type, league.cover_value),
    })),
  };
};

// -- Get All Leagues with Seasons + Participants + Roles (with optional search) -- //
export const getAllLeaguesWithInfo = async (
  accountId?: string,
  search?: string,
  signal?: AbortSignal,
  includeOwnLeagues: boolean = false,
): Promise<GetLeaguesWithInfoResult> => {
  // Match squads behavior: optionally hide the user's own leagues.
  let excludeLeagueIds: string[] = [];

  if (accountId && !includeOwnLeagues) {
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id")
      .eq("account_id", accountId);

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

    if (profiles?.length) {
      const profileIds = profiles.map((profile) => profile.id);

      const { data: ownParticipantRows, error: ownParticipantsError } = await supabase
        .from("league_participants")
        .select("id, league_id")
        .in("profile_id", profileIds);

      if (ownParticipantsError) {
        return {
          success: false,
          error: {
            message: ownParticipantsError.message,
            code: ownParticipantsError.code || "SERVER_ERROR",
            status: 500,
          },
        };
      }

      if (ownParticipantRows?.length) {
        const participantIds = ownParticipantRows.map((participant) => participant.id);

        const { data: ownDirectorRoles, error: ownRolesError } = await supabase
          .from("league_participants_role")
          .select("participant_id")
          .in("participant_id", participantIds)
          .eq("role", "director");

        if (ownRolesError) {
          return {
            success: false,
            error: {
              message: ownRolesError.message,
              code: ownRolesError.code || "SERVER_ERROR",
              status: 500,
            },
          };
        }

        if (ownDirectorRoles?.length) {
          const ownDirectorParticipantIds = new Set(
            ownDirectorRoles.map((role) => role.participant_id),
          );

          excludeLeagueIds = [
            ...new Set(
              ownParticipantRows
                .filter((participant) => ownDirectorParticipantIds.has(participant.id))
                .map((participant) => participant.league_id),
            ),
          ];
        }
      }
    }
  }

  let leaguesQuery = supabase
    .from("leagues")
    .select("*")
    .order("created_at", { ascending: false });

  if (search) {
    const normalizedSearch = normalizeName(search);
    leaguesQuery = leaguesQuery.ilike("league_name_normalized", `%${normalizedSearch}%`);
  }

  if (excludeLeagueIds.length) {
    leaguesQuery = leaguesQuery.not("id", "in", `(${excludeLeagueIds.join(",")})`);
  }

  if (signal) {
    leaguesQuery = leaguesQuery.abortSignal(signal);
  }

  const { data: leaguesData, error: leaguesError } = await leaguesQuery;

  if (leaguesError) {
    if (leaguesError.code === "ABORT" || leaguesError.message?.includes("abort")) {
      return { success: true, data: [] };
    }

    return {
      success: false,
      error: {
        message: leaguesError.message,
        code: leaguesError.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  const leagues = (leaguesData ?? []).map((league) => ({
    ...league,
    cover_value: resolveCoverValue(league.cover_type, league.cover_value),
  }));

  if (!leagues.length) {
    return {
      success: true,
      data: [],
    };
  }

  const leagueIds = leagues.map((league) => league.id);

  let seasonsQuery = supabase
    .from("league_season")
    .select("*")
    .in("league_id", leagueIds)
    .order("created_at", { ascending: true });

  if (signal) {
    seasonsQuery = seasonsQuery.abortSignal(signal);
  }

  const { data: seasonsData, error: seasonsError } = await seasonsQuery;

  if (seasonsError) {
    return {
      success: false,
      error: {
        message: seasonsError.message,
        code: seasonsError.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  let participantsQuery = supabase
    .from("league_participants")
    .select("id, league_id, profile_id")
    .in("league_id", leagueIds);

  if (signal) {
    participantsQuery = participantsQuery.abortSignal(signal);
  }

  const { data: participantRows, error: participantsError } = await participantsQuery;

  if (participantsError) {
    return {
      success: false,
      error: {
        message: participantsError.message,
        code: participantsError.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  const seasonsByLeague = new Map<string, typeof seasonsData>();
  (seasonsData ?? []).forEach((season) => {
    const current = seasonsByLeague.get(season.league_id) ?? [];
    current.push(season);
    seasonsByLeague.set(season.league_id, current);
  });

  if (!participantRows?.length) {
    return {
      success: true,
      data: leagues.map((league) => {
        const seasons = seasonsByLeague.get(league.id) ?? [];

        return {
          ...league,
          seasons,
          participants: [],
          current_season_name: seasons.at(-1)?.season_name,
        };
      }),
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
    return {
      success: false,
      error: {
        message: profilesError.message,
        code: profilesError.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  const participantIds = participantRows.map((participant) => participant.id);

  let rolesQuery = supabase
    .from("league_participants_role")
    .select("participant_id, role")
    .in("participant_id", participantIds);

  if (signal) {
    rolesQuery = rolesQuery.abortSignal(signal);
  }

  const { data: rolesData, error: rolesError } = await rolesQuery;

  if (rolesError) {
    return {
      success: false,
      error: {
        message: rolesError.message,
        code: rolesError.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  const profilesMap = new Map(
    (profiles ?? []).map((profile) => [
      profile.id,
      {
        ...profile,
      },
    ]),
  );

  const rolesMap = new Map<string, typeof LEAGUE_PARTICIPANT_ROLES[number][]>();
  (rolesData ?? []).forEach((roleRow) => {
    const roles = rolesMap.get(roleRow.participant_id) ?? [];
    roles.push(roleRow.role as typeof LEAGUE_PARTICIPANT_ROLES[number]);
    rolesMap.set(roleRow.participant_id, roles);
  });

  const participantsByLeague = new Map<string, LeagueParticipantProfile[]>();

  participantRows.forEach((participant) => {
    const profile = profilesMap.get(participant.profile_id);

    if (!profile) return;

    const leagueParticipants = participantsByLeague.get(participant.league_id) ?? [];

    leagueParticipants.push({
      id: participant.id,
      profile_id: participant.profile_id,
      account_id: profile.account_id,
      username: profile.username,
      game_type: profile.game_type,
      avatar_type: profile.avatar_type,
      avatar_value: profile.avatar_value,
      roles: rolesMap.get(participant.id) ?? [],
    });

    participantsByLeague.set(participant.league_id, leagueParticipants);
  });

  return {
    success: true,
    data: leagues.map((league) => {
      const seasons = seasonsByLeague.get(league.id) ?? [];

      return {
        ...league,
        seasons,
        participants: participantsByLeague.get(league.id) ?? [],
        current_season_name: seasons.at(-1)?.season_name,
      };
    }),
  };
};

//  -- Get Leagues with Info by Account ID (optionally include own leagues) -- //
/* shortcut */
export const getLeaguesWithInfoByAccountId = async (
  accountId: string,
  signal?: AbortSignal,
): Promise<GetLeaguesWithInfoResult> =>
  getAllLeaguesWithInfo(accountId, undefined, signal, true);

// -- Get Leagues with Info by Profile ID -- //
export const getLeaguesWithInfoByProfileId = async (
  profileId: string,
  signal?: AbortSignal,
): Promise<GetLeaguesWithInfoResult> => {
  const result = await getAllLeaguesWithInfo(undefined, undefined, signal, true);

  if (!result.success) {
    return result;
  }

  return {
    success: true,
    data: result.data.filter((league) =>
      league.participants.some((participant) => participant.profile_id === profileId),
    ),
  };
};

// -- Get Leagues with Info by Hosting Squad ID -- //
export const getLeaguesWithInfoBySquadId = async (
  squadId: string,
  signal?: AbortSignal,
): Promise<GetLeaguesWithInfoResult> => {
  const result = await getAllLeaguesWithInfo(undefined, undefined, signal, true);

  if (!result.success) {
    return result;
  }

  return {
    success: true,
    data: result.data.filter((league) => league.hosting_squad_id === squadId),
  };
};

// -- Get League by ID -- //
export const getLeagueById = async (leagueId: string): Promise<CreateLeagueResult> => {
  const { data, error } = await supabase
    .from("leagues")
    .select("*")
    .eq("id", leagueId)
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
    data: {
      ...data,
      cover_value: resolveCoverValue(data.cover_type, data.cover_value),
    },
  };
};

// -- Check League Name Availability -- //
export const isLeagueNameAvailable = async (
  leagueName: string,
  leagueId?: string,
): Promise<boolean> => {
  const normalizedLeagueName = normalizeName(leagueName);
  let query = supabase
    .from("leagues")
    .select("id")
    .eq("league_name_normalized", normalizedLeagueName);

  // If leagueId is provided, exclude that league from the check (useful when editing a league)
  if (leagueId) {
    query = query.neq("id", leagueId);
  }

  const { data, error } = await query;

  if (error && error.code !== "PGRST116") {
    return false;
  }

  return !data?.length;
};

// -- Create League with Cover -- //
export const createLeagueWithCover = async (
  {
    accountId,
    leagueName,
    directorProfileId,
    gameType,
    hostingSquadId,
    hostingSquadName,
    coverImage,
    themeColor,
    seasonName,
    numOfDivisions,
    isTeamChampionship,
  }: CreateLeaguePayload,
): Promise<CreateLeagueResult> => {
  let coverType: "preset" | "upload";
  let coverValue: string;
  const currentTimezone = getCurrentTimezone();
  const defaultDescription = `This is ${hostingSquadName}'s League for ${convertGameTypeToFullName(gameType)}.`;

  // --- Handle cover ---
  if (coverImage.type === "preset") {
    coverType = "preset";
    coverValue = coverImage.variant;
  } else {
    coverType = "upload";

    // Generate a unique file path for the cover upload
    const fileExt = coverImage.file.name.split(".").pop();
    const filePath = `${accountId}/${crypto.randomUUID()}.${fileExt}`;

    // Upload the cover file to Supabase Storage
    const { error } = await supabase.storage
      .from("covers")
      .upload(filePath, coverImage.file, {
        upsert: true,
        contentType: coverImage.file.type,
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

    // If upload is successful, set the coverValue to the file path in storage
    coverValue = filePath;
  }

  // --- Insert league ---
  const { data, error } = await supabase
    .from("leagues")
    .insert({
      league_name: leagueName,
      league_name_normalized: normalizeName(leagueName),
      game_type: gameType,
      hosting_squad_id: hostingSquadId,
      hosting_squad_name: hostingSquadName,
      cover_type: coverType,
      cover_value: coverValue,
      theme_color: themeColor,
      timezone: currentTimezone,
      description: defaultDescription,
      league_status: "setup",
    })
    .select()
    .single();

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code || "LEAGUE_CREATION_FAILED",
        status: 500,
      },
    };
  }

  const participantResult = await addLeagueParticipant({
    leagueId: data.id,
    profileId: directorProfileId,
  });

  if (!participantResult.success) {
    return {
      success: false,
      error: {
        message: participantResult.error.message,
        code: participantResult.error.code || "PARTICIPANT_CREATION_FAILED",
        status: 500,
      },
    };
  }

  // Add director role to the participant
  const participantId = participantResult.data.id;
  const roleResult = await addLeagueParticipantRole({
    participantId,
    role: "director",
  });

  if (!roleResult.success) {
    return {
      success: false,
      error: {
        message: roleResult.error.message,
        code: roleResult.error.code || "ROLE_CREATION_FAILED",
        status: 500,
      },
    };
  }

  const seasonResult = await createLeagueSeason({
    leagueId: data.id,
    seasonName,
    numOfDivisions,
    isTeamChampionship,
  });

  if (!seasonResult.success) {
    return {
      success: false,
      error: {
        message: seasonResult.error.message,
        code: seasonResult.error.code || "SEASON_CREATION_FAILED",
        status: 500,
      },
    };
  }

  const resolvedCover = resolveCoverValue(coverType, coverValue);

  return {
    success: true,
    data: {
      ...data,
      cover_value: resolvedCover,
    },
  };
};

// -- Update League Settings -- //
export const updateLeagueSettings = async (
  {
    accountId,
    leagueId,
    leagueName,
    description,
    timezone,
    coverImage,
    themeColor,
  }: UpdateLeaguePayload,
): Promise<UpdateLeagueResult> => {
  // Build the update object with only provided fields
  const updateData: Record<string, unknown> = {};

  if (leagueName !== undefined) {
    updateData.league_name = leagueName;
    updateData.league_name_normalized = normalizeName(leagueName);
  }

  if (description !== undefined) {
    updateData.description = description;
  }

  if (timezone !== undefined) {
    updateData.timezone = timezone;
  }

  if (themeColor !== undefined) {
    updateData.theme_color = themeColor;
  }

  // Handle cover image upload if provided
  if (coverImage !== undefined) {
    let coverType: "preset" | "upload";
    let coverValue: string;

    if (coverImage.type === "preset") {
      coverType = "preset";
      coverValue = coverImage.variant;
    } else {
      coverType = "upload";

      // Generate a unique file path for the cover upload
      const fileExt = coverImage.file.name.split(".").pop();
      const filePath = `${accountId}/${crypto.randomUUID()}.${fileExt}`;

      // Upload the cover file to Supabase Storage
      const { error } = await supabase.storage
        .from("covers")
        .upload(filePath, coverImage.file, {
          upsert: true,
          contentType: coverImage.file.type,
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

      coverValue = filePath;
    }

    updateData.cover_type = coverType;
    updateData.cover_value = coverValue;
  }

  // Update the league in the database
  const { data, error } = await supabase
    .from("leagues")
    .update(updateData)
    .eq("id", leagueId)
    .select()
    .single();

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code || "UPDATE_FAILED",
        status: 500,
      },
    };
  }

  // Resolve cover value if it was uploaded
  if (coverImage !== undefined && coverImage.type === "upload") {
    data.cover_value = resolveCoverValue(data.cover_type, data.cover_value);
  }

  return {
    success: true,
    data,
  };
};

// -- Add League Participant -- //
export const addLeagueParticipant = async (
  {
    leagueId,
    profileId,
  }: AddLeagueParticipantPayload,
): Promise<AddLeagueParticipantResult> => {
  const { data, error } = await supabase
    .from("league_participants")
    .insert({
      league_id: leagueId,
      profile_id: profileId,
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

// -- Get League Participants by League ID -- //
export const getLeagueParticipantsByLeagueId = async (
  leagueId: string,
  signal?: AbortSignal,
): Promise<GetLeagueParticipantsResult> => {
  let participantsQuery = supabase
    .from("league_participants")
    .select("id, profile_id")
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
          username: profile.username,
          game_type: profile.game_type,
          avatar_type: profile.avatar_type,
          avatar_value: profile.avatar_value,
          roles: rolesMap.get(participant.id) ?? [],
        };
      })
      .filter(
        (participant): participant is NonNullable<typeof participant> =>
          participant !== null,
      ),
  };
};

// -- Create League Season -- //
export const createLeagueSeason = async (
  {
    leagueId,
    seasonName,
    numOfDivisions,
    isTeamChampionship,
  }: CreateLeagueSeasonPayload,
): Promise<CreateLeagueSeasonResult> => {
  const { data, error } = await supabase
    .from("league_season")
    .insert({
      league_id: leagueId,
      season_name: seasonName,
      num_of_divisions: numOfDivisions,
      is_team_championship: isTeamChampionship,
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

// -- Get League Seasons by League ID -- //
export const getLeagueSeasonsByLeagueId = async (
  leagueId: string,
  signal?: AbortSignal,
): Promise<GetLeagueSeasonsResult> => {
  let query = supabase
    .from("league_season")
    .select("*")
    .eq("league_id", leagueId)
    .order("created_at", { ascending: true });

  if (signal) {
    query = query.abortSignal(signal);
  }

  const { data, error } = await query;

  if (error) {
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
    data,
  };
};

// -- Update League Season -- //
export const updateLeagueSeason = async (
  {
    seasonId,
    seasonName,
    numOfDivisions,
    isTeamChampionship,
  }: UpdateLeagueSeasonPayload,
): Promise<UpdateLeagueSeasonResult> => {
  const { data, error } = await supabase
    .from("league_season")
    .update({
      season_name: seasonName,
      num_of_divisions: numOfDivisions,
      is_team_championship: isTeamChampionship,
    })
    .eq("id", seasonId)
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

// -- Remove League Season -- //
export const removeLeagueSeason = async (
  { seasonId }: RemoveLeagueSeasonPayload,
  signal?: AbortSignal,
): Promise<RemoveLeagueSeasonResult> => {
  let query = supabase.from("league_season").delete().eq("id", seasonId);

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

// -- Delete League By ID -- //
export const deleteLeagueById = async (
  leagueId: string,
): Promise<DeleteLeagueResult> => {
  // Fetch cover info so uploaded assets can be cleaned up.
  const { data: leagueData, error: leagueFetchError } = await supabase
    .from("leagues")
    .select("cover_type, cover_value")
    .eq("id", leagueId)
    .single();

  if (leagueFetchError) {
    return {
      success: false,
      error: {
        message: leagueFetchError.message,
        code: leagueFetchError.code || "LEAGUE_FETCH_FAILED",
        status: 500,
      },
    };
  }

  if (leagueData.cover_type === "upload") {
    const { error: coverDeleteError } = await supabase.storage
      .from("covers")
      .remove([leagueData.cover_value]);

    if (coverDeleteError) {
      return {
        success: false,
        error: {
          message: coverDeleteError.message,
          code: "LEAGUE_COVER_DELETION_FAILED",
          status: 500,
        },
      };
    }
  }

  const { error: participantsDeleteError } = await supabase
    .from("league_participants")
    .delete()
    .eq("league_id", leagueId);

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

  const { error: seasonsDeleteError } = await supabase
    .from("league_season")
    .delete()
    .eq("league_id", leagueId);

  if (seasonsDeleteError) {
    return {
      success: false,
      error: {
        message: seasonsDeleteError.message,
        code: seasonsDeleteError.code || "LEAGUE_SEASONS_DELETION_FAILED",
        status: 500,
      },
    };
  }

  const { error: leagueDeleteError } = await supabase
    .from("leagues")
    .delete()
    .eq("id", leagueId);

  if (leagueDeleteError) {
    return {
      success: false,
      error: {
        message: leagueDeleteError.message,
        code: leagueDeleteError.code || "LEAGUE_DELETION_FAILED",
        status: 500,
      },
    };
  }

  return {
    success: true,
  };
};
