// -- Profile Types -- //

// Constants //

export const GAME_TYPES = [
  "gt7",
  "iRacing",
  "assetoCorsaEvo",
  "leMansUltimate",
] as const;

export const GAME_FULL_NAMES: Record<typeof GAME_TYPES[number], string> = {
  gt7: "Gran Turismo 7",
  iRacing: "iRacing",
  assetoCorsaEvo: "Assetto Corsa EVO",
  leMansUltimate: "Le Mans Ultimate",
};

export const AVATAR_VARIANTS = [
  "black",
  "blue",
  "green",
  "red",
  "yellow",
] as const;

export type ProfileViewType = "owner" | "member" | "guest";

export type GameType = typeof GAME_TYPES[number];
export type AvatarVariant = typeof AVATAR_VARIANTS[number];
export type GameFullName = typeof GAME_FULL_NAMES[GameType];

export type AvatarValue =
  | { type: "upload"; file: File, previewUrl?: string }
  | { type: "preset"; variant: AvatarVariant };

// Supabase Service Types //

// Profile table --> matches Supabase "profiles" table but with camelCase keys
export type ProfileTable = {
  id: string;
  created_at: string;
  username: string;
  game_type: GameType;
  account_id: string;
  avatar_type: "preset" | "upload";
  avatar_value: string;
};

// Profile Follows table --> matches Supabase "profile_follows" table but with camelCase keys
export type ProfileFollowsTable = {
  follower_account_id: string;
  follower_id: string;
  following_id: string;
};



// Supabase Error Type --> used in profile service results
type SupabaseError = {
  success: false;
  error: {
    message: string;
    code: string;
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

export type GetFollowersSuccess = {
  success: true;
  data: ProfileTable[];
};

export type GetFollowersResult = GetFollowersSuccess | SupabaseError;

export type GetFollowingSuccess = {
  success: true;
  data: ProfileTable[];
};

export type GetFollowingResult = GetFollowingSuccess | SupabaseError;

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

// Update Avatar --> Payload type
export type UpdateAvatarPayload = {
  profileId: string;
  accountId: string;
  avatar:
    | { type: "preset"; variant: string }
    | { type: "upload"; file: File };
};

// Update Username --> Payload type
export type UpdateUsernamePayload = {
  profileId: string;
  username: string;
};

// Redux Types //

// Create/Edit Profile --> Draft Type (temporary storage for form data that is not yet submitted)
export type ProfileDraft = {
  gameType?: GameType;
  username?: string;
};

// Profiles --> State Type
export type ProfilesState = {
  data: ProfileTable[] | null;
  currentProfile?: ProfileTable | null;
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

// Follow Profile --> Payload Type
export type FollowProfileVariables = {
  userId: string;
  followingProfileId: string;
  followerProfileId: string;
};

// Unfollow Profile --> Payload Type
export type UnfollowProfileVariables = {
  userId: string;
  followingProfileId: string;
};
