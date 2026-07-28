import type { Tag } from "storybook/internal/preview-api";

export type Announcement = {
  id: string;
  created_at: string;
  title: string;
  message: string;
  league_id: string;
  season_id: string;
  season_name: string;
  league_director_id: string;

  // not in supbase
  league_director?: {
    username: string;
    avatarType: "preset" | "upload";
    avatarValue: string;
    tags?: Tag[];
  };
}

// -- SUPABASE SERVICE TYPES -- //

export type SupabaseError = {
  success: false;
  error: {
    message: string;
    code: string;
    status: number;
  };
}; 

// -- ANNOUNCEMENTS SERVICE TYPES -- //

export type GetAnnouncementByIdPayload = {
  announcementId: string;
}

export type GetAnnouncementByIdResponse = {
  success: true;
  data: Announcement;
} | SupabaseError;

export type GetAnnouncementsByLeagueIdPayload = {
  leagueId: string;
}

export type GetAnnouncementsBySeasonIdPayload = {
  seasonId: string;
}

export type GetAnnouncementsByIdResponse = {
  success: true;
  data: Announcement[];
} | SupabaseError;


export type CreateAnnouncementPayload = {
  title: string;
  message: string;
  leagueId: string;
  seasonId: string;
  seasonName: string;
  leagueDirectorId: string;
}

export type CreateAnnouncementResponse = {
  success: true;
  data: Announcement;
} | SupabaseError;

export type UpdateAnnouncementPayload = {
  announcementId: string;
  title?: string;
  message?: string;
}

export type UpdateAnnouncementResponse = {
  success: true;
  data: Announcement;
} | SupabaseError;

export type DeleteAnnouncementPayload = {
  announcementId: string;
}

export type DeleteAnnouncementResponse = {
  success: true;
} | SupabaseError;