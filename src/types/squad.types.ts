// -- Squad Types -- //

import type { ProfileTable } from "./profile.types";

// Constants //

export const SQUAD_MEMBER_ROLES = ["member", "founder"] as const;

export const SQUAD_BANNER_VARIANTS = ["badge1", "badge2", "badge3"] as const;
export type SquadBanner = typeof SQUAD_BANNER_VARIANTS[number];


// Banner Image Value --> discriminated union for draft/form stage
export type BannerImageValue =
  | { type: "preset"; variant: SquadBanner }
  | { type: "upload"; file: File; previewUrl?: string };


// Squad Draft --> used in Redux draft before squad is created/saved
export type SquadDraft = {
  founder_profile_id?: string;
  squad_name?: string;
  banner_image?: BannerImageValue;
};


// Supabase Service Types //

// Squad Table --> matches Supabase "squads" table but with camelCase keys
export type SquadTable = {
  id: string;
  created_at: string;
  founder_account_id: string;
  founder_profile_id: string;
  squad_name: string;
  squad_name_normalized: string;
  banner_type: "preset" | "upload";
  banner_value: string;
  member_count?: number;
};

export type SquadMemberTable = {
  id: string;
  created_at: string;
  squad_id: string;
  profile_id: string;
  role: typeof SQUAD_MEMBER_ROLES[number];
};

export type SquadMemberProfile = {
  id: string;
  profile_id: string;
  username: string;
  avatar_type: "preset" | "upload";
  avatar_value: string;
  role: typeof SQUAD_MEMBER_ROLES[number];
};

// Squad Follows Table --> represents the "squad_follows" table in Supabase, which tracks which profiles are following which squads
export type SquadFollowsTable = {
  follower_id: string;
  follower_account_id: string;
  squad_id: string;
};
export type SquadViewType = "owner" | "member" | "user" | "guest";

// Supabase Error Type --> used in squad service results
type SupabaseError = {
  success: false;
  error: {
    message: string;
    code: string;
    status: number;
  };
};

// Get Squads --> Success type
export type GetSquadsSuccess = {
  success: true;
  data: SquadTable[];
};

// Get Squads --> Result type
export type GetSquadsResult = GetSquadsSuccess | SupabaseError;

export type GetSquadMembersSuccess = {
  success: true;
  data: SquadMemberProfile[];
};

export type GetSquadMembersResult = GetSquadMembersSuccess | SupabaseError;

// Create Squad --> Payload type
export type CreateSquadPayload = {
  founderAccountId: string;
  founderProfileId: string;
  squadName: string;
  banner: BannerImageValue;
};;

// Create Squad --> Success type
export type CreateSquadSuccess = {
  success: true;
  data: SquadTable;
};

// Create Squad --> Result type
export type CreateSquadResult = CreateSquadSuccess | SupabaseError;

// Edit Banner --> Payload type
export type EditBannerPayload = {
  squadId: string;
  banner: BannerImageValue;
};

// Edit Banner --> Success type
export type EditBannerSuccess = {
  success: true;
  data: SquadTable;
};

// Edit Banner --> Result type
export type EditBannerResult = EditBannerSuccess | SupabaseError;

// Edit Squad Name --> Payload type
export type EditSquadNamePayload = {
  squadId: string;
  newSquadName: string;
};

// Edit Squad Name --> Success type
export type EditSquadNameSuccess = {
  success: true;
  data: SquadTable;
};

// Edit Squad Name --> Result type
export type EditSquadNameResult = EditSquadNameSuccess | SupabaseError;

// Add Squad Member --> Payload type
export type AddSquadMemberPayload = {
  squadId: string;
  profileId: string;
  role: typeof SQUAD_MEMBER_ROLES[number];
};

// Add Squad Member --> Result type
export type AddSquadMemberResult = 
  | { success: true; data: SquadMemberTable }
  | SupabaseError;

// Follow Squad --> Payload type
export type FollowSquadPayload = {
  squadId: string;
  profileId: string;
  accountId: string;
};

// Follow Squad --> Result type
export type FollowSquadResult = 
  | { success: true }
  | SupabaseError;

// Unfollow Squad --> Payload type
export type UnfollowSquadPayload = {
  squadId: string;
  accountId: string;
};

// Unfollow Squad --> Result type
export type UnfollowSquadResult = 
  | { success: true }
  | SupabaseError;

// Get Squad Followers --> Success type
export type GetSquadFollowersSuccess = {
  success: true;
  data: ProfileTable[];
};

// Get Squad Followers --> Result type
export type GetSquadFollowersResult = GetSquadFollowersSuccess | SupabaseError;

// Get Squad Following --> Success type
export type GetSquadFollowingSuccess = {
  success: true;
  data: SquadTable[];
};

// Get Squad Following --> Result type
export type GetSquadFollowingResult = GetSquadFollowingSuccess | SupabaseError;

// Redux Types //
// Squad State --> used in Redux slice for squads
export type SquadState = {
  data: SquadTable[] | null;
  currentSquad: SquadTable | null;
  status: "idle" | "loading" | "fulfilled" | "rejected";
  error?: string;
  draft: SquadDraft;
};