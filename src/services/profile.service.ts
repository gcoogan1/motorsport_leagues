import { supabase } from "@/lib/supabase";
import type { CreateProfileResult, ProfileTable } from "@/types/profile.types";


export const createProfile = async ({
  id: userId,
  email,
  firstName,
  lastName,
}: ProfileTable): Promise<CreateProfileResult> => {
  const { error } = await supabase.from("profiles").insert({
    id: userId,
    email,
    first_name: firstName,
    last_name: lastName,
    is_verified: false,
  });

  if (error) {

    return {
      success: false,
      error: {
        message: error.message,
        code: error?.code || "UNKNOWN_ERROR",
        status: 500, // Supabase insert errors do not have status codes
      },
    };
  }

  return {
    success: true,
  };
};
