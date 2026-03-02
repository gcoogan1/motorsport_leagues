import { supabase } from "@/lib/supabase";
import type {
  AddSquadMemberPayload,
  AddSquadMemberResult,
  CreateSquadPayload,
  CreateSquadResult,
  GetSquadMembersResult,
  GetSquadsResult,
} from "@/types/squad.types";
import { resolveAvatarValue } from "@/services/profile.service";
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

  // --- Add founder as squad member ---
  const founderMemberResult = await addMemberToSquad({
    squadId: data.id,
    profileId: founderProfileId,
    role: "founder",
  });

  if (!founderMemberResult.success) {
    // If adding the founder as a member fails, attempt to clean up by deleting the created squad and uploaded banner (if applicable)
    await supabase.from("squads").delete().eq("id", data.id);

    // If the banner was an uploaded file, attempt to clean it up from storage since squad creation failed
    if (bannerType === "upload") {
      await supabase.storage.from("banners").remove([bannerValue]);
    }

    return {
      success: false,
      error: {
        message: founderMemberResult.error.message,
        code: "SERVER_ERROR",
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
export const getSquadById = async (
  squadId: string,
): Promise<CreateSquadResult> => {
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

// -- Add Member to Squad -- //
export const addMemberToSquad = async (
  { squadId, profileId, role }: AddSquadMemberPayload,
): Promise<AddSquadMemberResult> => {
  const { data, error } = await supabase
    .from("squad_members")
    .insert({
      squad_id: squadId,
      profile_id: profileId,
      role: role,
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

// -- Get Squad Members by Squad ID -- //
export const getSquadMembersBySquadId = async (
  squadId: string,
  signal?: AbortSignal,
): Promise<GetSquadMembersResult> => {
  let membersQuery = supabase
    .from("squad_members")
    .select("id, profile_id, role")
    .eq("squad_id", squadId);

  // Attach the abort signal to the query if provided, allowing the request to be cancelled if needed (e.g., when the component unmounts or the squadId changes)
  if (signal) {
    membersQuery = membersQuery.abortSignal(signal);
  }

  const { data: memberRows, error: membersError } = await membersQuery;

  if (membersError) {
    if (membersError.code === "ABORT" || membersError.message?.includes("abort")) {
      return { success: true, data: [] };
    }

    return {
      success: false,
      error: {
        message: membersError.message,
        code: membersError.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  if (!memberRows.length) {
    return {
      success: true,
      data: [],
    };
  }

  // Get profile IDs from the member rows to fetch their profile details in a single query
  const profileIds = [...new Set(memberRows.map((member) => member.profile_id))];

  let profilesQuery = supabase
    .from("profiles")
    .select("id, username, avatar_type, avatar_value")
    .in("id", profileIds);

  // Attach the abort signal to the profiles query as well, so that if the original request is cancelled, this one will be too
  if (signal) {
    profilesQuery = profilesQuery.abortSignal(signal);
  }

  // Get the profile details for all members in a single query to optimize performance and reduce latency, especially for squads with many members
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

  // Map the profile details to the corresponding squad members, resolving their avatar values to public URLs if needed
  const profilesMap = new Map(
    profiles.map((profile) => [
      profile.id,
      {
        ...profile,
        avatar_value: resolveAvatarValue(profile.avatar_type, profile.avatar_value),
      },
    ]),
  );

  // Return the squad members with their profile details
  return {
    success: true,
    data: memberRows
      .map((member) => {
        const profile = profilesMap.get(member.profile_id);

        if (!profile) return null;

        return {
          id: member.id,
          profile_id: member.profile_id,
          username: profile.username,
          avatar_type: profile.avatar_type,
          avatar_value: profile.avatar_value,
          role: member.role,
        };
      })
      .filter((member): member is NonNullable<typeof member> => member !== null), // Type guard to filter out any null members in case of missing profile data
  };
};
