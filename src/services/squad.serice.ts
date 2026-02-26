import { supabase } from "@/lib/supabase";
import type { GetSquadsResult } from "@/types/squad.types";

export const fetchSquadsByAccountId = async (accountId: string): Promise<GetSquadsResult> => {
  const { data, error } = await supabase
    .from("squads")
    .select("*")
    .eq("founder_account_id", accountId);

  
  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  return { success: true, data: data || [] };
}

// -- Example of creating a squad with normalized name for searching --- IGNORE ---
// const normalize = (name: string) =>
//   name.trim().toLowerCase().replace(/\s+/g, " ");

// const { error } = await supabase.from("squads").insert({
//   squad_name: squadName,
//   squad_name_normalized: normalize(squadName),
//   banner_url,
//   founder: user.id,
// });