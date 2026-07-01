import { supabase } from "@/lib/supabase";
import type {
  CoverImageValue,
  CreateLeaguePayload,
  CreateLeagueResult,
  DeleteLeagueResult,
  GetLeaguesWithInfoResult,
  LeagueParticipantProfile,
  UpdateLeaguePayload,
  UpdateLeagueResult,
} from "@/types/league.types";
import { LEAGUE_PARTICIPANT_ROLES } from "@/types/league.types";
import { convertGameTypeToFullName } from "@/utils/convertGameTypes";
import { normalizeName } from "@/utils/normalizeName";
import { getCurrentTimezone } from "@/utils/timezone";
import { addLeagueApplicationOptions } from "./leagueApplication.service";
import { addLeagueParticipant, addLeagueParticipantRole } from "./leagueParticipant.service";
import { createLeagueSeason, removeLeagueSeason } from "./leagueSeason.service";
import { deleteEventsBySeasonId } from "../event/event.service";

const DEFAULT_LEAGUE_APPLICATION_OPEN_ROLES:
  typeof LEAGUE_PARTICIPANT_ROLES[number][] = [
    "driver",
    "steward",
    "broadcaster",
    "staff",
  ];

const COVER_BUCKET = "covers";
const COVER_PUBLIC_PATH_SEGMENT = `/storage/v1/object/public/${COVER_BUCKET}/`;

const uploadLeagueCoverFile = async (accountId: string, file: File) => {
  const fileExt = file.name.split(".").pop();
  const filePath = `${accountId}/${crypto.randomUUID()}.${fileExt}`;

  const { error } = await supabase.storage
    .from(COVER_BUCKET)
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type,
    });

  if (error) {
    return {
      success: false as const,
      error: {
        message: error.message,
        code: "UPLOAD_FAILED",
        status: 500,
      },
    };
  }

  return {
    success: true as const,
    filePath,
  };
};

const getStoredCoverValue = (coverValue: string) => {
  const publicPathIndex = coverValue.indexOf(COVER_PUBLIC_PATH_SEGMENT);

  if (publicPathIndex === -1) {
    return coverValue;
  }

  return coverValue.slice(publicPathIndex + COVER_PUBLIC_PATH_SEGMENT.length);
};

const resolveCoverPersistence = async (
  accountId: string,
  coverImage: CoverImageValue,
) => {
  if (coverImage.type === "preset") {
    return {
      success: true as const,
      coverType: "preset" as const,
      coverValue: coverImage.variant,
    };
  }

  if (coverImage.file instanceof File) {
    const uploadResult = await uploadLeagueCoverFile(accountId, coverImage.file);

    if (!uploadResult.success) {
      return uploadResult;
    }

    return {
      success: true as const,
      coverType: "upload" as const,
      coverValue: uploadResult.filePath,
    };
  }

  if (!coverImage.previewUrl) {
    return {
      success: false as const,
      error: {
        message: "Please upload an image.",
        code: "UPLOAD_FAILED",
        status: 400,
      },
    };
  }

  return {
    success: true as const,
    coverType: "upload" as const,
    coverValue: getStoredCoverValue(coverImage.previewUrl),
  };
};

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


