import { supabase } from "@/lib/supabase";
import type {
  AddLeagueApplicationOptionsPayload,
  AddLeagueApplicationOptionsResult,
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
  CreateLeagueJoinRequestPayload,
  CreateLeagueJoinRequestResult,
  RemoveLeagueJoinRequestPayload,
  RemoveLeagueJoinRequestResult,
  GetLeagueJoinRequestsResult,
  GetLeagueApplicationOptionsResult,
  JoinLeagueWithRolesPayload,
  JoinLeagueWithRolesResult,
  RemoveLeagueApplicationOptionsPayload,
  RemoveLeagueApplicationOptionsResult,
  RemoveLeagueParticipantRolePayload,
  RemoveLeagueParticipantRoleResult,
  RemoveLeagueSeasonPayload,
  RemoveLeagueSeasonResult,
  FollowLeaguePayload,
  FollowLeagueResult,
  UnfollowLeaguePayload,
  UnfollowLeagueResult,
  RemoveLeagueFollowerPayload,
  RemoveLeagueFollowerResult,
  GetLeagueFollowersResult,
  GetLeagueFollowingResult,
  // UpdateLeagueParticipantRolePayload,
  // UpdateLeagueParticipantRoleResult,
  UpdateLeaguePayload,
  UpdateLeagueApplicationOptionsPayload,
  UpdateLeagueApplicationOptionsResult,
  UpdateLeagueResult,
  UpdateLeagueSeasonPayload,
  UpdateLeagueSeasonResult,
} from "@/types/league.types";
import { LEAGUE_PARTICIPANT_ROLES } from "@/types/league.types";
import { resolveAvatarValue } from "@/services/profile.service";
import { convertGameTypeToFullName } from "@/utils/convertGameTypes";
import { normalizeName } from "@/utils/normalizeName";
import { getCurrentTimezone } from "@/utils/timezone";

const DEFAULT_LEAGUE_APPLICATION_OPEN_ROLES: typeof LEAGUE_PARTICIPANT_ROLES[number][] = [
  "driver",
  "steward",
  "broadcaster",
  "staff",
];

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
): Promise<GetLeaguesWithInfoResult> => {
  const result = await getAllLeaguesWithInfo(undefined, undefined, signal, true);

  if (!result.success) {
    return result;
  }

  return {
    success: true,
    data: result.data.filter((league) =>
      league.participants.some((participant) => participant.account_id === accountId),
    ),
  };
};

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
        code: applicationOptionsResult.error.code || "APPLICATION_OPTIONS_CREATION_FAILED",
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

// -- Add League Application Options -- //
export const addLeagueApplicationOptions = async (
  {
    leagueId,
    openRoles,
    contactInfo,
    isClosed,
  }: AddLeagueApplicationOptionsPayload,
): Promise<AddLeagueApplicationOptionsResult> => {
  const { data, error } = await supabase
    .from("league_application_options")
    .insert({
      league_id: leagueId,
      open_roles: [...new Set(openRoles)],
      contact_info: contactInfo,
      is_closed: isClosed ?? false,
    })
    .select("id, league_id, open_roles, contact_info, is_closed")
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

// -- Get League Application Options by League ID -- //
export const getLeagueApplicationOptionsByLeagueId = async (
  leagueId: string,
): Promise<GetLeagueApplicationOptionsResult> => {
  const { data, error } = await supabase
    .from("league_application_options")
    .select("id, league_id, open_roles, contact_info, is_closed")
    .eq("league_id", leagueId)
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

// -- Update League Application Options -- //
export const updateLeagueApplicationOptions = async (
  {
    leagueId,
    openRoles,
    contactInfo,
  }: UpdateLeagueApplicationOptionsPayload,
): Promise<UpdateLeagueApplicationOptionsResult> => {
  const updateData: Record<string, unknown> = {};

  if (openRoles !== undefined) {
    updateData.open_roles = [...new Set(openRoles)];
  }

  if (contactInfo !== undefined) {
    updateData.contact_info = contactInfo;
  }

  const { data, error } = await supabase
    .from("league_application_options")
    .update(updateData)
    .eq("league_id", leagueId)
    .select("id, league_id, open_roles, contact_info, is_closed")
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

// -- Remove League Application Options -- //
export const removeLeagueApplicationOptions = async (
  { leagueId }: RemoveLeagueApplicationOptionsPayload,
): Promise<RemoveLeagueApplicationOptionsResult> => {
  const { error } = await supabase
    .from("league_application_options")
    .delete()
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

  return {
    success: true,
  };
};

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

// Backward-compatible aliases
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

export const getLeagueFollowers = async (
  leagueId: string,
) => {
  const result = await getLeagueFollowersService(leagueId);
  return result.success ? result.data : [];
};

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

export const checkIfFollowingLeague = async (
  leagueId: string,
  accountId: string,
): Promise<boolean> => isFollowingLeagueService(leagueId, accountId);

export const getFollowedLeaguesByAccountId = async (
  accountId: string,
): Promise<GetLeaguesResult> => getFollowingLeagues(accountId);

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
            message: `Role assignment failed and rollback failed: ${roleResult.error.message}`,
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
    .select("id, created_at, league_id, profile_id, account_id, contact_info, requested_role")
    .eq("league_id", leagueId)
    .order("created_at", { ascending: false });

  if (signal) {
    joinRequestsQuery = joinRequestsQuery.abortSignal(signal);
  }

  const { data: joinRequests, error: joinRequestsError } = await joinRequestsQuery;

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

  const profileIds = [...new Set(joinRequests.map((request) => request.profile_id))];

  let profilesQuery = supabase
    .from("profiles")
    .select("id, username, avatar_type, avatar_value")
    .in("id", profileIds);

  if (signal) {
    profilesQuery = profilesQuery.abortSignal(signal);
  }

  const { data: profiles, error: profilesError } = await profilesQuery;

  if (profilesError) {
    if (profilesError.code === "ABORT" || profilesError.message?.includes("abort")) {
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
          avatar_value: resolveAvatarValue(profile.avatar_type, profile.avatar_value),
        };
      })
      .filter((request): request is NonNullable<typeof request> => request !== null),
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
