import { supabase } from "@/lib/supabase";
import type {
  AddSquadMemberPayload,
  AddSquadMemberResult,
  CreateSquadPayload,
  CreateSquadResult,
  DeleteSquadResult,
  EditBannerPayload,
  EditBannerResult,
  EditSquadNamePayload,
  EditSquadNameResult,
  FollowSquadPayload,
  FollowSquadResult,
  GetInviteTablesResult,
  GetSquadInvitesResult,
  GetSquadFollowingResult,
  GetSquadMembersResult,
  GetSquadsResult,
  InviteSquadPayload,
  InviteSquadResult,
  MarkSquadInviteClickedPayload,
  MarkSquadInviteClickedResult,
  RemoveSquadInviteByTokenResult,
  RemoveSquadFollowerPayload,
  RemoveSquadFollowerResult,
  RemoveSquadMemberPayload,
  RemoveSquadMemberResult,
  UnfollowSquadPayload,
  UnfollowSquadResult,
} from "@/types/squad.types";
import { resolveAvatarValue } from "@/services/profile.service";
import { normalizeName } from "@/utils/normalizeName";
import type { GetFollowersResult } from "@/types/profile.types";

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


// -- Get Squads by Account ID -- //
export const getSquadsByAccountId = async (
  accountId: string,
): Promise<GetSquadsResult> => {
  const { data, error } = await supabase
    .from("squads")
    .select("*, squad_members(count)")
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
  let query = supabase
    .from("squads")
    .select("*, squad_members(count)")
    .eq("founder_profile_id", founderProfileId);

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
  { squadId, banner }: EditBannerPayload,
): Promise<EditBannerResult> => {
  let bannerType: "preset" | "upload";
  let bannerValue: string;

  // --- Handle banner ---
  if (banner.type === "preset") {
    bannerType = "preset";
    bannerValue = banner.variant;
  } else {
    bannerType = "upload";

    // Load founder account id so uploads follow the same storage path convention as create
    // (required by storage RLS policies that scope uploads by account folder).
    const { data: squadData, error: squadFetchError } = await supabase
      .from("squads")
      .select("founder_account_id")
      .eq("id", squadId)
      .single();

    if (squadFetchError || !squadData?.founder_account_id) {
      return {
        success: false,
        error: {
          message: squadFetchError?.message || "Squad not found",
          code: squadFetchError?.code || "SQUAD_NOT_FOUND",
          status: 404,
        },
      };
    }

    // Generate a unique file path for the banner upload
    const fileExt = banner.file.name.split(".").pop();
    const filePath = `${squadData.founder_account_id}/${crypto.randomUUID()}.${fileExt}`;

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
  { squadId, newSquadName }: EditSquadNamePayload
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
): Promise<GetSquadsResult> => {
  let query = supabase
    .from("squads")
    .select("*, squad_members(count)");

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
      member_count: squad.squad_members?.[0]?.count ?? 0,
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
    .select("id, username, game_type, avatar_type, avatar_value")
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
          game_type: profile.game_type,
          avatar_type: profile.avatar_type,
          avatar_value: profile.avatar_value,
          role: member.role,
        };
      })
      .filter((member): member is NonNullable<typeof member> => member !== null), // Type guard to filter out any null members in case of missing profile data
  };
};

export const removeMemberFromSquad = async (
  { squadId, profileId }: RemoveSquadMemberPayload,
  signal?: AbortSignal,
): Promise<RemoveSquadMemberResult> => {
  let query = supabase
    .from("squad_members")
    .delete()
    .eq("squad_id", squadId)
    .eq("profile_id", profileId);

  if (signal) {
    query = query.abortSignal(signal);
  }

  const { error } = await query;

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

// Follow a Squad -- //
export const followSquadService = async (
  { squadId, profileId, accountId }: FollowSquadPayload,
): Promise<FollowSquadResult> => {
  const { error } = await supabase
    .from("squad_follows")
    .insert({
      follower_id: profileId,
      follower_account_id: accountId,
      squad_id: squadId,
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
}

// Unfollow a Squad -- //
export const unfollowSquadService = async (
  { squadId, accountId }: UnfollowSquadPayload,
): Promise<UnfollowSquadResult> => {
  const { error } = await supabase
    .from("squad_follows")
    .delete()
    .eq("follower_account_id", accountId)
    .eq("squad_id", squadId);

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
}

// -- Check if Profile is Following Squad -- //
export const isFollowingSquadService = async (
  squadId: string,
  accountId: string,
): Promise<boolean> => {
  const { data, error } = await supabase
    .from("squad_follows")
    .select("squad_id")
    .eq("follower_account_id", accountId)
    .eq("squad_id", squadId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No rows found means the profile is not following the squad
      return false;
    }

    // For any other error, log it and assume the profile is not following the squad to avoid blocking the user due to a transient error
    console.error("Error checking if profile is following squad:", error);
    return false;
  }

  return !!data; // If data is returned, the profile is following the squad; if no data, it's not
};

// Get Followers of a Squad -- //
export const getSquadFollowersService = async (
  squadId: string,
): Promise<GetFollowersResult> => {
  const { data: followRows, error: followsError } = await supabase
    .from("squad_follows")
    .select("follower_id")
    .eq("squad_id", squadId);

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
      avatar_value: resolveAvatarValue(profile.avatar_type, profile.avatar_value),
    })),
  };
};

