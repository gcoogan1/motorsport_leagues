import type { Theme } from "@/app/design/tokens/theme";
import type { GameType, ProfileTable } from "./profile.types";

// -- League Types -- //

// -- CONSTANTS -- //

export type LeagueStatus = "setup" | "active" | "complete";

export const LEAGUE_PARTICIPANT_ROLES = [
  "director",
  "driver",
  "steward",
  "broadcaster",
  "staff",
] as const;

export const LEAGUE_COVER_VARIANTS = [
  "cover1",
  "cover2",
  "cover3",
  "cover4",
  "cover5",
] as const;
export type LeagueCover = typeof LEAGUE_COVER_VARIANTS[number];

export type LeagueViewType =
  | "participant"
  | "user"
  | "guest"
  | "director"
  | "loading";

// -- SUPABASE TABLES -- //

export type LeagueTable = {
  id: string;
  created_at: string;
  game_type: GameType;
  league_name: string;
  league_name_normalized: string;
  hosting_squad_id: string;
  hosting_squad_name: string;
  cover_type: "preset" | "upload";
  cover_value: string;
  theme_color: Theme;
  description?: string;
  timezone?: string;
  league_status: LeagueStatus;
};

export type LeagueFollowsTable = {
  follower_id: string;
  follower_account_id: string;
  league_id: string;
};

export type LeagueParticipantTable = {
  id: string;
  created_at: string;
  league_id: string;
  profile_id: string;
  contact_info?: string;
};

export type LeagueParticipantRolesTable = {
  id: string;
  participant_id: string;
  role: typeof LEAGUE_PARTICIPANT_ROLES[number];
};

export type LeagueInviteTable = {
  id: string;
  created_at: string;
  clicked_at?: string;
  token?: string;
  league_id: string;
  email: string;
  league_name: string;
  role: typeof LEAGUE_PARTICIPANT_ROLES[number];
  sender_username: string;
  sender_account_id?: string;
  sender_profile_id?: string;
  status: "pending" | "accepted" | "clicked";
  profile_id?: string; // invitee's profile ID if they have an account, used to link the invite to a profile for notifications and tracking purposes
};

export type LeagueJoinRequestTable = {
  id: string;
  created_at: string;
  league_id: string;
  profile_id: string;
  account_id: string;
  contact_info: string;
  requested_role: typeof LEAGUE_PARTICIPANT_ROLES[number];
};

export type LeagueApplicationOptionsTable = {
  id: string;
  league_id: string;
  open_roles: typeof LEAGUE_PARTICIPANT_ROLES[number][];
  contact_info?: boolean;
  is_closed?: boolean;
};

export type LeagueSeasonTable = {
  id: string;
  created_at: string;
  league_id: string;
  season_name: string;
  num_of_divisions: number;
  is_team_championship: boolean;
};

// -- HELPER TYPES -- //

// League with Info --> combines league table with related info like seasons and participants for display purposes (not in Supabase, but used in service results)
export type LeagueWithInfo = LeagueTable & {
  seasons: LeagueSeasonTable[];
  participants: LeagueParticipantProfile[];
  current_season_name?: string;
};

// League Participant Profile --> combines participant table with profile info for display purposes (not in Supabase, but used in service results)
export type LeagueParticipantProfile = {
  id: string;
  profile_id: string;
  account_id: string;
  contact_info?: string;
  username: string;
  game_type: GameType;
  avatar_type: "preset" | "upload";
  avatar_value: string;
  roles: typeof LEAGUE_PARTICIPANT_ROLES[number][];
};

// League Join Request with Profile --> combines join request table with profile info for display purposes (not in Supabase, but used in service results)
export type LeagueJoinRequestWithProfile = LeagueJoinRequestTable & {
  username: string;
  avatar_type: "preset" | "upload";
  avatar_value: string;
};

export type EmailInvite = {
  email: string;
  profileId?: string; // invitee's profile ID if they have an account, used to link the invite to a profile for notifications and tracking purposes
};


// -- DRAFT TYPES -- //


