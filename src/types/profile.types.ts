
export const GAME_TYPES = [
  "gt7",
  "iRacing",
  "assetoCorsaEvo",
  "leMansUltimate",
] as const;

export const AVATAR_VARIANTS = [
  "black",
  "blue",
  "green",
  "red",
  "yellow",
] as const;

export type GameType = typeof GAME_TYPES[number];
export type AvatarVariant = typeof AVATAR_VARIANTS[number];

export type AvatarValue =
  | { type: "upload"; file: File }
  | { type: "preset"; variant: AvatarVariant };
;


export type ProfileTable = {
  id: string;
  created_at: string;
  username: string;
  game_type: GameType;
  account_id: string;
  avatar_type: "preset" | "upload";
  avatar_value: string;
};

export type ProfileFollowsTable = {
  follower_id: string;
  following_id: string;
};

// Supabase Error Type --> used in profile service results
type SupabaseError = {
  success: false;
  error: {
    message: string;
    code:  string;
    status: number;
  };
};

// Get Profiles --> Success type
export type GetProfilesSuccess = {
  success: true;
  data: ProfileTable[];
};

// Get Profiles --> Result type
export type GetProfilesResult = GetProfilesSuccess | SupabaseError;

// Create Profile --> Success type
export type CreateProfileSuccess = {
  success: true;
  data: ProfileTable;
};

// Create Profile --> Result type
export type CreateProfileResult = CreateProfileSuccess | SupabaseError;

// Check Username Availability Result type
export type CheckUsernameAvailabilityResult =
  | { success: true }
  | SupabaseError;



// Redux Types //

// Create/Edit Profile --> Draft Type (temporary storage for form data that is not yet submitted)
export type ProfileDraft = {
  gameType?: GameType;
  username?: string;
};


// Profiles --> State Type
export type ProfilesState = {
  data: ProfileTable[] | null;
  status: "idle" | "loading" | "fulfilled" | "rejected";
  error?: string;
  draft: ProfileDraft;
};


// Add Profile --> Payload Type
export type CreateProfilePayload = {
  accountId: string;
  username: string;
  gameType: string;
  avatar: AvatarValue;
};
