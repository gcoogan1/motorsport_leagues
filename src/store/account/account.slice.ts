import type { AccountState } from "@/types/account.types";
import { createSlice } from "@reduxjs/toolkit";
import { fetchAccountThunk, updateAccountNameThunk, changeEmailThunk } from "./account.thunks";


// NOTE: Create, Change Password, and Delete Accounts are done in auth.service.ts
// This is because auth holds password management and user sessions.

const initialState: AccountState = {
  data: null,
  status: "idle",
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    clearAccount: (state) => {
      state.data = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
       /* Fetch Account */
      .addCase(fetchAccountThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAccountThunk.fulfilled, (state, action) => {
        state.status = "fulfilled";
        if ('data' in action.payload && action.payload.data) {
          state.data = action.payload.data;
        }
      })
      .addCase(fetchAccountThunk.rejected, (state) => {
        state.status = "rejected";
      })
      /* Update Name */
      .addCase(updateAccountNameThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateAccountNameThunk.fulfilled, (state, action) => {
        state.status = "fulfilled";
        if ('data' in action.payload && action.payload.data) {
          state.data = action.payload.data;
        }
      })
      .addCase(updateAccountNameThunk.rejected, (state) => {
        state.status = "rejected";
      })
      /* Change Email */
      .addCase(changeEmailThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(changeEmailThunk.fulfilled, (state) => {
        state.status = "fulfilled";
      })
      .addCase(changeEmailThunk.rejected, (state) => {
        state.status = "rejected";
      })
  },
});

export const { clearAccount } = accountSlice.actions;
export default accountSlice.reducer;
