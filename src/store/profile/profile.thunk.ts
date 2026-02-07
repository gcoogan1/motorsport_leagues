import {
  createProfileWithAvatar,
  getProfileByProfileId,
  getProfilesByUserId,
  updateProfileAvatar,
} from "@/services/profile.service";
import type {  CreateProfilePayload, UpdateAvatarPayload } from "@/types/profile.types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProfilesThunk = createAsyncThunk(
  "profile/fetch",
  async (userId: string) => {
    return getProfilesByUserId(userId);
  },
);

// Called when guest views a profile
export const getProfileByProfileIdThunk = createAsyncThunk(
  "profile/getById",
  async (profileId: string) => {
    return await getProfileByProfileId(profileId);
  },
);

export const createProfileThunk = createAsyncThunk(
  "profile/create",
  async (
    { accountId, username, gameType, avatar }: CreateProfilePayload,
    { rejectWithValue },
  ) => {
    const result = await createProfileWithAvatar({
      accountId,
      username,
      gameType,
      avatar,
    });

    if (!result.success) {
      return rejectWithValue(result.error);
    }

    return result;
  },
);

export const updateProfileAvatarThunk = createAsyncThunk(
  "profile/updateAvatar",
  async (
    payload: UpdateAvatarPayload,
    { rejectWithValue }
  ) => {
    const result = await updateProfileAvatar(payload);

    if (!result.success) {
      return rejectWithValue(result.error);
    }

    return result.data;
  }
);