import { supabase } from "@/lib/supabase";
import type {
  CreateSquadPayload,
  CreateSquadResult,
  DeleteSquadResult,
  EditBannerPayload,
  EditBannerResult,
  EditSquadNamePayload,
  EditSquadNameResult,
  GetSquadsResult,
} from "@/types/squad.types";
import { normalizeName } from "@/utils/normalizeName";
import { addMemberToSquad } from "./squadMember.service";

// -- Resolve Banner Value to Public URL -- //
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

// --- Squad Service --- //

// -- Get Squads by Account ID -- //
export const getSquadsByAccountId = async (
  accountId: string,
): Promise<GetSquadsResult> => {
  // Step 1: Get all profile IDs belonging to this account
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

  if (!profiles.length) return { success: true, data: [] };

  const profileIds = profiles.map((p) => p.id);

  // Step 2: Get squad IDs where any profile has a founder role
  const { data: founderMembers, error: membersError } = await supabase
    .from("squad_members")
    .select("squad_id")
    .in("profile_id", profileIds)
    .eq("role", "founder");

  if (membersError) {
    return {
      success: false,
      error: {
        message: membersError.message,
        code: membersError.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  if (!founderMembers.length) return { success: true, data: [] };

  const squadIds = [...new Set(founderMembers.map((m) => m.squad_id))];

  // Step 3: Fetch the squads
  const { data, error } = await supabase
    .from("squads")
    .select("*, squad_members(count)")
    .in("id", squadIds);

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
      member_count: squad.squad_members?.[0]?.count ?? 0,
      banner_value: resolveBannerValue(squad.banner_type, squad.banner_value),
    })),
  };
};

// -- Get Squads by Founder Profile ID -- //
export const getSquadsByFounderProfileId = async (
  founderProfileId: string,
  signal?: AbortSignal,
): Promise<GetSquadsResult> => {
  // Step 1: Get squad IDs where this profile has a founder role
  let membersQuery = supabase
    .from("squad_members")
    .select("squad_id")
    .eq("profile_id", founderProfileId)
    .eq("role", "founder");

  if (signal) membersQuery = membersQuery.abortSignal(signal);

  const { data: memberRows, error: membersError } = await membersQuery;

  if (membersError) {
    if (
      membersError.code === "ABORT" || membersError.message?.includes("abort")
    ) {
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

  if (!memberRows.length) return { success: true, data: [] };

  const squadIds = memberRows.map((m) => m.squad_id);

  // Step 2: Fetch the squads
  let squadsQuery = supabase
    .from("squads")
    .select("*, squad_members(count)")
    .in("id", squadIds);

  if (signal) squadsQuery = squadsQuery.abortSignal(signal);

  const { data, error } = await squadsQuery;

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
    data: data.map((squad) => ({
      ...squad,
      member_count: squad.squad_members?.[0]?.count ?? 0,
      banner_value: resolveBannerValue(squad.banner_type, squad.banner_value),
    })),
  };
};

// -- Get Squads by Profile ID (Member or Founder) -- //
export const getSquadsByProfileId = async (
  profileId: string,
  signal?: AbortSignal,
): Promise<GetSquadsResult> => {
  // Step 1: Get squad IDs where this profile has a founder role
  let membersQuery = supabase
    .from("squad_members")
    .select("squad_id")
    .eq("profile_id", profileId);

  if (signal) membersQuery = membersQuery.abortSignal(signal);

  const { data: memberRows, error: membersError } = await membersQuery;

  if (membersError) {
    if (
      membersError.code === "ABORT" || membersError.message?.includes("abort")
    ) {
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

  if (!memberRows.length) return { success: true, data: [] };

  const squadIds = memberRows.map((m) => m.squad_id);

  // Step 2: Fetch the squads
  let squadsQuery = supabase
    .from("squads")
    .select("*, squad_members(count)")
    .in("id", squadIds);

  if (signal) squadsQuery = squadsQuery.abortSignal(signal);

  const { data, error } = await squadsQuery;

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
    data: data.map((squad) => ({
      ...squad,
      member_count: squad.squad_members?.[0]?.count ?? 0,
      banner_value: resolveBannerValue(squad.banner_type, squad.banner_value),
    })),
  };
};

// -- Check Squad Name Availability -- //
export const isSquadNameAvailable = async (
  name: string,
  squadId?: string,
): Promise<boolean> => {
  const normalizedSquadName = normalizeName(name);

  let query = supabase
    .from("squads")
    .select("id")
    .eq("squad_name_normalized", normalizedSquadName);

  // If squadId is provided, exclude it from the check (allows owner to keep same name / capitalization changes)
  if (squadId) {
    query = query.neq("id", squadId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error checking squad name availability:", error);
    return false;
  }

  // If rows exist, the name is taken; if none, it's available
  return !data?.length;
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
        code: error.code || "SQUAD_CREATION_FAILED",
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
      member_count: 1,
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

// -- Edit Banner -- //
export const editSquadBanner = async (
  { squadId, banner, accountId }: EditBannerPayload,
): Promise<EditBannerResult> => {
  let bannerType: "preset" | "upload";
  let bannerValue: string;

  // --- Handle banner ---
  if (banner.type === "preset") {
    bannerType = "preset";
    bannerValue = banner.variant;
  } else {
    bannerType = "upload";

    if (!accountId) {
      return {
        success: false,
        error: {
          message: "Account ID is required for banner uploads",
          code: "MISSING_ACCOUNT_ID",
          status: 400,
        },
      };
    }

    // Generate a unique file path for the banner upload, scoped by account ID
    const fileExt = banner.file.name.split(".").pop();
    const filePath = `${accountId}/${crypto.randomUUID()}.${fileExt}`;

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

  // --- Update squad with new banner ---
  const { data, error } = await supabase
    .from("squads")
    .update({
      banner_type: bannerType,
      banner_value: bannerValue,
    })
    .eq("id", squadId)
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
      banner_type: bannerType,
      banner_value: resolveBannerValue(bannerType, bannerValue),
    },
  };
};

// -- Edit Squad Name -- //
export const editSquadName = async (
  { squadId, newSquadName }: EditSquadNamePayload,
): Promise<EditSquadNameResult> => {
  const { data, error } = await supabase
    .from("squads")
    .update({ squad_name: newSquadName })
    .eq("id", squadId)
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

// -- Get All Squads (with optional search) -- //
export const getAllSquads = async (
  founderAcctId?: string,
  search?: string,
  signal?: AbortSignal,
  includeOwnSquads: boolean = false,
): Promise<GetSquadsResult> => {
  // If an account ID is provided, find squads where that account is a founder
  // so we can exclude them from search results (user shouldn't see their own squads).
  let excludeSquadIds: string[] = [];
  if (founderAcctId && !includeOwnSquads) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id")
      .eq("account_id", founderAcctId);

    if (profiles?.length) {
      const profileIds = profiles.map((p) => p.id);
      const { data: founderMembers } = await supabase
        .from("squad_members")
        .select("squad_id")
        .in("profile_id", profileIds)
        .eq("role", "founder");

      if (founderMembers?.length) {
        excludeSquadIds = [...new Set(founderMembers.map((m) => m.squad_id))];
      }
    }
  }

  let query = supabase
    .from("squads")
    .select("*, squad_members(count)");

  if (search) {
    const normalizedSearch = normalizeName(search);
    query = query.ilike("squad_name_normalized", `%${normalizedSearch}%`);
  }

  if (excludeSquadIds.length) {
    query = query.not("id", "in", `(${excludeSquadIds.join(",")})`);
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
      member_count: squad.squad_members?.[0]?.count ?? 0,
      banner_value: resolveBannerValue(squad.banner_type, squad.banner_value),
    })),
  };
};

