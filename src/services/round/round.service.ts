import { supabase } from "@/lib/supabase";
import type { CreateRoundPayload, CreateRoundResponse, GetRoundByIdResponse, GetRoundsResponse, RoundTable, UpdateRoundResponse, UpdateRoundPayload, DeleteRoundResponse, UploadRoundBriefingImagePayload, UploadRoundBriefingImageResponse } from "@/types/round.types";


// -- Round Service -- //

const ROUND_BRIEFING_BUCKET = "briefings";

const ROUND_BRIEFING_PUBLIC_URL_SEGMENT = `/storage/v1/object/public/${ROUND_BRIEFING_BUCKET}/`;
const ROUND_BRIEFING_SIGNED_URL_SEGMENT = `/storage/v1/object/sign/${ROUND_BRIEFING_BUCKET}/`;


// -- Round Briefing Utilities -- //

// This function sanitizes a file name for use in storage by removing invalid characters and replacing spaces with hyphens.
const sanitizeBriefingFileName = (fileName: string): string =>
  fileName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "");

// This function extracts the file path from a round briefing image URL, handling both public and signed URLs.
const extractRoundBriefingImagePath = (src: string): string | null => {
  if (!src || src.startsWith("data:") || src.startsWith("blob:")) {
    return null;
  }

  const publicUrlIndex = src.indexOf(ROUND_BRIEFING_PUBLIC_URL_SEGMENT);

  if (publicUrlIndex >= 0) {
    return decodeURIComponent(
      src.slice(publicUrlIndex + ROUND_BRIEFING_PUBLIC_URL_SEGMENT.length).split("?")[0] ?? "",
    );
  }

  const signedUrlIndex = src.indexOf(ROUND_BRIEFING_SIGNED_URL_SEGMENT);

  if (signedUrlIndex >= 0) {
    return decodeURIComponent(
      src.slice(signedUrlIndex + ROUND_BRIEFING_SIGNED_URL_SEGMENT.length).split("?")[0] ?? "",
    );
  }

  if (/^https?:\/\//i.test(src)) {
    return null;
  }

  return src;
};

// Maps the images in a round briefing to new sources based on a provided transformation function.
const mapRoundBriefingImages = (
  briefing: string | null | undefined,
  transform: (src: string) => string | null,
): string | undefined => {
  if (briefing == null || typeof DOMParser === "undefined") {
    return briefing ?? undefined;
  }

  const document = new DOMParser().parseFromString(briefing, "text/html");
  const images = Array.from(document.querySelectorAll("img"));

  images.forEach((image) => {
    const currentSrc = image.getAttribute("src");

    if (!currentSrc) {
      return;
    }

    const nextSrc = transform(currentSrc);

    if (nextSrc) {
      image.setAttribute("src", nextSrc);
    }
  });

  return document.body.innerHTML;
};

// Normalizes the round briefing content for storage by converting image sources to their corresponding file paths.
const normalizeRoundBriefingForStorage = (briefing: string | undefined): string | undefined =>
  mapRoundBriefingImages(briefing, (src) => extractRoundBriefingImagePath(src));

// Resolves the round briefing content for display by converting image file paths to their corresponding public URLs.
const resolveRoundBriefingForDisplay = (briefing: string | undefined): string | undefined =>
  mapRoundBriefingImages(briefing, (src) => {
    const filePath = extractRoundBriefingImagePath(src);

    if (!filePath) {
      return /^https?:\/\//i.test(src) || src.startsWith("data:") ? src : null;
    }

    return getRoundBriefingImageUrl(filePath);
  });

// This function generates an alphabetic suffix for a round name based on its sequence index.
// For example, 0 corresponds to "A", 1 to "B", and so on.
const getRoundBriefingImagePaths = (briefing: string | null | undefined): string[] => {
  if (briefing == null || typeof DOMParser === "undefined") {
    return [];
  }

  const document = new DOMParser().parseFromString(briefing, "text/html");
  const imagePaths = Array.from(document.querySelectorAll("img"))
    .map((image) => image.getAttribute("src"))
    .filter((src): src is string => Boolean(src))
    .map((src) => extractRoundBriefingImagePath(src))
    .filter((path): path is string => Boolean(path));

  return Array.from(new Set(imagePaths));
};

// This function generates an alphabetic suffix for a round name based on its sequence index.
const withResolvedRoundBriefing = (round: RoundTable): RoundTable => ({
  ...round,
  briefing: resolveRoundBriefingForDisplay(round.briefing),
});


// -- Round Service Functions -- //

// Get a round by its ID
export const getRoundById = async (roundId: string): Promise<GetRoundByIdResponse> => {
  const { data, error } = await supabase
    .from("round")
    .select("*")
    .eq("id", roundId)
    .single();

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        status: 500,
      },
    };
  }

  const roundData = data as RoundTable;

  return {
    success: true,
    data: withResolvedRoundBriefing(roundData),
  };
};

