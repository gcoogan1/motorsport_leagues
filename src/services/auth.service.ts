import { supabase } from "@/lib/supabase";
import { createProfile } from "./profile.service";
import type {
  Purpose,
  ResetPasswordResult,
  SendVerificationResult,
  SigninPayload,
  SignInResult,
  SignOutResult,
  SignupPayload,
  SignUpResult,
  VerifyCodeResult,
} from "@/types/auth.types";
import { FunctionsHttpError } from "@supabase/supabase-js";

// -- Authentication Supabase Services -- //

// -- Sign Up User and Create Profile -- //
export const signUpUser = async (
  payload: SignupPayload,
): Promise<SignUpResult> => {
  const { data, error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
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
  purpose: Purpose,
): Promise<SendVerificationResult> => {
  const { data, error } = await supabase.functions.invoke("send-code", {
    body: { email, purpose },
  });

  if (error) {
    // Special handling for unverified account during password reset
    if (error instanceof FunctionsHttpError) {
      const errorMessage = await error.context.json()
      if (purpose === "reset_password" && errorMessage.error === "User is not verified") {
        return {
          success: false,
          error: {
            message: "Account is unverified.",
            code: "UNVERIFIED_ACCOUNT",
            status: 403,
          },
        };
      }
    }
    // General error handling
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
  purpose: Purpose,
): Promise<VerifyCodeResult> => {
  const { data, error } = await supabase.functions.invoke("verify-code", {
    body: { email, code, purpose },
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

// -- Login User -- //
export const loginUser = async (payload: SigninPayload): Promise<SignInResult> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: payload.email,
    password: payload.password,
  });

  // Handle login error or missing user
  if (error || !data.user) {
    return {
      success: false,
      error: {
        message: error?.message || "No user returned",
        code: error?.code || "UNKNOWN_ERROR",
        status: error?.status || 500,
      },
    };
  }

  // Fetch profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("is_verified")
    .eq("id", data.user.id)
    .single();

  // Log out if profile fetch fails and return error
  if (profileError) {
    return {
      success: false,
      error: {
        message: profileError.message,
        code: "PROFILE_FETCH_FAILED",
        status: 500,
      },
    };
  }

  // Log out if email not verified and return error
  if (!profile.is_verified) {
    return {
      success: false,
      error: {
        message: "Email not verified.",
        code: "EMAIL_NOT_VERIFIED",
        status: 401,
      },
    };
  }

  // Return success if login and profile verification succeed
  return {
    success: true,
    data,
  };
};


// -- Logout User -- //
export const logoutUser = async (): Promise<SignOutResult> => {
  const { error } = await supabase.auth.signOut();

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
  };
};

// -- Reset Password -- //
export const resetPassword = async (
  newPassword: string,
  email: string,
): Promise<ResetPasswordResult> => {
  const { data, error } = await supabase.functions.invoke("update-password", {
    body: { newPassword, email },
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
    data
  };
}