// -- Delete Squads By Founder -- //
// -> used when deleting a profile and the profile is the sole founder of one or more squads
export const deleteSquadsByFounderService = async (
  founderProfileId: string,
) => {
  // Find all squads where this profile has a founder role
  const { data: founderMemberships, error: membershipsError } = await supabase
    .from("squad_members")
    .select("squad_id")
    .eq("profile_id", founderProfileId)
    .eq("role", "founder");

  if (membershipsError) {
    return {
      success: false,
      error: {
        message: membershipsError.message,
        code: membershipsError.code || "FOUNDED_SQUADS_FETCH_FAILED",
        status: 500,
      },
    };
  }

  if (!founderMemberships.length) return { success: true };

  const candidateSquadIds = founderMemberships.map((m) => m.squad_id);

  // For each candidate squad, count how many founders it has.
  // Only delete squads where this profile is the sole founder (co-founded squads continue).
  const { data: allFounderMembers, error: foundersError } = await supabase
    .from("squad_members")
    .select("squad_id")
    .in("squad_id", candidateSquadIds)
    .eq("role", "founder");

  if (foundersError) {
    return {
      success: false,
      error: {
        message: foundersError.message,
        code: foundersError.code || "FOUNDED_SQUADS_FETCH_FAILED",
        status: 500,
      },
    };
  }

  const founderCountPerSquad = new Map<string, number>();
  for (const m of allFounderMembers) {
    founderCountPerSquad.set(
      m.squad_id,
      (founderCountPerSquad.get(m.squad_id) ?? 0) + 1,
    );
  }

  // Only delete squads where this profile is the only founder
  const squadIds = candidateSquadIds.filter(
    (id) => (founderCountPerSquad.get(id) ?? 0) <= 1,
  );

  if (!squadIds.length) return { success: true };

  // Fetch squad banner info for storage cleanup
  const { data: foundedSquads, error: foundedSquadsError } = await supabase
    .from("squads")
    .select("id, banner_type, banner_value")
    .in("id", squadIds);

  if (foundedSquadsError) {
    return {
      success: false,
      error: {
        message: foundedSquadsError.message,
        code: foundedSquadsError.code || "FOUNDED_SQUADS_FETCH_FAILED",
        status: 500,
      },
    };
  }

  // Extract squad IDs and any uploaded banner paths for cleanup
  const uploadedBannerPaths = foundedSquads
    .filter((squad) => squad.banner_type === "upload")
    .map((squad) => squad.banner_value);

  if (uploadedBannerPaths.length) {
    // Delete uploaded banners from Supabase Storage to clean up resources and avoid orphaned files
    const { error: bannerDeleteError } = await supabase.storage
      .from("banners")
      .remove(uploadedBannerPaths);

    if (bannerDeleteError) {
      return {
        success: false,
        error: {
          message: bannerDeleteError.message,
          code: "SQUAD_BANNER_DELETION_FAILED",
          status: 500,
        },
      };
    }
  }

  // Delete squad follows and members associated with these squads before deleting the squads themselves
  const { error: squadFollowsDeleteError } = await supabase
    .from("squad_follows")
    .delete()
    .in("squad_id", squadIds);

  if (squadFollowsDeleteError) {
    return {
      success: false,
      error: {
        message: squadFollowsDeleteError.message,
        code: squadFollowsDeleteError.code || "SQUAD_FOLLOWS_DELETION_FAILED",
        status: 500,
      },
    };
  }

  const { error: squadMembersDeleteError } = await supabase
    .from("squad_members")
    .delete()
    .in("squad_id", squadIds);

  if (squadMembersDeleteError) {
    return {
      success: false,
      error: {
        message: squadMembersDeleteError.message,
        code: squadMembersDeleteError.code || "SQUAD_MEMBERS_DELETION_FAILED",
        status: 500,
      },
    };
  }

  // Delete the squads
  const { error: squadsDeleteError } = await supabase
    .from("squads")
    .delete()
    .in("id", squadIds);

  if (squadsDeleteError) {
    return {
      success: false,
      error: {
        message: squadsDeleteError.message,
        code: squadsDeleteError.code || "FOUNDED_SQUADS_DELETION_FAILED",
        status: 500,
      },
    };
  }

  return {
    success: true,
  };
};