// Cover Image Value --> discriminated union for draft/form stage
export type CoverImageValue =
  | { type: "preset"; variant: LeagueCover }
  | { type: "upload"; file: File; previewUrl?: string };

// League Draft --> used in Redux draft before league is created/saved
export type LeagueDraft = {
  director_profile_id?: string;
  league_name?: string;
  game_type?: GameType;
  hosting_squad_id?: string;
  hosting_squad_name?: string;
  cover_image?: CoverImageValue;
  theme_color?: Theme;
  season_name?: string;
  num_of_divisions?: number;
  is_team_championship?: boolean;
};




// -- SUPABASE SERVICE TYPES -- //

type SupabaseError = {
  success: false;
  error: {
    message: string;
    code: string;
    status: number;
  };
};


// -- GET -- //

// Get Leagues --> Success type
export type GetLeaguesSuccess = {
  success: true;
  data: LeagueTable[];
};

// Get Leagues --> Result type
export type GetLeaguesResult = GetLeaguesSuccess | SupabaseError;

// Get League By Id --> Success type
export type GetLeaguesWithInfoSuccess = {
  success: true;
  data: LeagueWithInfo[];
};

// Get League By Id --> Result type
export type GetLeaguesWithInfoResult =
  | GetLeaguesWithInfoSuccess
  | SupabaseError;

// Get League Participants --> Result type
export type GetLeagueParticipantsSuccess = {
  success: true;
  data: LeagueParticipantProfile[];
};

// Get League Participants --> Result type
export type GetLeagueParticipantsResult =
  | GetLeagueParticipantsSuccess
  | SupabaseError;

// Get League Application Options --> Result type
export type GetLeagueApplicationOptionsResult =
  | { success: true; data: LeagueApplicationOptionsTable }
  | SupabaseError;


// Get League Join Requests --> Success type (includes profile info for display purposes)
export type GetLeagueJoinRequestsSuccess = {
  success: true;
  data: LeagueJoinRequestWithProfile[];
};

// Get League Join Requests --> Result type
export type GetLeagueJoinRequestsResult =
  | GetLeagueJoinRequestsSuccess
  | SupabaseError;

// Get League Invites --> Result type
export type GetLeagueInviteTablesResult =
  | { success: true; data: LeagueInviteTable[] }
  | SupabaseError;

// Get League Invites --> Success type
export type GetLeagueInvitesSuccess = {
  success: true;
  data: LeagueInviteTable[];
};

// Get League Invites --> Result type
export type GetLeagueInvitesResult = GetLeagueInvitesSuccess | SupabaseError;

// Get League Followers --> Success type
export type GetLeagueFollowersSuccess = {
  success: true;
  data: ProfileTable[];
};

// Get League Followers --> Result type
export type GetLeagueFollowersResult =
  | GetLeagueFollowersSuccess
  | SupabaseError;

// Get League Following --> Success type
export type GetLeagueFollowingSuccess = {
  success: true;
  data: LeagueTable[];
};

// Get League Following --> Result type
export type GetLeagueFollowingResult =
  | GetLeagueFollowingSuccess
  | SupabaseError;

// Get League Seasons --> Result type
export type GetLeagueSeasonsSuccess = {
  success: true;
  data: LeagueSeasonTable[];
};

// Get League Seasons --> Result type
export type GetLeagueSeasonsResult = GetLeagueSeasonsSuccess | SupabaseError;


// -- CREATE/ADD -- //

// Create League --> Payload Type
export type CreateLeaguePayload = {
  accountId: string;
  leagueName: string;
  directorProfileId: string;
  gameType: GameType;
  hostingSquadId: string;
  hostingSquadName: string;
  coverImage: CoverImageValue;
  themeColor: Theme;
  seasonName: string;
  numOfDivisions: number;
  isTeamChampionship: boolean;
};

// Create League --> Success type
export type CreateLeagueSuccess = {
  success: true;
  data: LeagueTable;
};

// Create League --> Result type
export type CreateLeagueResult = CreateLeagueSuccess | SupabaseError;