// -- League Service --- //

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

      const { data: ownParticipantRows, error: ownParticipantsError } =
        await supabase
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
        const participantIds = ownParticipantRows.map((participant) =>
          participant.id
        );

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
                .filter((participant) =>
                  ownDirectorParticipantIds.has(participant.id)
                )
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
    leaguesQuery = leaguesQuery.ilike(
      "league_name_normalized",
      `%${normalizedSearch}%`,
    );
  }

  if (excludeLeagueIds.length) {
    leaguesQuery = leaguesQuery.not(
      "id",
      "in",
      `(${excludeLeagueIds.join(",")})`,
    );
  }

  if (signal) {
    leaguesQuery = leaguesQuery.abortSignal(signal);
  }

  const { data: leaguesData, error: leaguesError } = await leaguesQuery;

  if (leaguesError) {
    if (
      leaguesError.code === "ABORT" || leaguesError.message?.includes("abort")
    ) {
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

  const { data: participantRows, error: participantsError } =
    await participantsQuery;

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

    const leagueParticipants =
      participantsByLeague.get(participant.league_id) ?? [];

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
): Promise<GetLeaguesWithInfoResult> => {
  const result = await getAllLeaguesWithInfo(
    undefined,
    undefined,
    signal,
    true,
  );

  if (!result.success) {
    return result;
  }

  return {
    success: true,
    data: result.data.filter((league) =>
      league.participants.some((participant) =>
        participant.account_id === accountId
      )
    ),
  };
};

// -- Get Leagues with Info by Profile ID -- //
export const getLeaguesWithInfoByProfileId = async (
  profileId: string,
  signal?: AbortSignal,
): Promise<GetLeaguesWithInfoResult> => {
  const result = await getAllLeaguesWithInfo(
    undefined,
    undefined,
    signal,
    true,
  );

  if (!result.success) {
    return result;
  }

  return {
    success: true,
    data: result.data.filter((league) =>
      league.participants.some((participant) =>
        participant.profile_id === profileId
      )
    ),
  };
};

// -- Get Leagues with Info by Hosting Squad ID -- //
export const getLeaguesWithInfoBySquadId = async (
  squadId: string,
  signal?: AbortSignal,
): Promise<GetLeaguesWithInfoResult> => {
  const result = await getAllLeaguesWithInfo(
    undefined,
    undefined,
    signal,
    true,
  );

  if (!result.success) {
    return result;
  }

  return {
    success: true,
    data: result.data.filter((league) => league.hosting_squad_id === squadId),
  };
};

// -- Get League by ID -- //
export const getLeagueById = async (
  leagueId: string,
): Promise<CreateLeagueResult> => {
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
    includesPreQual = false,
  }: CreateLeaguePayload,
): Promise<CreateLeagueResult> => {
  const currentTimezone = getCurrentTimezone();
  const defaultDescription = `This is ${hostingSquadName}'s League for ${
    convertGameTypeToFullName(gameType)
  }.`;

  const coverResult = await resolveCoverPersistence(accountId, coverImage);

  if (!coverResult.success) {
    return coverResult;
  }

  const { coverType, coverValue } = coverResult;

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
    includesPreQual,
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

  const applicationOptionsResult = await addLeagueApplicationOptions({
    leagueId: data.id,
    openRoles: DEFAULT_LEAGUE_APPLICATION_OPEN_ROLES,
    contactInfo: true,
    isClosed: false,
  });

  if (!applicationOptionsResult.success) {
    return {
      success: false,
      error: {
        message: applicationOptionsResult.error.message,
        code: applicationOptionsResult.error.code ||
          "APPLICATION_OPTIONS_CREATION_FAILED",
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
    leagueStatus,
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

  if (leagueStatus !== undefined) {
    updateData.league_status = leagueStatus;
  }

  // Handle cover image upload if provided
  if (coverImage !== undefined) {
    const coverResult = await resolveCoverPersistence(accountId, coverImage);

    if (!coverResult.success) {
      return coverResult;
    }

    updateData.cover_type = coverResult.coverType;
    updateData.cover_value = coverResult.coverValue;
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
  if (data.cover_type === "upload") {
    data.cover_value = resolveCoverValue(data.cover_type, data.cover_value);
  }
  return {
    success: true,
    data,
  };
};

// -- Delete League Storage Assets -- //
// Deletes all briefing and rules files for a league
const deleteLeagueStorageAssets = async (
  leagueId: string,
  roundIds: string[],
): Promise<void> => {
  // Delete league rules images from storage
  const { data: rulesList, error: rulesListError } = await supabase.storage
    .from("rules")
    .list(leagueId);

  if (!rulesListError && rulesList && rulesList.length > 0) {
    const ruleFilePaths = rulesList.map((file) => `${leagueId}/${file.name}`);
    await supabase.storage.from("rules").remove(ruleFilePaths);
  }

  // Delete round briefing images from storage
  for (const roundId of roundIds) {
    const { data: briefingsList, error: briefingsListError } = await supabase.storage
      .from("briefings")
      .list(roundId);

    if (!briefingsListError && briefingsList && briefingsList.length > 0) {
      const briefingFilePaths = briefingsList.map((file) => `${roundId}/${file.name}`);
      await supabase.storage.from("briefings").remove(briefingFilePaths);
    }
  }
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

  const { data: seasonRows, error: seasonsFetchError } = await supabase
    .from("league_season")
    .select("id")
    .eq("league_id", leagueId);

  if (seasonsFetchError) {
    return {
      success: false,
      error: {
        message: seasonsFetchError.message,
        code: seasonsFetchError.code || "LEAGUE_SEASONS_FETCH_FAILED",
        status: 500,
      },
    };
  }

  const seasonIds = (seasonRows ?? []).map((season) => season.id as string);

  // Fetch round IDs for storage cleanup before deletion
  let roundIds: string[] = [];
  if (seasonIds.length > 0) {
    const { data: roundRows } = await supabase
      .from("round")
      .select("id")
      .in("season_id", seasonIds);

    roundIds = (roundRows ?? []).map((round) => round.id as string);
  }

  const { data: participantRows, error: participantsFetchError } = await supabase
    .from("league_participants")
    .select("id")
    .eq("league_id", leagueId);

  if (participantsFetchError) {
    return {
      success: false,
      error: {
        message: participantsFetchError.message,
        code: participantsFetchError.code || "LEAGUE_PARTICIPANTS_FETCH_FAILED",
        status: 500,
      },
    };
  }

  const participantIds = (participantRows ?? []).map((participant) => participant.id as string);

  // Delete all storage assets (rules and briefings) before deleting database records
  await deleteLeagueStorageAssets(leagueId, roundIds);

  const { error: followsDeleteError } = await supabase
    .from("league_follows")
    .delete()
    .eq("league_id", leagueId);

  if (followsDeleteError) {
    return {
      success: false,
      error: {
        message: followsDeleteError.message,
        code: followsDeleteError.code || "LEAGUE_FOLLOWS_DELETION_FAILED",
        status: 500,
      },
    };
  }

  const { error: invitesDeleteError } = await supabase
    .from("league_invites")
    .delete()
    .eq("league_id", leagueId);

  if (invitesDeleteError) {
    return {
      success: false,
      error: {
        message: invitesDeleteError.message,
        code: invitesDeleteError.code || "LEAGUE_INVITES_DELETION_FAILED",
        status: 500,
      },
    };
  }

  const { error: joinRequestsDeleteError } = await supabase
    .from("league_join_request")
    .delete()
    .eq("league_id", leagueId);

  if (joinRequestsDeleteError) {
    return {
      success: false,
      error: {
        message: joinRequestsDeleteError.message,
        code: joinRequestsDeleteError.code || "LEAGUE_JOIN_REQUESTS_DELETION_FAILED",
        status: 500,
      },
    };
  }

  if (seasonIds.length > 0) {
    for (const seasonId of seasonIds) {
      const eventsDeleteResult = await deleteEventsBySeasonId(seasonId);

      if (!eventsDeleteResult.success) {
        return {
          success: false,
          error: {
            message: eventsDeleteResult.error.message,
            code: eventsDeleteResult.error.code || "LEAGUE_EVENTS_DELETION_FAILED",
            status: eventsDeleteResult.error.status,
          },
        };
      }
    }

    const { error: roundsDeleteError } = await supabase
      .from("round")
      .delete()
      .in("season_id", seasonIds);

    if (roundsDeleteError) {
      return {
        success: false,
        error: {
          message: roundsDeleteError.message,
          code: roundsDeleteError.code || "LEAGUE_ROUNDS_DELETION_FAILED",
          status: 500,
        },
      };
    }

    const { error: seasonDriversDeleteError } = await supabase
      .from("league_season_driver")
      .delete()
      .in("season_id", seasonIds);

    if (seasonDriversDeleteError) {
      return {
        success: false,
        error: {
          message: seasonDriversDeleteError.message,
          code: seasonDriversDeleteError.code || "LEAGUE_SEASON_DRIVERS_DELETION_FAILED",
          status: 500,
        },
      };
    }

    const { error: seasonTeamsDeleteError } = await supabase
      .from("league_season_team")
      .delete()
      .in("season_id", seasonIds);

    if (seasonTeamsDeleteError) {
      return {
        success: false,
        error: {
          message: seasonTeamsDeleteError.message,
          code: seasonTeamsDeleteError.code || "LEAGUE_SEASON_TEAMS_DELETION_FAILED",
          status: 500,
        },
      };
    }

    const { error: seasonDivisionsDeleteError } = await supabase
      .from("league_season_division")
      .delete()
      .in("season_id", seasonIds);

    if (seasonDivisionsDeleteError) {
      return {
        success: false,
        error: {
          message: seasonDivisionsDeleteError.message,
          code: seasonDivisionsDeleteError.code || "LEAGUE_SEASON_DIVISIONS_DELETION_FAILED",
          status: 500,
        },
      };
    }
  }

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
    .eq("league_id", leagueId);

  if (participantsDeleteError) {
    return {
      success: false,
      error: {
        message: participantsDeleteError.message,
        code: participantsDeleteError.code ||
          "LEAGUE_PARTICIPANTS_DELETION_FAILED",
        status: 500,
      },
    };
  }

  for (const seasonId of seasonIds) {
    const removeSeasonResult = await removeLeagueSeason({ seasonId });

    if (!removeSeasonResult.success) {
      return {
        success: false,
        error: {
          message: removeSeasonResult.error.message,
          code:
            removeSeasonResult.error.code ||
            "LEAGUE_SEASON_CASCADE_DELETION_FAILED",
          status: removeSeasonResult.error.status,
        },
      };
    }
  }

  const { error: applicationOptionsDeleteError } = await supabase
    .from("league_application_options")
    .delete()
    .eq("league_id", leagueId);

  if (applicationOptionsDeleteError) {
    return {
      success: false,
      error: {
        message: applicationOptionsDeleteError.message,
        code: applicationOptionsDeleteError.code ||
          "LEAGUE_APPLICATION_OPTIONS_DELETION_FAILED",
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

