import { createAsyncThunk } from "@reduxjs/toolkit";
import { getProfileById, updateProfileName } from "@/services/profile.service";
import type { ProfileNameUpdatePayload } from "@/types/profile.types";


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