// Add League Participant --> Payload type
export type AddLeagueParticipantPayload = {
  leagueId: string;
  profileId: string;
  contactInfo?: string;
};

// Add League Participant --> Success type
export type AddLeagueParticipantSuccess = {
  success: true;
  data: LeagueParticipantTable;
};

// Add League Participant --> Result type
export type AddLeagueParticipantResult =
  | AddLeagueParticipantSuccess
  | SupabaseError;

// Add League Participant Role --> Payload type
export type AddLeagueParticipantRolePayload = {
  participantId: string;
  role: typeof LEAGUE_PARTICIPANT_ROLES[number];
};

// Add League Participant Role --> Success type
export type AddLeagueParticipantRoleSuccess = {
  success: true;
  data: LeagueParticipantRolesTable;
};

// Add League Participant Role --> Result type
export type AddLeagueParticipantRoleResult =
  | AddLeagueParticipantRoleSuccess
  | SupabaseError;

// Create League Join Request --> Payload type
export type CreateLeagueJoinRequestPayload = {
  leagueId: string;
  profileId: string;
  accountId: string;
  contactInfo: string;
  roles: typeof LEAGUE_PARTICIPANT_ROLES[number][];
};

// Create League Join Request --> Result type
export type CreateLeagueJoinRequestResult =
  | { success: true; data: LeagueJoinRequestTable[] }
  | SupabaseError;

// Join League with Roles --> Payload type
export type JoinLeagueWithRolesPayload = {
  leagueId: string;
  profileId: string;
  accountId: string;
  contactInfo?: string;
  roles: typeof LEAGUE_PARTICIPANT_ROLES[number][];
};

// Join League with Roles --> Result type
export type JoinLeagueWithRolesResult =
  | { success: true; data: LeagueParticipantTable }
  | SupabaseError;

// Add League Application Options --> Payload type
export type AddLeagueApplicationOptionsPayload = {
  leagueId: string;
  openRoles: typeof LEAGUE_PARTICIPANT_ROLES[number][];
  contactInfo: boolean;
  isClosed?: boolean;
};

// Add League Application Options --> Result type
export type AddLeagueApplicationOptionsResult =
  | { success: true; data: LeagueApplicationOptionsTable }
  | SupabaseError;

// Invite League --> Payload type
export type InviteLeaguePayload = {
  emails: EmailInvite[];
  leagueId: string;
  leagueName: string;
  role: typeof LEAGUE_PARTICIPANT_ROLES[number];
  senderUsername: string;
  senderAccountId: string;
  senderProfileId: string;
};

// Invite League --> Result type
export type InviteLeagueResult =
  | { success: true; data: LeagueInviteTable[] }
  | SupabaseError;

// Mark League Invite as Clicked --> Payload type
export type MarkLeagueInviteClickedPayload = {
  inviteId: string;
  profileId: string;
};

// Mark League Invite as Clicked --> Result type
export type MarkLeagueInviteClickedResult =
  | { success: true }
  | SupabaseError;

// Follow League --> Payload type
export type FollowLeaguePayload = {
  leagueId: string;
  profileId: string;
  accountId: string;
};

// Follow League --> Result type
export type FollowLeagueResult =
  | { success: true }
  | SupabaseError;

// Create League Season --> Payload type
export type CreateLeagueSeasonPayload = {
  leagueId: string;
  seasonName: string;
  numOfDivisions: number;
  isTeamChampionship: boolean;
};

// Create League Season --> Success type
export type CreateLeagueSeasonSuccess = {
  success: true;
  data: LeagueSeasonTable;
};

// Create League Season --> Result type
export type CreateLeagueSeasonResult =
  | CreateLeagueSeasonSuccess
  | SupabaseError;
  

// -- EDIT/UPDATE -- //

// Update League --> Payload Type
export type UpdateLeaguePayload = {
  accountId: string;
  leagueId: string;
  leagueName?: string;
  description?: string;
  timezone?: string;
  coverImage?: CoverImageValue;
  themeColor?: Theme;
};

