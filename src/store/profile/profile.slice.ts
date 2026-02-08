import type { ProfilesState } from "@/types/profile.types";
import { createSlice } from "@reduxjs/toolkit";
import {
  createProfileThunk,
  fetchProfilesThunk,
  getProfileByProfileIdThunk,
  updateProfileAvatarThunk,
  updateProfileUsernameThunk,
} from "./profile.thunk";

const initialState: ProfilesState = {
  data: null,
  currentProfile: null,
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

      // Fetch Profiles
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
        // Ensure payload has expected structure
        if (!("data" in action.payload)) return;
        // Get the profile from the payload
        const profile = action.payload.data?.[0];
        if (!profile) return;
        // Set the current profile
        state.currentProfile = profile;

        // If this is one of my profiles, keep data in sync
        if (state.data?.some((p) => p.id === profile.id)) {
          state.data = state.data.map((p) => p.id === profile.id ? profile : p);
        }
      })
      .addCase(getProfileByProfileIdThunk.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      })

      
      // Update Profile Avatar
      .addCase(updateProfileAvatarThunk.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(updateProfileAvatarThunk.fulfilled, (state, action) => {
        state.status = "fulfilled";
        const updatedProfile = action.payload;

        // Update currentProfile if it matches
        if (state.currentProfile?.id === updatedProfile.id) {
          state.currentProfile = updatedProfile;
        }

        // Update profile in list
        if (state.data) {
          const index = state.data.findIndex(p => p.id === updatedProfile.id);
          if (index !== -1) {
            state.data[index] = updatedProfile;
          }
        }
      })
      .addCase(updateProfileAvatarThunk.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      })

      // Update Profile Username 
      .addCase(updateProfileUsernameThunk.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(updateProfileUsernameThunk.fulfilled, (state, action) => {
        state.status = "fulfilled";
        const updatedProfile = action.payload;

        // Update currentProfile
        if (state.currentProfile?.id === updatedProfile.id) {
          state.currentProfile = updatedProfile;
        }

        // Update profile in list
        if (state.data) {
          const index = state.data.findIndex(p => p.id === updatedProfile.id);
          // Only update if the profile exists in the list (should always be true if currentProfile is set correctly)
          if (index !== -1) {
            state.data[index] = updatedProfile;
          }
        }
      })
      .addCase(updateProfileUsernameThunk.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      });
  },
});

export const { clearProfiles, updateProfileDraft, clearProfileDraft } =
  profileSlice.actions;

export default profileSlice.reducer;
