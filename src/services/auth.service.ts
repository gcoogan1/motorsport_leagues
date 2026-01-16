import { supabase } from "@/lib/supabase";
import { createProfile } from "./profile.service";
import type {
  ChangeEmailResult,
  ChangePasswordResult,
  Purpose,
  ResetPasswordResult,
  SendVerificationResult,
  SigninPayload,
  SignInResult,
  SignOutResult,
  SignupPayload,
  SignUpResult,
  VerifyCodeResult,
  VerifyPasswordPayload,
  VerifyPasswordResult,
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
      const errorMessage = await error.context.json();
      if (
        purpose === "reset_password" &&
        errorMessage.error === "User is not verified"
      ) {
        return {
          success: false,
          error: {
            message: "Account is unverified.",
            code: "UNVERIFIED_ACCOUNT",
            status: 403,
          },
        };
      }

      if (
        purpose === "change_email" &&
        errorMessage.error === "Email already in use"
      ) {
        return {
          success: false,
          error: {
            message: "Email already in use",
            code: "EXISTING_EMAIL",
            status: 409,
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
  const { error } = await supabase.functions.invoke("verify-code", {
    body: { email, code, purpose },
  });

  if (error) {
    if (error instanceof FunctionsHttpError) {
      const errorMessage = await error.context.json();
      if (errorMessage.error === "Invalid or expired code") {
        return {
          success: false,
          error: {
            message: "Invalid or expired code",
            code: "INVALID_OR_EXPIRED_CODE",
            status: 400,
          },
        };
      }
    }
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

// -- Login User -- //
export const loginUser = async (
  payload: SigninPayload,
): Promise<SignInResult> => {
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

// -- Reset Password (Sign In) -- //
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
    data,
  };
};

// -- Change Email -- //
export const changeEmail = async (
  newEmail: string,
  userId: string,
): Promise<ChangeEmailResult> => {
  const { error } = await supabase.functions.invoke("change-email", {
    body: { newEmail, userId },
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
  };
};

// -- Verify Password (Before password change) -- //
export const verifyPassword = async (
  payload: VerifyPasswordPayload,
): Promise<VerifyPasswordResult> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: payload.email,
    password: payload.password,
  });

  if (error || !data.user) {
    return {
      success: false,
      error: {
        message: error?.message || "Password verification failed",
        code: error?.code || "PASSWORD_VERIFICATION_FAILED",
        status: error?.status || 500,
      },
    };
  }

  return {
    success: true,
  };
};

// -- Change Password (Already Authenticated) -- //
export const changePassword = async (
  newPassword: string,
): Promise<ChangePasswordResult> => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
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
  };
};