import type { ProfilesState } from "@/types/profile.types";
import { createSlice } from "@reduxjs/toolkit";
import { fetchProfilesThunk, createProfileThunk, getProfileByProfileIdThunk } from "./profile.thunk";

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
        if (action.payload && "data" in action.payload) {
          state.data = action.payload.data || null;
        } else {
          state.data = null;
        }
      })
      .addCase(fetchProfilesThunk.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      })

      // Create Profile
      .addCase(createProfileThunk.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(createProfileThunk.fulfilled, (state, action) => {
        state.status = "fulfilled";
        if (action.payload && "data" in action.payload) {
          if (state.data) {
            state.data.push(action.payload.data);
          } else {
            state.data = [action.payload.data];
          }
        }
      })
      .addCase(createProfileThunk.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      })

      // Get Profile by ID
      .addCase(getProfileByProfileIdThunk.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(getProfileByProfileIdThunk.fulfilled, (state, action) => {
        state.status = "fulfilled";
        if (action.payload && "data" in action.payload) {
          const profile = action.payload.data?.[0];
          if (!profile) return;

          if (Array.isArray(state.data)) {
            const index = state.data.findIndex((p) => p.id === profile.id);
            if (index >= 0) {
              state.data[index] = profile;
            } else {
              state.data.push(profile);
            }
          } else {
            state.data = [profile];
          }
        }
      })
      .addCase(getProfileByProfileIdThunk.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      });
  },
});

export const { clearProfiles, updateProfileDraft, clearProfileDraft } = profileSlice.actions;

export default profileSlice.reducer;