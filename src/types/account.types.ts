
import type { modalVariants } from "./modal.types";

// -- Account Types -- //


// Supabase Service Types //
// Account table --> matches Supabase "accounts" table but with camelCase keys
export type AccountTable = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isVerified?: boolean;
};

// Supabase Error Type --> used in account service results
type SupabaseError = {
  success: false;
  error: {
    message: string;
    code: keyof typeof modalVariants | string;
    status: number;
  };
};

// Create account --> Success type
export type CreateAccountSuccess = {
  success: true;
};

// Create account --> Result type
export type CreateAccountResult = CreateAccountSuccess | SupabaseError;

// Get account --> Success type
export type GetAccountSuccess = {
  success: true;
  data: AccountTable;
};

// Get account --> Result type
export type GetAccountResult = GetAccountSuccess | SupabaseError;

// Update account --> Success type
export type UpdateAccountSuccess = {
  success: true;
  data: AccountTable;
};

// Update account --> Result type
export type UpdateAccountResult = UpdateAccountSuccess | SupabaseError;




// Redux Types //
// Account --> State Type
export type AccountState = {
  data: AccountTable | null;
  status: "idle" | "loading" | "fulfilled" | "rejected";
  error?: string;
};

// Update Name --> Payload Type
export type AccountNameUpdatePayload = {
  firstName: string;
  lastName: string;
  userId: string;
};

// Update Email --> Payload Type
export type AccountEmailUpdatePayload = {
  email: string;
  userId: string;
};

// Update Password --> Payload Type
export type AccountPasswordUpdatePayload = {
  password: string;
  userId: string;
};

// Change Email --> Payload Type
export type ChangeEmailPayload = {
  newEmail: string;
  userId: string;
};

