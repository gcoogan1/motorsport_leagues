import { supabase } from "@/lib/supabase";
import type { FollowProfileVariables, UnfollowProfileVariables, GetFollowersResult, ProfileTable, GetFollowingResult, RemoveFollowerVariables } from "@/types/profile.types";
import { resolveAvatarValue } from "./profile.service";

// --- Profile Follow Service --- //

// -- Follow a profile -- //
export const followProfileService = async (
  { userId, followerProfileId, followingProfileId }: FollowProfileVariables,
) => {
  if (!userId) throw new Error("Not authenticated");

  const { error } = await supabase.from("profile_follows").insert({
    follower_account_id: userId,
    follower_id: followerProfileId,
    following_id: followingProfileId,
  });

  if (error) throw error;

  return true;
};

// Unfollow a profile
export const unfollowProfileService = async (
  { userId, followingProfileId }: UnfollowProfileVariables,
) => {
  if (!userId) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("profile_follows")
    .delete()
    .eq("follower_account_id", userId)
    .eq("following_id", followingProfileId);

  if (error) throw error;

  return true;
};

// -- Check if following -- //
export const isFollowingService = async (userId: string, profileId: string) => {
  if (!userId) return false;

  const { data } = await supabase
    .from("profile_follows")
    .select("*")
    .eq("follower_account_id", userId)
    .eq("following_id", profileId)
    .maybeSingle();

  return !!data;
};

// -- Get followers of a profile -- //
export const getFollowersService = async (
  profileId: string,
): Promise<GetFollowersResult> => {
  const { data, error } = await supabase
    .from("profile_follows")
    .select(`
      profiles!profile_follows_follower_id_fkey (*)
    `)
    .eq("following_id", profileId);

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

  // The join returns the follower profile data nested under the "profiles" key. We need to extract it and resolve the avatar URL for each follower profile.
  const normalized = (data ?? [])
    .map((row) => row.profiles as unknown as ProfileTable | null)
    .filter((profile): profile is ProfileTable => !!profile)
    .map((profile) => ({
      ...profile,
      avatar_value: resolveAvatarValue(
        profile.avatar_type,
        profile.avatar_value,
      ),
    }));

  return {
    success: true,
    data: normalized,
  };
};

// -- Get all following for the current account -- //
export const getFollowingService = async (
  userId: string,
): Promise<GetFollowingResult> => {
  if (!userId) return { success: true, data: [] };

  // Get following by joining the profile_follows table with the profiles table to get the followed profile data, filtering by the follower_account_id (the current user's account ID)
  const { data, error } = await supabase
    .from("profile_follows")
    .select(`
      profiles!profile_follows_following_id_fkey (
        *
      )
    `)
    .eq("follower_account_id", userId);

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

   // The join returns the follower profile data nested under the "profiles" key. We need to extract it and resolve the avatar URL for each follower profile.
  const normalized = (data ?? [])
    .map((row) => row.profiles as unknown as ProfileTable | null)
    .filter((profile): profile is ProfileTable => !!profile)
    .map((profile) => ({
      ...profile,
      avatar_value: resolveAvatarValue(
        profile.avatar_type,
        profile.avatar_value,
      ),
    }));

  return {
    success: true,
    data: normalized,
  };
};

// -- Remove a follower (used when user removes someone from their followers list) -- //
export const removeFollowerService = async ({ currentProfileId, followerProfileId }: RemoveFollowerVariables) => {
  if (!followerProfileId) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("profile_follows")
    .delete()
    .eq("follower_id", followerProfileId)
    .eq("following_id", currentProfileId);

  if (error) throw error;

  return true;
}