// Update League --> Success type
export type UpdateLeagueSuccess = {
  success: true;
  data: LeagueTable;
};

// Update League --> Result type
export type UpdateLeagueResult = UpdateLeagueSuccess | SupabaseError;

// Update League Participant Role --> Payload type
export type UpdateLeagueParticipantRolePayload = {
  leagueId: string;
  profileId: string;
  newLeagueRole: typeof LEAGUE_PARTICIPANT_ROLES[number];
};

// Update League Participant Role --> Result type
export type UpdateLeagueParticipantRoleResult =
  | { success: true }
  | SupabaseError;

// Update League Application Options --> Payload type
export type UpdateLeagueApplicationOptionsPayload = {
  leagueId: string;
  openRoles?: typeof LEAGUE_PARTICIPANT_ROLES[number][];
  contactInfo?: boolean;
  isClosed?: boolean;
};

// Update League Application Options --> Result type
export type UpdateLeagueApplicationOptionsResult =
  | { success: true; data: LeagueApplicationOptionsTable }
  | SupabaseError;

// Update League Season --> Payload type
export type UpdateLeagueSeasonPayload = {
  seasonId: string;
  seasonName: string;
  numOfDivisions: number;
  isTeamChampionship: boolean;
};

// Update League Season --> Success type
export type UpdateLeagueSeasonSuccess = {
  success: true;
  data: LeagueSeasonTable;
};

// Update League Season --> Result type
export type UpdateLeagueSeasonResult =
  | UpdateLeagueSeasonSuccess
  | SupabaseError;


// -- REMOVE/DELETE -- //

// Delete League --> Result type
export type DeleteLeagueResult =
  | { success: true }
  | SupabaseError;

// Remove League Participant --> Payload type
export type RemoveLeagueParticipantPayload = {
  leagueId: string;
  profileId: string;
};

// Remove League Participant --> Result type
export type RemoveLeagueParticipantResult =
  | { success: true }
  | SupabaseError;

// Remove League Participant Role --> Payload type
export type RemoveLeagueParticipantRolePayload = {
  participantId: string;
  role: typeof LEAGUE_PARTICIPANT_ROLES[number];
};

// Remove League Participant Role --> Result type
export type RemoveLeagueParticipantRoleResult =
  | { success: true }
  | SupabaseError;

// Remove League Application Options --> Payload type
export type RemoveLeagueApplicationOptionsPayload = {
  leagueId: string;
};

// Remove League Application Options --> Result type
export type RemoveLeagueApplicationOptionsResult =
  | { success: true }
  | SupabaseError;

// Remove League Join Request --> Payload type
export type RemoveLeagueJoinRequestPayload = {
  requestId: string;
};

// Remove League Join Request --> Result type
export type RemoveLeagueJoinRequestResult =
  | { success: true }
  | SupabaseError;

// Remove League Invite by Token --> Payload type
export type RemoveLeagueInviteByTokenResult =
  | { success: true }
  | SupabaseError;

// Unfollow League --> Payload type
export type UnfollowLeaguePayload = {
  leagueId: string;
  accountId: string;
};

// Unfollow League --> Result type
export type UnfollowLeagueResult =
  | { success: true }
  | SupabaseError;

// Remove League Follower --> Payload type
export type RemoveLeagueFollowerPayload = {
  leagueId: string;
  followerProfileId: string;
};

// Remove League Follower --> Result type
export type RemoveLeagueFollowerResult =
  | { success: true }
  | SupabaseError;

// Remove League Season --> Payload type
export type RemoveLeagueSeasonPayload = {
  seasonId: string;
};

// Remove League Season --> Result type
export type RemoveLeagueSeasonResult =
  | { success: true }
  | SupabaseError;

  
// Redux Types //
// League State --> used in Redux slice for leagues
export type LeagueState = {
  data: (LeagueWithInfo | LeagueTable)[] | null;
  currentLeague: (LeagueWithInfo | LeagueTable) | null;
  status: "idle" | "loading" | "fulfilled" | "rejected";
  error?: string;
  draft: LeagueDraft;
};
