import type { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

// -- Authentication Context Type -- //
export type AuthContextType = {
  user: User | null;
  session: Session | null;
  isVerified: boolean;
  loading: boolean;
  refreshAuth: () => Promise<void>;
  resetAuth: () => Promise<void>; 
};

// -- Authentication Supabase Services -- //

// User Data Type
export type UserData = User | null;

// Purpose type for verification codes
export type Purpose = "signup" | "reset_password";

// Signup --> Payload type
export type SignupPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

// Signup --> Success type
type SignUpSuccess = {
  success: true;
  data: Awaited<ReturnType<typeof supabase.auth.signUp>>["data"];
};

// Supabase Error Type --> used in auth service results
type SupabaseError = {
  success: false;
  error: {
    message: string;
    code: string;
    status: number;
  };
};

// Signup --> Result type
export type SignUpResult = SignUpSuccess | SupabaseError;

// Send verification code --> Success type
type SendVerificationSuccess = {
  success: true;
  data: Awaited<ReturnType<typeof supabase.functions.invoke>>["data"];
};

// Send verification code --> Result type
export type SendVerificationResult = SendVerificationSuccess | SupabaseError;

// Verify code --> Success type
type VerifyCodeSuccess = {
  success: true;
  data: Awaited<ReturnType<typeof supabase.functions.invoke>>["data"];
};

// Verify code --> Result type
export type VerifyCodeResult = VerifyCodeSuccess | SupabaseError;

// Signin --> Payload type
export type SigninPayload = {
  email: string;
  password: string;
};

// Signin --> Success type
type SigninSuccess = {
  success: true;
  data: Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>["data"];
};

// Signin --> Result type
export type SignInResult = SigninSuccess | SupabaseError;

// Signout --> Success type
type SignoutSuccess = {
  success: true;
};

// Signout --> Result type
export type SignOutResult = SignoutSuccess | SupabaseError;

// Reset Password --> Success type
type ResetPasswordSuccess = {
  success: true;
  data: Awaited<ReturnType<typeof supabase.auth.updateUser>>["data"];
};

// Reset Password --> Result type
export type ResetPasswordResult = ResetPasswordSuccess | SupabaseError;