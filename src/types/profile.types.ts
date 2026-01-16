
// -- Profile Types -- //


// Supabase Service Types //
// Profile table --> matches Supabase "profiles" table but with camelCase keys
export type ProfileTable = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isVerified?: boolean;
};

// Supabase Error Type --> used in profile service results
type SupabaseError = {
  success: false;
  error: {
    message: string;
    code: string;
    status: number;
  };
};

// Create profile --> Success type
export type CreateProfileSuccess = {
  success: true;
};

// Create profile --> Result type
export type CreateProfileResult = CreateProfileSuccess | SupabaseError;

// Get profile --> Success type
export type GetProfileSuccess = {
  success: true;
  data: ProfileTable;
};

// Get profile --> Result type
export type GetProfileResult = GetProfileSuccess | SupabaseError;

// Update profile --> Success type
export type UpdateProfileSuccess = {
  success: true;
  data: ProfileTable;
};

// Update profile --> Result type
export type UpdateProfileResult = UpdateProfileSuccess | SupabaseError;




// Redux Types //
// Profile --> State Type
export type ProfileState = {
  data: ProfileTable | null;
  status: "idle" | "loading" | "fulfilled" | "rejected";
  error?: string;
};

// Update Name --> Payload Type
export type ProfileNameUpdatePayload = {
  firstName: string;
  lastName: string;
  userId: string;
};

// Update Email --> Payload Type
export type ProfileEmailUpdatePayload = {
  email: string;
  userId: string;
};

// Update Password --> Payload Type
export type ProfilePasswordUpdatePayload = {
  password: string;
  userId: string;
};

// Change Email --> Payload Type
export type ChangeEmailPayload = {
  newEmail: string;
  userId: string;
};

