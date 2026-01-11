import type { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

// -- Authentication Context Type -- //
export type AuthContextType = {
  user: User | null;
  session: Session | null;
  isVerified: boolean;
  loading: boolean;
  refreshAuth: () => Promise<void>;
};

// -- Authentication Supabase Services -- //

// User data type
export type UserData = User | null;

// Signup payload and result types
export type SignupPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

// Signup success result type
type SignUpSuccess = {
  success: true;
  data: Awaited<ReturnType<typeof supabase.auth.signUp>>["data"];
};

type SupabaseError = {
  success: false;
  error: {
    message: string;
    code: string;
    status: number;
  };
};

export type SignUpResult = SignUpSuccess | SupabaseError;

// Send verification code result types
type SendVerificationSuccess = {
  success: true;
  data: Awaited<ReturnType<typeof supabase.functions.invoke>>["data"];
};

export type SendVerificationResult = SendVerificationSuccess | SupabaseError;


// Verify code result types
type VerifyCodeSuccess = {
  success: true;
  data: Awaited<ReturnType<typeof supabase.functions.invoke>>["data"];
};

export type VerifyCodeResult = VerifyCodeSuccess | SupabaseError;