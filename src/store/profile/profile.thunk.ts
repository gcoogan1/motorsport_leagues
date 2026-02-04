import {
  createProfileWithAvatar,
  getProfilesByUserId,
} from "@/services/profile.service";
import type { CreateProfilePayload } from "@/types/profile.types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProfilesThunk = createAsyncThunk(
  "profile/fetch",
  async (userId: string) => {
    return getProfilesByUserId(userId);
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
