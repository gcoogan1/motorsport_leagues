import type { ProfilesState } from "@/types/profile.types";
import { createSlice } from "@reduxjs/toolkit";
import { fetchProfilesThunk } from "./profile.thunk";

const initialState: ProfilesState = {
  data: null,
  status: "idle",
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfiles: (state) => {
      state.data = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfilesThunk.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(fetchProfilesThunk.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.data = action.payload.data || null;
      })
      .addCase(fetchProfilesThunk.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      });
  },
});

export const { clearProfiles } = profileSlice.actions;

export default profileSlice.reducer;