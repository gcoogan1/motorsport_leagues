// --- Squad Types -- //

import type { GameType, ProfileTable } from "./profile.types";

// -- CONSTANTS -- //

export const SQUAD_MEMBER_ROLES = ["member", "founder"] as const;

export const SQUAD_BANNER_VARIANTS = ["badge1", "badge2", "badge3"] as const;
export type SquadBanner = typeof SQUAD_BANNER_VARIANTS[number];

export type SquadViewType = "founder" | "member" | "user" | "guest";

// -- HELPER TYPES -- //

export type EmailInvite = {
  email: string;
  profileId?: string; // invitee's profile ID if they have an account, used to link the invite to a profile for notifications and tracking purposes
};

// -- SUPABASE TABLES -- //
export type SquadTable = {
  id: string;
  created_at: string;
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
  game_type: GameType;
  avatar_type: "preset" | "upload";
  avatar_value: string;
  role: typeof SQUAD_MEMBER_ROLES[number];
};

export type SquadFollowsTable = {
  follower_id: string;
  follower_account_id: string;
  squad_id: string;
};

export type SquadInviteTable = {
  id: string;
  created_at: string;
  clicked_at?: string;
  token?: string;
  squad_id: string;
  email: string;
  squad_name: string;
  sender_username: string;
  sender_account_id?: string;
  sender_profile_id?: string;
  status: "pending" | "accepted" | "clicked";
  profile_id?: string; // invitee's profile ID if they have an account, used to link the invite to a profile for notifications and tracking purposes
};

// -- DRAFT TYPES -- //
// (used in Redux state before saving to DB)

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


// -- SUPABASE SERVICE TYPES -- //

// Supabase Error Type --> used in squad service results
type SupabaseError = {
  success: false;
  error: {
    message: string;
    code: string;
    status: number;
  };
};


// -- GET -- //

// Get Squads --> Success type
export type GetSquadsSuccess = {
  success: true;
  data: SquadTable[];
};

// Get Squads --> Result type
export type GetSquadsResult = GetSquadsSuccess | SupabaseError;

// Get Squad Members --> Success type
export type GetSquadMembersSuccess = {
  success: true;
  data: SquadMemberProfile[];
};

// Get Squad Members --> Result type
export type GetSquadMembersResult = GetSquadMembersSuccess | SupabaseError;

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

// Get Squad Invites --> Success type
export type GetSquadInvitesSuccess = {
  success: true;
  data: SquadInviteTable[];
};

// Get Squad Invites --> Result type
export type GetSquadInvitesResult = GetSquadInvitesSuccess | SupabaseError;

// Get Invite Tables --> Result type
export type GetInviteTablesResult =
  | { success: true; data: SquadInviteTable }
  | SupabaseError;


// -- CREATE/ADD -- //

// Create Squad --> Payload type
export type CreateSquadPayload = {
  founderAccountId: string;
  founderProfileId: string;
  squadName: string;
  banner: BannerImageValue;
};

// Create Squad --> Success type
export type CreateSquadSuccess = {
  success: true;
  data: SquadTable;
};

// Create Squad --> Result type
export type CreateSquadResult = CreateSquadSuccess | SupabaseError;

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

// Invite Squad --> Payload type
export type InviteSquadPayload = {
  emails: EmailInvite[];
  squadId: string;
  squadName: string;
  senderUsername: string;
  senderAccountId: string;
  senderProfileId: string;
};

// Invite Squad --> Result type
export type InviteSquadResult = 
  | { success: true, data: SquadInviteTable[] }
  | SupabaseError;

// Mark Squad Invite as Clicked --> Payload type
export type MarkSquadInviteClickedPayload = {
  inviteId: string;
  profileId: string;
};

// Mark Squad Invite as Clicked --> Result type
export type MarkSquadInviteClickedResult =
  | { success: true }
  | SupabaseError;



// -- EDIT/UPDATE -- //

// Edit Banner --> Payload type
export type EditBannerPayload = {
  squadId: string;
  banner: BannerImageValue;
  // Required for upload storage path (scoped by account ID in storage RLS)
  accountId?: string;
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

// Update Squad Member Role --> Payload type
export type UpdateSquadMemberRolePayload = {
  squadId: string;
  profileId: string;
  newRole: typeof SQUAD_MEMBER_ROLES[number];
};

// Update Squad Member Role --> Result type
export type UpdateSquadMemberRoleResult = 
  | { success: true }
  | SupabaseError;


// -- DELETE/REMOVE -- //

// Delete Squad --> Success type
export type DeleteSquadSuccess = {
  success: true;
};

// Delete Squad --> Result type
export type DeleteSquadResult = DeleteSquadSuccess | SupabaseError;

// Remove Squad Member --> Payload type
export type RemoveSquadMemberPayload = {
  squadId: string;
  profileId: string;
};

// Remove Squad Member --> Result type
export type RemoveSquadMemberResult =
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

// Remove Squad Follower --> Payload type
export type RemoveSquadFollowerPayload = {
  squadId: string;
  followerProfileId: string;
};

// Remove Squad Follower --> Result type
export type RemoveSquadFollowerResult = 
  | { success: true }
  | SupabaseError;

// Remove Squad Invite by Token --> Payload type
export type RemoveSquadInviteByTokenResult =
  | { success: true }
  | SupabaseError;


// Redux Types //

// Squad State --> used in Redux slice for squads
export type SquadState = {
  data: SquadTable[] | null;
  currentSquad: SquadTable | null;
  status: "idle" | "loading" | "fulfilled" | "rejected";
  error?: string;
  draft: SquadDraft;
};