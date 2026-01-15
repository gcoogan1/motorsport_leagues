import type { ProfileState } from "@/types/profile.types";
import { createSlice } from "@reduxjs/toolkit";
import { fetchProfileThunk, updateProfileNameThunk } from "./profile.thunks";

const initialState: ProfileState = {
  data: null,
  status: "idle",
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.data = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
       /* Fetch Profile */
      .addCase(fetchProfileThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProfileThunk.fulfilled, (state, action) => {
        state.status = "fulfilled";
        if ('data' in action.payload && action.payload.data) {
          state.data = action.payload.data;
        }
      })
      .addCase(fetchProfileThunk.rejected, (state) => {
        state.status = "rejected";
      })
      /* Update Profile */
      .addCase(updateProfileNameThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProfileNameThunk.fulfilled, (state, action) => {
        state.status = "fulfilled";
        if ('data' in action.payload && action.payload.data) {
          state.data = action.payload.data;
        }
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