// Get all rounds for a specific division
export const getRoundsByDivisionId = async (divisionId: string): Promise<GetRoundsResponse> => {
  const { data, error } = await supabase
    .from("round")
    .select("*")
    .eq("division_id", divisionId);

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        status: 500,
      },
    };
  }

  const roundData = (data ?? []) as RoundTable[];

  return {
    success: true,
    data: roundData.map(withResolvedRoundBriefing),
  };
};

// Get all rounds for a specific season
export const getRoundsBySeasonId = async (seasonId: string): Promise<GetRoundsResponse> => {
  const { data, error } = await supabase
    .from("round")
    .select("*")
    .eq("season_id", seasonId);

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        status: 500,
      },
    };
  }

  const roundData = (data ?? []) as RoundTable[];

  return {
    success: true,
    data: roundData.map(withResolvedRoundBriefing),
  };
};

// Create a new round
export const createRound = async ({ roundName, divisionId, seasonId }: CreateRoundPayload): Promise<CreateRoundResponse> => {
  const { data, error } = await supabase
    .from("round")
    .insert([{ round_name: roundName, division_id: divisionId, season_id: seasonId }])
    .select()
    .single();

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        status: 500,
      },
    };
  }

  return {
    success: true,
    data: data,
  };
};

// Update an existing round
export const updateRound = async ({ roundId, roundName, briefing }: UpdateRoundPayload): Promise<UpdateRoundResponse> => {
  const updateData: Record<string, unknown> = {};
  if (roundName !== undefined) updateData.round_name = roundName;
  if (briefing !== undefined) updateData.briefing = normalizeRoundBriefingForStorage(briefing);

  const { data, error } = await supabase
    .from("round")
    .update(updateData)
    .eq("id", roundId)
    .select()
    .single();

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        status: 500,
      },
    };
  }

  const roundData = data as RoundTable;

  return {
    success: true,
    data: withResolvedRoundBriefing(roundData),
  };
};

// Delete a round by its ID
export const deleteRound = async (roundId: string): Promise<DeleteRoundResponse> => {
  // First, retrieve the round to get its briefing content and associated image paths
  const { data: roundData, error: roundError } = await supabase
    .from("round")
    .select("briefing")
    .eq("id", roundId)
    .maybeSingle();

  if (roundError) {
    return {
      success: false,
      error: {
        message: roundError.message,
        code: roundError.code,
        status: 500,
      },
    };
  }

  const briefingImagePaths = getRoundBriefingImagePaths(roundData?.briefing);

  // Delete the briefing images from storage if they exist
  if (briefingImagePaths.length > 0) {
    const { error: storageError } = await supabase.storage
      .from(ROUND_BRIEFING_BUCKET)
      .remove(briefingImagePaths);

    if (storageError) {
      return {
        success: false,
        error: {
          message: storageError.message,
          code: storageError.name,
          status: 500,
        },
      };
    }
  }

  const { error } = await supabase
    .from("round")
    .delete()
    .eq("id", roundId);

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        status: 500,
      },
    };
  }

  return {
    success: true,
  };
};

// Delete all rounds for a specific division
export const deleteRoundsByDivisionId = async (divisionId: string): Promise<DeleteRoundResponse> => {
  const { error } = await supabase
    .from("round")
    .delete()
    .eq("division_id", divisionId);

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        status: 500,
      },
    };
  }

  return {
    success: true,
  };
};

// Delete all rounds for a specific season
export const deleteRoundsBySeasonId = async (seasonId: string): Promise<DeleteRoundResponse> => {
  const { error } = await supabase
    .from("round")
    .delete()
    .eq("season_id", seasonId);

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        status: 500,
      },
    };
  }

  return {
    success: true,
  };
};

// Upload an image for a round briefing
export const uploadRoundBriefingImage = async (
 { roundId, file }: UploadRoundBriefingImagePayload
): Promise<UploadRoundBriefingImageResponse> => {
  const safeFileName = sanitizeBriefingFileName(file.name) || "briefing-image";
  const filePath = `${roundId}/${file.lastModified}-${file.size}-${safeFileName}`;

  const { error: uploadError } = await supabase.storage
    .from(ROUND_BRIEFING_BUCKET)
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    return {
      success: false,
      error: {
        message: uploadError.message,
        code: "SERVER_ERROR",
        status: 500,
      },
    };
  }

  const { data } = supabase.storage
    .from(ROUND_BRIEFING_BUCKET)
    .getPublicUrl(filePath);

  return {
    success: true,
    data: {
      src: data.publicUrl,
      path: filePath,
    },
  };
};

// Get the public URL of a round briefing image
export const getRoundBriefingImageUrl = (filePath: string): string => {
  const { data } = supabase.storage
    .from(ROUND_BRIEFING_BUCKET)
    .getPublicUrl(filePath);

  return data.publicUrl;
};