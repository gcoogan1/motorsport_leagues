import { createAsyncThunk } from "@reduxjs/toolkit";
import { getProfileById, updateProfileName } from "@/services/profile.service";
import type { ChangeEmailPayload, ProfileNameUpdatePayload } from "@/types/profile.types";
import { changeEmail } from "@/services/auth.service";


export const fetchProfileThunk = createAsyncThunk(
  "profile/fetch",
  async (userId: string) => {
    return getProfileById(userId);
  }
);

export const updateProfileNameThunk = createAsyncThunk(
  "profile/update",
  async ({
    firstName,
    lastName,
    userId,
  }: ProfileNameUpdatePayload) => {
    return updateProfileName(firstName, lastName, userId);
  }
);

// Update both auth email and profile email
export const changeEmailThunk = createAsyncThunk(
  "profile/changeEmail",
  async ({
    newEmail, userId,
  }: ChangeEmailPayload) => {
    return changeEmail(newEmail, userId);
  })