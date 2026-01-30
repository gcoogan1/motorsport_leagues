import { getProfilesByUserId } from "@/services/profile.service";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProfilesThunk = createAsyncThunk(
  "profile/fetch",
  async (userId: string) => {
    return getProfilesByUserId(userId);
  }
);
