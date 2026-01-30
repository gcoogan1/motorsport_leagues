import { supabase } from "@/lib/supabase";
// --- Profile Supabase Services -- //

// -- Get Profiles by User ID -- //
export const getProfilesByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("account_id", userId);

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error?.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  if (data) {
    return {
      success: true,
      data: data.map((profile) => ({
        id: profile.id,
        created_at: profile.created_at,
        account_id: profile.account_id,
        username: profile.username,
        game_type: profile.game_type,
      })),
    };
  }

  return {
    success: false,
    error: { message: "No profiles found", code: "NOT_FOUND", status: 404 },
  };
};
