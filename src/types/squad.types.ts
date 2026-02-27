// -- Squad Types -- //

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

// Get Squads --> Success type
export type GetSquadsSuccess = {
  success: true;
  data: SquadTable[];
};

// Get Squads --> Result type
export type GetSquadsResult = GetSquadsSuccess | SupabaseError;

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


// Redux Types //

export type SquadState = {
  data: SquadTable[] | null;
  currentSquad: SquadTable | null;
  status: "idle" | "loading" | "fulfilled" | "rejected";
  error?: string;
  draft: SquadDraft;
};