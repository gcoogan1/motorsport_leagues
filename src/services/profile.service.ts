import { supabase } from "@/lib/supabase";
import type {
  CreateProfileResult,
  GetProfileResult,
  ProfileTable,
  UpdateProfileResult,
} from "@/types/profile.types";

// --- Profile Supabase Services -- //

// -- Create Profile -- //
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

// -- Get Profile by User ID -- //
export const getProfileById = async (
  userId: string,
): Promise<GetProfileResult> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error?.code || "SERVER_ERROR",
        status: 500, // Supabase select errors do not have status codes
      },
    };
  }

  if (data) {
    return {
      success: true,
      data: {
        id: data.id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
      },
    };
  }

  return {
    success: false,
    error: { message: "Profile not found", code: "NOT_FOUND", status: 404 },
  };
};

// -- Update Profile -- //
export const updateProfileName = async (
  firstName: string,
  lastName: string,
  userId: string,
): Promise<UpdateProfileResult> => {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      first_name: firstName,
      last_name: lastName,
    })
    .eq("id", userId)
    .select()
    .single();

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
      data: {
        id: data.id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
      },
    };
  }

  return {
    success: false,
    error: { message: "Profile not found", code: "NOT_FOUND", status: 404 },
  };
};
