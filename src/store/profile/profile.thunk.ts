import {
  createProfileWithAvatar,
  deleteProfile,
  getProfileByProfileId,
  getProfilesByUserId,
  updateProfileAvatar,
  updateProfileUsername,
} from "@/services/profile.service";
import { squadApi } from "@/store/rtkQueryAPI/squadApi";
import type {  CreateProfilePayload, UpdateAvatarPayload, UpdateUsernamePayload } from "@/types/profile.types";
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
  async (profileId: string, { rejectWithValue }) => {
    const result = await getProfileByProfileId(profileId);

    if (!result.success) {
      return rejectWithValue(result.error.message);
    }

    return result;
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

export const updateProfileUsernameThunk = createAsyncThunk(
  "profile/updateUsername",
  async (
    payload: UpdateUsernamePayload,
    { rejectWithValue }
  ) => {
    const result = await updateProfileUsername(payload);

    if (!result.success) {
      return rejectWithValue(result.error);
    }

    return result.data;
  }
);

export const deleteProfileThunk = createAsyncThunk(
  "profile/delete",
  async (
    {
      profileId,
      avatarValue,
      accountId,
    }: { profileId: string; avatarValue?: string; accountId?: string },
    { rejectWithValue, dispatch }
  ) => {
    const result = await deleteProfile(profileId, avatarValue);

    if (!result.success) {
      return rejectWithValue(result.error);
    }

    if (accountId) {
      dispatch(
        squadApi.util.invalidateTags([
          { type: "SquadFollowing", id: accountId },
        ]),
      );
    }

    return result;
  }
);