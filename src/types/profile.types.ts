export const GAME_TYPES = [
  "gt7",
  "iRacing",
  "assetoCorsaEvo",
  "leMansUltimate",
] as const;

export type GameType = typeof GAME_TYPES[number];

export type ProfileTable = {
  id: string;
  created_at: string;
  username: string;
  game_type: GameType;
  account_id: string;
};

export type ProfileFollowsTable = {
  follower_id: string;
  following_id: string;
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
  status: "idle" | "loading" | "fulfilled" | "rejected";
  error?: string;
  draft: ProfileDraft;
};

