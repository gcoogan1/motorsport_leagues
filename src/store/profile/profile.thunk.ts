import { createProfileWithAvatar, getProfilesByUserId } from "@/services/profile.service";
import type { CreateProfilePayload } from "@/types/profile.types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProfilesThunk = createAsyncThunk(
  "profile/fetch",
  async (userId: string) => {
    return getProfilesByUserId(userId);
  }
);

export const createProfileThunk = createAsyncThunk(
  "profile/create",
  async (
    { accountId, username, gameType, avatar }: CreateProfilePayload,
  ) => {
    return createProfileWithAvatar({ accountId, username, gameType, avatar });
});
