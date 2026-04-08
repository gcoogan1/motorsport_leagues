import type { Theme } from "@/app/design/tokens/theme";
import type { GameType } from "./profile.types";

// -- League Types -- //

// Constants //

export type LeagueStatus = "setup" | "active" | "complete";

export const LEAGUE_PARTICIPANT_ROLES = ["director", "driver", "steward", "broadcaster", "staff"] as const;

export const LEAGUE_COVER_VARIANTS = ["cover1", "cover2", "cover3", "cover4", "cover5"] as const;
export type LeagueCover = typeof LEAGUE_COVER_VARIANTS[number];

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
};

// Supabase Service Types //

// League Table --> matches Supabase "leagues" table but with camelCase keys
export type LeagueTable = {
  id: string;
  created_at: string;
  game_type: GameType;
  league_name: string;
  league_name_normalized: string;
  hosting_squad_id?: string;
  hosting_squad_name?: string;
  cover_type: "preset" | "upload";
  cover_value: string;
  theme_color: Theme;
  description?: string;
  timezone?: string;
  league_status: LeagueStatus;
};

// League Participant Table --> represents the "league_participants" table in Supabase, which tracks which profiles are participating in which leagues and their roles
export type LeagueParticipantTable = {
  id: string;
  created_at: string;
  league_id: string;
  profile_id: string;
  league_role: typeof LEAGUE_PARTICIPANT_ROLES[number];
};

// League Participant Profile --> combines participant table with profile info for display purposes (not in Supabase, but used in service results)
export type LeagueParticipantProfile = {
  id: string;
  profile_id: string;
  username: string;
  game_type: GameType;
  avatar_type: "preset" | "upload";
  avatar_value: string;
  league_role: typeof LEAGUE_PARTICIPANT_ROLES[number];
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
  leagueRole: typeof LEAGUE_PARTICIPANT_ROLES[number];
};

// Add League Participant --> Success type
export type AddLeagueParticipantSuccess = {
  success: true;
  data: LeagueParticipantTable;
};

// Add League Participant --> Result type
export type AddLeagueParticipantResult = AddLeagueParticipantSuccess | SupabaseError;

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
