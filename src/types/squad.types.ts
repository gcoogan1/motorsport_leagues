// -- Squad Types -- //

// Constants //

export const SQUAD_MEMBER_ROLES = ["member", "founder"] as const;


// Supabase Service Types //

// Squad Table --> matches Supabase "squads" table but with camelCase keys
export type SquadTable = {
  id: string;
  created_at: string;
  founder_id: string;
  squad_name: string;
  squad_name_normalized: string;
  banner_image_url: string | null;
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


// Redux Types //

export type SquadState = {
  data: SquadTable[] | null;
  currentSquad: SquadTable | null;
  status: "idle" | "loading" | "fulfilled" | "rejected";
  error?: string;
  draft: Partial<SquadTable>;
};