// -- Remove Follower From Squad -- //
export const removeSquadFollowerService = async (
  { squadId, followerProfileId }: RemoveSquadFollowerPayload
): Promise<RemoveSquadFollowerResult> => {
  const { error } = await supabase
    .from("squad_follows")
    .delete()
    .eq("squad_id", squadId)
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
} 

// Check if following -- //
export const checkIfFollowingSquad = async (
  squadId: string,
  accountId: string,
): Promise<boolean> => {
  const { data, error } = await supabase
    .from("squad_follows")
    .select("squad_id")
    .eq("follower_account_id", accountId)
    .eq("squad_id", squadId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return false;
    }

    return false;
  }

  return !!data;
};

// -- Get Squads Followed by an Account -- //
export const getFollowingSquads = async (
  accountId: string,
): Promise<GetSquadFollowingResult> => { 
  const { data: followRows, error: followsError } = await supabase
    .from("squad_follows")
    .select("squad_id")
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

  const squadIds = followRows.map((row) => row.squad_id);

  const { data: squads, error: squadsError } = await supabase
    .from("squads")
    .select("*, squad_members(count)")
    .in("id", squadIds);

  if (squadsError)  {
    return {
      success: false,
      error: {
        message: squadsError.message,
        code: squadsError.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  return {
    success: true,
    data: squads.map((squad) => ({
      ...squad,
      member_count: squad.squad_members?.[0]?.count ?? 0,
      banner_value: resolveBannerValue(squad.banner_type, squad.banner_value),
    })),
  };
};

// -- Delete Squads By Founder -- //
// -> used when deleting a profile and the profile is a main founder of one or more squads
export const deleteSquadsByFounderService = async (
  founderAccountId: string,
  founderProfileId: string,
) => {
  // Fetch squads founded by this profile
  const { data: foundedSquads, error: foundedSquadsError } = await supabase
    .from("squads")
    .select("id, banner_type, banner_value")
    .eq("founder_account_id", founderAccountId)
    .eq("founder_profile_id", founderProfileId);

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

  if (!foundedSquads.length) {
    return {
      success: true,
    };
  }

  // Extract squad IDs and any uploaded banner paths for cleanup
  const squadIds = foundedSquads.map((squad) => squad.id);
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

// -- Invite To Squad -- //
export const inviteToSquad = async (
  {
    emails,
    squadId,
    squadName,
    senderUsername,
    senderAccountId,
    senderProfileId,
  }: InviteSquadPayload
): Promise<InviteSquadResult> => {  
    const { data, error } = await supabase.functions.invoke("invite_user", {
      body: {
        emails,
        squadId,
        squadName,
        senderUsername,
        senderAccountId,
        senderProfileId,
      },
    });

    if (error) {
      return {
        success: false,
        error: {
          message: error.message,
          code: error.code || "INVITE_FAILED",
          status: 500,
        },
      };
    }

    return { success: true, data: data.data }; 
}

// -- Get Invite Tables by Token -- //
export const getInviteTablesByToken = async (
  inviteToken: string,
): Promise<GetInviteTablesResult> => {
  const { data, error } = await supabase
    .from("squad_invites")
    .select("*")
    .eq("token", inviteToken)
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
}

// -- Remove Squad Invite by Token -- //
export const removeSquadInviteByToken = async (
  inviteToken: string,
): Promise<RemoveSquadInviteByTokenResult> => {
  const { error } = await supabase
    .from("squad_invites")
    .delete()
    .eq("token", inviteToken);

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
}

// -- Mark Squad Invite as Clicked -- //
export const markSquadInviteClicked = async (
  { inviteId, profileId }: MarkSquadInviteClickedPayload,
): Promise<MarkSquadInviteClickedResult> => {
  const { error } = await supabase
    .from("squad_invites")
    .update({
      profile_id: profileId,
      status: "clicked",
      clicked_at: new Date().toISOString(),
    })
    .eq("id", inviteId)
    .eq("status", "pending")
    .is("clicked_at", null);

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
}

// -- Get Pending Squad Invites by Squad ID -- //
export const getPendingSquadInvitesBySquadId = async (
  squadId: string,
  signal?: AbortSignal,
): Promise<GetSquadInvitesResult> => {
  let query = supabase
    .from("squad_invites")
    .select("*")
    .eq("squad_id", squadId)
    .eq("status", "pending");

  if (signal) {
    query = query.abortSignal(signal);
  }

  const { data, error } = await query;

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
}