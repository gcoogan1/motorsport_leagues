// -- Content Block Types -- //

export type ContentBlockTable = {
  id: string;
  created_at: string;
  season_id: string;
  league_id: string;
  header: string;
  description?: string;
  content_image_url: string;
};

type SupabaseError = {
  success: false;
  error: {
    message: string;
    code: string;
    status: number;
  };
};

export type UploadLeagueSeasonContentBlockImagePayload = {
	accountId: string;
	seasonId: string;
	file: File;
};

export type UploadLeagueSeasonContentBlockImageResult =
	| {
			success: true;
			data: {
				src: string;
				path: string;
			};
		}
	| {
			success: false;
			error: {
				message: string;
				code: string;
				status: number;
			};
		};

export type GetLeagueSeasonContentBlocksResult =
  | { success: true; data: ContentBlockTable[] }
  | SupabaseError;

export type AddLeagueSeasonContentBlockPayload = {
  seasonId: string;
  leagueId: string;
  header: string;
  description?: string;
  contentImageUrl?: string;
};

export type AddLeagueSeasonContentBlockResult =
  | { success: true; data: ContentBlockTable }
  | SupabaseError;

export type UpdateLeagueSeasonContentBlockPayload = {
  contentBlockId: string;
  seasonId: string;
  header: string;
  description?: string;
  contentImageUrl?: string;
};

export type UpdateLeagueSeasonContentBlockResult =
  | { success: true; data: ContentBlockTable }
  | SupabaseError;

export type RemoveLeagueSeasonContentBlockPayload = {
  contentBlockId: string;
  seasonId: string;
};

export type RemoveLeagueSeasonContentBlockResult =
  | { success: true }
  | SupabaseError;