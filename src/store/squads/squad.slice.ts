import type { SquadState } from "@/types/squad.types";
import { createSlice } from "@reduxjs/toolkit";
import { fetchSquadsByAccountIdThunk } from "./squad.thunk";

const initialState: SquadState = {
  data: null,
  currentSquad: null,
  status: "idle",
  error: undefined,
  draft: {},
};

const squadSlice = createSlice({
  name: "squad",
  initialState,
  reducers: {
    clearSquads: (state) => {
      state.data = null;
      state.currentSquad = null;
      state.status = "idle";
      state.error = undefined;
    },

    updateSquadDraft: (state, action) => {
      state.draft = {
        ...state.draft,
        ...action.payload,
      };
    },

    clearSquadDraft: (state) => {
      state.draft = {};
    },
  },
  extraReducers: (builder) => {
    builder

      // Get Squads By Account Id
      .addCase(fetchSquadsByAccountIdThunk.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(fetchSquadsByAccountIdThunk.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.data = action.payload;
        state.currentSquad = action.payload[0] ?? null;
      })
      .addCase(fetchSquadsByAccountIdThunk.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload ?? action.error.message;
      })
  },
});

export const { clearSquads, updateSquadDraft, clearSquadDraft } =
  squadSlice.actions;

export default squadSlice.reducer;