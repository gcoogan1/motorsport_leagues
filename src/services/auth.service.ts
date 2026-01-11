import { supabase } from "@/lib/supabase";
import { createProfile } from "./profile.service";
import type {
  SendVerificationResult,
  SignupPayload,
  SignUpResult,
  VerifyCodeResult,
} from "@/types/auth.types";

// -- Authentication Supabase Services -- //

// -- Sign Up User and Create Profile -- //
export const signUpUser = async (
  payload: SignupPayload,
): Promise<SignUpResult> => {
  const { data, error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      data: {
        first_name: payload.firstName,
        last_name: payload.lastName,
        verified: false,
      },
    },
  });

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error?.code || "UNKNOWN_ERROR",
        status: error?.status || 500,
      },
    };
  }

  // Create user profile in profiles table
  if (data.user) {
    const profileRes = await createProfile({
      id: data.user.id,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      isVerified: false,
    });

    if (!profileRes.success) {
      return {
        success: false,
        error: {
          message: profileRes.error?.message || "Failed to create profile",
          code: profileRes.error?.code || "PROFILE_CREATION_FAILED",
          status: profileRes.error?.status || 500,
        },
      };
    }
  }

  // Return success if both auth sign-up and profile creation succeed
  return {
    success: true,
    data,
  };
};

// -- Send Verification Code -- //
export const sendVerificationCode = async (
  email: string,
): Promise<SendVerificationResult> => {
  const { data, error } = await supabase.functions.invoke("send-code", {
    body: { email },
  });

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error?.code || "UNKNOWN_ERROR",
        status: error?.status || 500,
      },
    };
  }

  return {
    success: true,
    data,
  };
};


// -- Verify Code-- //
export const verifyCode = async (
  email: string,
  code: string,
): Promise<VerifyCodeResult> => {
  const { data, error } = await supabase.functions.invoke("verify-code", {
    body: { email, code },
  });

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error?.code || "UNKNOWN_ERROR",
        status: error?.status || 500,
      },
    };
  }

  return {
    success: true,
    data,
  };
};
