import { supabase } from "@/lib/supabase";
import type {
  AddLeagueParticipantPayload,
  AddLeagueParticipantResult,
  CreateLeaguePayload,
  CreateLeagueResult,
  CreateLeagueSeasonPayload,
  CreateLeagueSeasonResult,
  GetLeaguesResult,
} from "@/types/league.types";
import { normalizeName } from "@/utils/normalizeName";

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

  const { data: directorRows, error: participantsError } = await supabase
    .from("league_participants")
    .select("league_id")
    .in("profile_id", profileIds)
    .eq("league_role", "director");

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

  if (!directorRows.length) {
    return { success: true, data: [] };
  }

  const leagueIds = [...new Set(directorRows.map((row) => row.league_id))];

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
