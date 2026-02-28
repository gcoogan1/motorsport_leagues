import { supabase } from "@/lib/supabase";
import type {
  CreateSquadPayload,
  CreateSquadResult,
  GetSquadsResult,
} from "@/types/squad.types";
import { normalizeName } from "@/utils/normalizeName";

export const resolveBannerValue = (
  bannerType: "preset" | "upload",
  bannerValue: string,
) => {
  if (bannerType !== "upload") return bannerValue;

  // Get the public URL for the uploaded banner from Supabase Storage
  const { data } = supabase.storage
    .from("banners")
    .getPublicUrl(bannerValue);

  return data.publicUrl;
};

export const getSquadsByAccountId = async (
  accountId: string,
): Promise<GetSquadsResult> => {
  const { data, error } = await supabase
    .from("squads")
    .select("*")
    .eq("founder_account_id", accountId);

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
    data: data.map((squad) => ({
      ...squad,
      banner_value: resolveBannerValue(squad.banner_type, squad.banner_value),
    })),
  };
};

export const isSquadNameAvailable = async (name: string): Promise<boolean> => {
  const normalizedSquadName = normalizeName(name);

  const { data, error } = await supabase
    .from("squads")
    .select("id")
    .eq("squad_name_normalized", normalizedSquadName)
    .single();

  if (error && error.code !== "PGRST116") {
    // If the error is not "No rows found", log it and assume the name is not available
    console.error("Error checking squad name availability:", error);
    return false;
  }

  // If data is returned, the name is taken; if no data, it's available
  return !data;
};

// -- Create Squad with Banner -- //
export const createSquadWithBanner = async ({
  founderAccountId,
  founderProfileId,
  squadName,
  banner,
}: CreateSquadPayload): Promise<CreateSquadResult> => {
  let bannerType: "preset" | "upload";
  let bannerValue: string;

  // --- Handle banner ---
  if (banner.type === "preset") {
    bannerType = "preset";
    bannerValue = banner.variant;
  } else {
    bannerType = "upload";

    // Generate a unique file path for the banner upload
    const fileExt = banner.file.name.split(".").pop();
    const filePath = `${founderAccountId}/${crypto.randomUUID()}.${fileExt}`;

    // Upload the banner file to Supabase Storage
    const { error } = await supabase.storage
      .from("banners")
      .upload(filePath, banner.file, {
        upsert: true,
        contentType: banner.file.type,
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

    // If upload is successful, set the bannerValue to the file path in storage
    bannerValue = filePath;
  }

  // --- Insert squad ---
  const { data, error } = await supabase
    .from("squads")
    .insert({
      founder_account_id: founderAccountId,
      founder_profile_id: founderProfileId,
      squad_name: squadName,
      squad_name_normalized: normalizeName(squadName),
      banner_type: bannerType,
      banner_value: bannerValue,
    })
    .select()
    .single();

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code || "PROFILE_CREATION_FAILED",
        status: 500,
      },
    };
  }

  // Resolve the banner value to a public URL before returning the squad data
  const resolvedBanner = resolveBannerValue(
    bannerType,
    bannerValue,
  );

  // Return the created squad data with the resolved banner URL
  return {
    success: true,
    data: {
      ...data,
      banner_type: bannerType,
      banner_value: resolvedBanner,
    },
  };
};

// -- Get Squad By ID -- //
export const getSquadById = async (squadId: string): Promise<CreateSquadResult> => {
  const { data, error } = await supabase
    .from("squads")
    .select("*")
    .eq("id", squadId)
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
      banner_value: resolveBannerValue(data.banner_type, data.banner_value),
    },
  };
};

// -- Get All Squads (with optional search) -- //
export const getAllSquads = async (
  founderAcctId?: string,
  search?: string,
  signal?: AbortSignal,
): Promise<GetSquadsResult> => {
  let query = supabase
    .from("squads")
    .select("*");

  if (search) {
    const normalizedSearch = normalizeName(search);
    query = query.ilike("squad_name_normalized", `%${normalizedSearch}%`);
  }

  if (founderAcctId) {
    query = query.neq("founder_account_id", founderAcctId);
  }

  if (signal) {
    query = query.abortSignal(signal);
  }

  const { data, error } = await query;

  if (error) {
    // Standard Supabase abort error code is '20' or 'ABORT' depending on environment
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
    data: data.map((squad) => ({
      ...squad,
      banner_value: resolveBannerValue(squad.banner_type, squad.banner_value),
    })),
  };
};