// -- Delete Squad By ID -- //
export const deleteSquadById = async (
  squadId: string,
): Promise<DeleteSquadResult> => {
  // Fetch the squad to get banner info for cleanup
  const { data: squadData, error: squadFetchError } = await supabase
    .from("squads")
    .select("banner_type, banner_value")
    .eq("id", squadId)
    .single();

  if (squadFetchError) {
    return {
      success: false,
      error: {
        message: squadFetchError.message,
        code: squadFetchError.code || "SQUAD_FETCH_FAILED",
        status: 500,
      },
    };
  }

  // If the squad has an uploaded banner, delete it from storage
  if (squadData.banner_type === "upload") {
    const { error: bannerDeleteError } = await supabase.storage
      .from("banners")
      .remove([squadData.banner_value]);

    if (bannerDeleteError) {
      return {
        success: false,
        error: {
          message: bannerDeleteError.message,
          code: "SQUAD_BANNER_DELETION_FAILED",
          status: 500,
        },
      };
    }
  }

  // Delete squad follows and members associated with this squad before deleting the squad itself
  const { error: squadFollowsDeleteError } = await supabase
    .from("squad_follows")
    .delete()
    .eq("squad_id", squadId);

  if (squadFollowsDeleteError) {
    return {
      success: false,
      error: {
        message: squadFollowsDeleteError.message,
        code: squadFollowsDeleteError.code || "SQUAD_FOLLOWS_DELETION_FAILED",
        status: 500,
      },
    };
  }

  const { error: squadMembersDeleteError } = await supabase
    .from("squad_members")
    .delete()
    .eq("squad_id", squadId);

  if (squadMembersDeleteError) {
    return {
      success: false,
      error: {
        message: squadMembersDeleteError.message,
        code: squadMembersDeleteError.code || "SQUAD_MEMBERS_DELETION_FAILED",
        status: 500,
      },
    };
  }

  // Delete the squad
  const { error: squadDeleteError } = await supabase
    .from("squads")
    .delete()
    .eq("id", squadId);

  if (squadDeleteError) {
    return {
      success: false,
      error: {
        message: squadDeleteError.message,
        code: squadDeleteError.code || "SQUAD_DELETION_FAILED",
        status: 500,
      },
    };
  }

  return {
    success: true,
  };
};
