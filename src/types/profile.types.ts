
// -- Profile Type -- //

// Profile table --> matches Supabase "profiles" table but with camelCase keys
export type ProfileTable = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
//   isVerified: boolean; --- IGNORE ---
};

// Create profile result type
export type CreateProfileResult = {
  success: boolean;
  error?: {
    message: string;
    code: string;
    status: number;
  };
}



