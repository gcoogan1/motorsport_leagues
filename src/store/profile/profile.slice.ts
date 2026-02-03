import type { ProfilesState } from "@/types/profile.types";
import { createSlice } from "@reduxjs/toolkit";
import { fetchProfilesThunk } from "./profile.thunk";

const initialState: ProfilesState = {
  data: null,
  status: "idle",
  draft: {},
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfiles: (state) => {
      state.data = null;
      state.status = "idle";
    },

    // update draft for create/edit profile for form data storage
    updateProfileDraft: (state, action) => {
      state.draft = {
        ...state.draft,
        ...action.payload,
      };
    },

    // clear draft when form is canceled or completed
    clearProfileDraft: (state) => {
      state.draft = {};
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

export const { clearProfiles, updateProfileDraft, clearProfileDraft } = profileSlice.actions;

export default profileSlice.reducer;