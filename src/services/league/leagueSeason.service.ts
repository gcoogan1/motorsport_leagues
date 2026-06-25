import { supabase } from "@/lib/supabase";
import type {
  CreateLeagueSeasonPayload,
  CreateLeagueSeasonResult,
  GetLeagueSeasonsResult,
  RemoveLeagueSeasonPayload,
  RemoveLeagueSeasonResult,
  UpdateLeagueSeasonPayload,
  UpdateLeagueSeasonResult,
} from "@/types/league.types";
import { createLeagueSeasonDivision } from "./leagueSeasonDivision.service";

// --- League Season Service --- //

const POSTER_BUCKET = "poster";
const DEFAULT_POSTER_FILE = "defaultOverview.png";
const POSTER_PUBLIC_PATH_SEGMENT = `/storage/v1/object/public/${POSTER_BUCKET}/`;

type UploadLeagueSeasonPosterImagePayload = {
  accountId: string;
  seasonId: string;
  file: File;
};

type UploadLeagueSeasonPosterImageResult =
  | {
      success: true;
      data: {
        src: string;
        path: string;
      };
    }
  | {
      success: false;
      error: {
        message: string;
        code: string;
        status: number;
      };
    };

const getPosterPublicUrl = (posterPath: string): string => {
  const { data } = supabase.storage.from(POSTER_BUCKET).getPublicUrl(posterPath);
  return data.publicUrl;
};

const getStoredPosterPath = (posterUrl?: string): string => {
  if (!posterUrl) {
    return DEFAULT_POSTER_FILE;
  }

  const publicPathIndex = posterUrl.indexOf(POSTER_PUBLIC_PATH_SEGMENT);

  if (publicPathIndex === -1) {
    return posterUrl;
  }

  return decodeURIComponent(
    posterUrl
      .slice(publicPathIndex + POSTER_PUBLIC_PATH_SEGMENT.length)
      .split("?")[0] ?? DEFAULT_POSTER_FILE,
  );
};

export const resolveLeagueSeasonPosterUrl = (posterUrl?: string): string =>
  getPosterPublicUrl(getStoredPosterPath(posterUrl));

export const uploadLeagueSeasonPosterImage = async ({
  accountId,
  seasonId,
  file,
}: UploadLeagueSeasonPosterImagePayload): Promise<UploadLeagueSeasonPosterImageResult> => {
  const fileExt = file.name.split(".").pop();
  const filePath = `${accountId}/${seasonId}-${crypto.randomUUID()}.${fileExt}`;

  const { error } = await supabase.storage
    .from(POSTER_BUCKET)
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type,
    });

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: "SERVER_ERROR",
        status: 500,
      },
    };
  }

  const { data } = supabase.storage.from(POSTER_BUCKET).getPublicUrl(filePath);

  return {
    success: true,
    data: {
      src: data.publicUrl,
      path: filePath,
    },
  };
};

// -- Create League Season -- //
export const createLeagueSeason = async ({
  leagueId,
  seasonName,
  numOfDivisions,
  isTeamChampionship,
  includesPreQual = false,
}: CreateLeagueSeasonPayload): Promise<CreateLeagueSeasonResult> => {

  // Create season 
  const { data: season, error: seasonError } = await supabase
    .from("league_season")
    .insert({
      league_id: leagueId,
      season_name: seasonName,
      num_of_divisions: numOfDivisions,
      is_team_championship: isTeamChampionship,
      season_status: "setup",
      includes_pre_qual: includesPreQual,
      poster_url: DEFAULT_POSTER_FILE,
    })
    .select()
    .single();

  if (seasonError || !season) {
    return {
      success: false,
      error: {
        message: seasonError?.message || "Failed to create season.",
        code: seasonError?.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  const divisionsToCreate = includesPreQual
    ? [
        {
          divisionNumber: 0,
          divisionName: "Pre-Qualifying",
        },
        ...Array.from({ length: numOfDivisions }, (_, index) => ({
          divisionNumber: index + 1,
          divisionName: `Division ${index + 1}`,
        })),
      ]
    : Array.from({ length: numOfDivisions }, (_, index) => ({
        divisionNumber: index + 1,
        divisionName: `Division ${index + 1}`,
      }));

  // Create divisions for the season
  const divisionResults = await Promise.all(
    divisionsToCreate.map((division) =>
      createLeagueSeasonDivision({
        seasonId: season.id,
        divisionNumber: division.divisionNumber,
        divisionName: division.divisionName,
      }),
    ),
  );

  //  Check for division creation failures 
  const failedDivision = divisionResults.find(
    (result) => !result.success,
  );

  // Rollback season if ANY division fails
  if (failedDivision) {
    await supabase
      .from("league_season")
      .delete()
      .eq("id", season.id);

    return {
      success: false,
      error: {
        message:
          failedDivision.error?.message ||
          "Failed to create season divisions. Season creation rolled back.",
        code: failedDivision.error?.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  return {
    success: true,
    data: {
      ...season,
      poster_url: resolveLeagueSeasonPosterUrl(season.poster_url),
    },
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
    data: (data ?? []).map((season) => ({
      ...season,
      poster_url: resolveLeagueSeasonPosterUrl(season.poster_url),
    })),
  };
};

// -- Update League Season -- //
// Note: Only season name and status can be updated. Number of divisions and team championship status are fixed upon season creation.
export const updateLeagueSeason = async (
  {
    seasonId,
    seasonName,
    seasonStatus,
    posterUrl,
  }: UpdateLeagueSeasonPayload,
): Promise<UpdateLeagueSeasonResult> => {

  const updatePayload: {
    season_name: string;
    season_status: UpdateLeagueSeasonPayload["seasonStatus"];
    poster_url?: string;
  } = {
    season_name: seasonName,
    season_status: seasonStatus,
  };

  if (posterUrl !== undefined) {
    updatePayload.poster_url = getStoredPosterPath(posterUrl);
  }

  const { data, error } = await supabase
    .from("league_season")
    .update(updatePayload)
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
    data: {
      ...data,
      poster_url: resolveLeagueSeasonPosterUrl(data.poster_url),
    },
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
