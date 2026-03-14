import { supabase } from "@/lib/supabase";
import type {
  CreateAccountResult,
  GetAccountResult,
  AccountTable,
  UpdateAccountResult,
} from "@/types/account.types";

// --- Account Supabase Services -- //

// -- Create Account -- //
export const createAccount = async ({
  id: userId,
  email,
  firstName,
  lastName,
}: AccountTable): Promise<CreateAccountResult> => {
  const { error } = await supabase.from("accounts").insert({
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

// -- Get Account by User ID -- //
export const getAccountById = async (
  userId: string,
): Promise<GetAccountResult> => {
  const { data, error } = await supabase
    .from("accounts")
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
    error: { message: "Account not found", code: "NOT_FOUND", status: 404 },
  };
};

// -- Update Account -- //
export const updateAccountName = async (
  firstName: string,
  lastName: string,
  userId: string,
): Promise<UpdateAccountResult> => {
  const { data, error } = await supabase
    .from("accounts")
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
    error: { message: "Account not found", code: "NOT_FOUND", status: 404 },
  };
};

// -- Get Account Email by Account ID -- //
export const getAccountEmailById = async (
  accountId: string,
): Promise<{email: string} | null> => {
  const { data, error } = await supabase
    .from("accounts")
    .select("email")
    .eq("id", accountId)
    .single();

  if (error) {
    return null;
  }

  if (data) {
    return {
      email: data.email,
    };
  }

  return null;
};
