export type ProfileTable = {
  id: string;
  created_at: string;
  username: string;
  game_type: string;
  account_id: string;
};

// Redux Types //
export type ProfilesState = {
  data: ProfileTable[] | null;
  status: "idle" | "loading" | "fulfilled" | "rejected";
  error?: string;
};

export type ProfileFollowsTable = {
  follower_id: string;
  following_id: string;
};