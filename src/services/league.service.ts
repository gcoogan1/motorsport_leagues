import { supabase } from "@/lib/supabase";
import type {
  AddLeagueParticipantPayload,
  AddLeagueParticipantResult,
  CreateLeaguePayload,
  CreateLeagueResult,
  CreateLeagueSeasonPayload,
  CreateLeagueSeasonResult,
  DeleteLeagueResult,
  GetLeagueParticipantsResult,
  GetLeagueSeasonsResult,
  GetLeaguesResult,
  RemoveLeagueParticipantPayload,
  RemoveLeagueParticipantResult,
  RemoveLeagueSeasonPayload,
  RemoveLeagueSeasonResult,
  UpdateLeagueParticipantRolePayload,
  UpdateLeagueParticipantRoleResult,
  UpdateLeaguePayload,
  UpdateLeagueResult,
  UpdateLeagueSeasonPayload,
  UpdateLeagueSeasonResult,
} from "@/types/league.types";
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
    leagueRole: "director",
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
    leagueRole,
  }: AddLeagueParticipantPayload,
): Promise<AddLeagueParticipantResult> => {
  const { data, error } = await supabase
    .from("league_participants")
    .insert({
      league_id: leagueId,
      profile_id: profileId,
      league_role: leagueRole,
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

// -- Update League Participant Role -- //
export const updateLeagueParticipantRole = async (
  {
    leagueId,
    profileId,
    newLeagueRole,
  }: UpdateLeagueParticipantRolePayload,
): Promise<UpdateLeagueParticipantRoleResult> => {
  const { error } = await supabase
    .from("league_participants")
    .update({ league_role: newLeagueRole })
    .eq("league_id", leagueId)
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
    .select("id, profile_id, league_role")
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
          league_role: participant.league_role,
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
