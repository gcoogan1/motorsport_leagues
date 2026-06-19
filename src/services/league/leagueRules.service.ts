import { supabase } from "@/lib/supabase";
import type {
  AddLeagueRulesPayload,
  AddLeagueRulesResult,
  GetLeagueRulesResult,
  UploadLeagueRulesImagePayload,
  UploadLeagueRulesImageResult,
  UpdateLeagueRulesPayload,
  UpdateLeagueRulesResult,
} from "@/types/rules.types";

const LEAGUE_RULES_BUCKET = "rules";
const LEAGUE_RULES_PUBLIC_URL_SEGMENT = `/storage/v1/object/public/${LEAGUE_RULES_BUCKET}/`;
const LEAGUE_RULES_SIGNED_URL_SEGMENT = `/storage/v1/object/sign/${LEAGUE_RULES_BUCKET}/`;

const sanitizeRulesFileName = (fileName: string): string =>
  fileName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "");

const extractRulesImagePath = (src: string): string | null => {
  if (!src || src.startsWith("data:") || src.startsWith("blob:")) {
    return null;
  }

  const publicUrlIndex = src.indexOf(LEAGUE_RULES_PUBLIC_URL_SEGMENT);

  if (publicUrlIndex >= 0) {
    return decodeURIComponent(
      src.slice(publicUrlIndex + LEAGUE_RULES_PUBLIC_URL_SEGMENT.length).split("?")[0] ?? "",
    );
  }

  const signedUrlIndex = src.indexOf(LEAGUE_RULES_SIGNED_URL_SEGMENT);

  if (signedUrlIndex >= 0) {
    return decodeURIComponent(
      src.slice(signedUrlIndex + LEAGUE_RULES_SIGNED_URL_SEGMENT.length).split("?")[0] ?? "",
    );
  }

  if (/^https?:\/\//i.test(src)) {
    return null;
  }

  return src;
};

const mapRulesImages = (
  rules: string | null | undefined,
  transform: (src: string) => string | null,
): string | undefined => {
  if (rules == null || typeof DOMParser === "undefined") {
    return rules ?? undefined;
  }

  const document = new DOMParser().parseFromString(rules, "text/html");
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

const normalizeRulesForStorage = (rules: string | undefined): string | undefined =>
  mapRulesImages(rules, (src) => extractRulesImagePath(src));

const getLeagueRulesImageUrl = (filePath: string): string => {
  const { data } = supabase.storage
    .from(LEAGUE_RULES_BUCKET)
    .getPublicUrl(filePath);

  return data.publicUrl;
};

const resolveRulesForDisplay = (rules: string | undefined): string | undefined =>
  mapRulesImages(rules, (src) => {
    const filePath = extractRulesImagePath(src);

    if (!filePath) {
      return /^https?:\/\//i.test(src) || src.startsWith("data:") ? src : null;
    }

    return getLeagueRulesImageUrl(filePath);
  });

export const getLeagueRulesByLeagueId = async (
  leagueId: string,
): Promise<GetLeagueRulesResult> => {
  const { data, error } = await supabase
    .from("rules")
    .select("id, created_at, league_id, rules")
    .eq("league_id", leagueId)
    .maybeSingle();

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

  return {
    success: true,
    data: data
      ? {
          ...data,
          rules: resolveRulesForDisplay(data.rules) ?? "",
        }
      : null,
  };
};

export const addLeagueRules = async ({
  leagueId,
  rules,
}: AddLeagueRulesPayload): Promise<AddLeagueRulesResult> => {
  const { data, error } = await supabase
    .from("rules")
    .insert({
      league_id: leagueId,
      rules: normalizeRulesForStorage(rules) ?? "",
    })
    .select("id, created_at, league_id, rules")
    .single();

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

  return {
    success: true,
    data: {
      ...data,
      rules: resolveRulesForDisplay(data.rules) ?? "",
    },
  };
};

export const updateLeagueRules = async ({
  leagueId,
  rules,
}: UpdateLeagueRulesPayload): Promise<UpdateLeagueRulesResult> => {
  const { data, error } = await supabase
    .from("rules")
    .update({ rules: normalizeRulesForStorage(rules) ?? "", edited_at: new Date().toISOString() })
    .eq("league_id", leagueId)
    .select("id, created_at, league_id, rules, edited_at")
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
      rules: resolveRulesForDisplay(data.rules) ?? "",
    },
  };
};

export const uploadLeagueRulesImage = async (
  { leagueId, file }: UploadLeagueRulesImagePayload,
): Promise<UploadLeagueRulesImageResult> => {
  const safeFileName = sanitizeRulesFileName(file.name) || "rules-image";
  const filePath = `${leagueId}/${Date.now()}-${Math.random().toString(36).slice(2)}-${safeFileName}`;

  const { error } = await supabase.storage
    .from(LEAGUE_RULES_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
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

  const { data } = supabase.storage
    .from(LEAGUE_RULES_BUCKET)
    .getPublicUrl(filePath);

  return {
    success: true,
    data: {
      src: data.publicUrl,
      path: filePath,
    },
  };
};
