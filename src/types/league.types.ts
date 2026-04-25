import type { Theme } from "@/app/design/tokens/theme";
import type { GameType, ProfileTable } from "./profile.types";

// -- League Types -- //

// Constants //

export type LeagueStatus = "setup" | "active" | "complete";

export const LEAGUE_PARTICIPANT_ROLES = ["director", "driver", "steward", "broadcaster", "staff"] as const;

export const LEAGUE_COVER_VARIANTS = ["cover1", "cover2", "cover3", "cover4", "cover5"] as const;
export type LeagueCover = typeof LEAGUE_COVER_VARIANTS[number];

export type LeagueViewType = "participant" | "user" | "guest";

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

// Supabase Service Types //

// League Table --> matches Supabase "leagues" table but with camelCase keys
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

// League Follows Table --> represents the "league_follows" table in Supabase, which tracks which profiles are following which leagues
export type LeagueFollowsTable = {
  follower_id: string;
  follower_account_id: string;
  league_id: string;
};

// League Participant Table --> represents the "league_participants" table in Supabase, which tracks which profiles are participating in which leagues and their roles
export type LeagueParticipantTable = {
  id: string;
  created_at: string;
  league_id: string;
  profile_id: string;
  contact_info?: string;
  // league_role: typeof LEAGUE_PARTICIPANT_ROLES[number];
};

// League Participant Roles Table --> represents the "league_participant_roles" table in Supabase, which tracks the specific roles of participants within a league (director, driver, steward, etc.)
export type LeagueParticipantRolesTable = {
  id: string;
  participant_id: string;
  role: typeof LEAGUE_PARTICIPANT_ROLES[number];
}

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

export type LeagueApplicationOptionsTable = {
  id: string;
  league_id: string;
  open_roles: typeof LEAGUE_PARTICIPANT_ROLES[number][];
  contact_info?: boolean;
  is_closed?: boolean;
}

export type AddLeagueApplicationOptionsPayload = {
  leagueId: string;
  openRoles: typeof LEAGUE_PARTICIPANT_ROLES[number][];
  contactInfo: boolean;
  isClosed?: boolean;
};

export type AddLeagueApplicationOptionsResult =
  | { success: true; data: LeagueApplicationOptionsTable }
  | SupabaseError;

export type GetLeagueApplicationOptionsResult =
  | { success: true; data: LeagueApplicationOptionsTable }
  | SupabaseError;

export type UpdateLeagueApplicationOptionsPayload = {
  leagueId: string;
  openRoles?: typeof LEAGUE_PARTICIPANT_ROLES[number][];
  contactInfo?: boolean;
  isClosed?: boolean;
};

export type UpdateLeagueApplicationOptionsResult =
  | { success: true; data: LeagueApplicationOptionsTable }
  | SupabaseError;

export type RemoveLeagueApplicationOptionsPayload = {
  leagueId: string;
};

export type RemoveLeagueApplicationOptionsResult =
  | { success: true }
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

  // League with Info --> combines league table with related info like seasons and participants for display purposes (not in Supabase, but used in service results)
export type LeagueWithInfo = LeagueTable & {
  seasons: LeagueSeasonTable[];
  participants: LeagueParticipantProfile[];
  current_season_name?: string;
};

// League Seasons Table --> represents the "league_seasons" table in Supabase, which tracks the different seasons within a league
export type LeagueSeasonTable = {
  id: string;
  created_at: string;
  league_id: string;
  season_name: string;
  num_of_divisions: number;
  is_team_championship: boolean;
};

export type GetLeagueSeasonsSuccess = {
  success: true;
  data: LeagueSeasonTable[];
};

export type GetLeagueSeasonsResult = GetLeagueSeasonsSuccess | SupabaseError;


// Supabase Error Type --> used in squad service results
type SupabaseError = {
  success: false;
  error: {
    message: string;
    code: string;
    status: number;
  };
};


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

// Get League By Id --> Result type
export type DeleteLeagueResult =
  | { success: true }
  | SupabaseError;

// Get Leagues --> Success type
export type GetLeaguesSuccess = {
  success: true;
  data: LeagueTable[];
};

// Get Leagues --> Result type
export type GetLeaguesResult = GetLeaguesSuccess | SupabaseError;

export type GetLeaguesWithInfoSuccess = {
  success: true;
  data: LeagueWithInfo[];
};

export type GetLeaguesWithInfoResult = GetLeaguesWithInfoSuccess | SupabaseError;

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
export type AddLeagueParticipantResult = AddLeagueParticipantSuccess | SupabaseError;

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
export type AddLeagueParticipantRoleResult = AddLeagueParticipantRoleSuccess | SupabaseError;

export type UpdateLeagueParticipantRolePayload = {
  leagueId: string;
  profileId: string;
  newLeagueRole: typeof LEAGUE_PARTICIPANT_ROLES[number];
};

export type UpdateLeagueParticipantRoleResult =
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

export type RemoveLeagueParticipantPayload = {
  leagueId: string;
  profileId: string;
};

export type RemoveLeagueParticipantResult =
  | { success: true }
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

// League Join Request Table --> represents the "league_join_requests" table in Supabase, which tracks requests to join a league with specific roles and contact info
export type LeagueJoinRequestTable = {
  id: string;
  created_at: string;
  league_id: string;
  profile_id: string;
  account_id: string;
  contact_info: string;
  requested_role: typeof LEAGUE_PARTICIPANT_ROLES[number];
};

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

// Remove League Join Request --> Payload type
export type RemoveLeagueJoinRequestPayload = {
  requestId: string;
};

// Remove League Join Request --> Result type
export type RemoveLeagueJoinRequestResult =
  | { success: true }
  | SupabaseError;

// Get League Join Requests --> Result type
export type LeagueJoinRequestWithProfile = LeagueJoinRequestTable & {
  username: string;
  avatar_type: "preset" | "upload";
  avatar_value: string;
};

// Get League Join Requests --> Result type
export type GetLeagueJoinRequestsSuccess = {
  success: true;
  data: LeagueJoinRequestWithProfile[];
};

// Get League Join Requests --> Result type
export type GetLeagueJoinRequestsResult =
  | GetLeagueJoinRequestsSuccess
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
export type CreateLeagueSeasonResult = CreateLeagueSeasonSuccess | SupabaseError;

export type UpdateLeagueSeasonPayload = {
  seasonId: string;
  seasonName: string;
  numOfDivisions: number;
  isTeamChampionship: boolean;
};

export type UpdateLeagueSeasonResult =
  | { success: true; data: LeagueSeasonTable }
  | SupabaseError;

export type RemoveLeagueSeasonPayload = {
  seasonId: string;
};

export type RemoveLeagueSeasonResult =
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

// Get League Followers --> Success type
export type GetLeagueFollowersSuccess = {
  success: true;
  data: ProfileTable[];
};

// Get League Followers --> Result type
export type GetLeagueFollowersResult = GetLeagueFollowersSuccess | SupabaseError;

// Get League Following --> Success type
export type GetLeagueFollowingSuccess = {
  success: true;
  data: LeagueTable[];
};

// Get League Following --> Result type
export type GetLeagueFollowingResult = GetLeagueFollowingSuccess | SupabaseError;


// Redux Types //
// League State --> used in Redux slice for leagues
export type LeagueState = {
  data: (LeagueWithInfo | LeagueTable)[] | null;
  currentLeague: (LeagueWithInfo | LeagueTable) | null;
  status: "idle" | "loading" | "fulfilled" | "rejected";
  error?: string;
  draft: LeagueDraft;
};