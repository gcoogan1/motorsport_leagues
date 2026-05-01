import type { LeagueDraft, LeagueState } from "@/types/league.types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  createLeagueThunk,
  deleteLeagueThunk,
  getLeagueByIdThunk,
  updateLeagueThunk,
} from "./league.thunk";

const initialState: LeagueState = {
  data: null,
  currentLeague: null,
  status: "idle",
  error: undefined,
  draft: {},
};

const updateLeagueInState = (state: LeagueState, updatedLeague: LeagueState["currentLeague"]) => {
  if (!updatedLeague || !state.data) {
    return;
  }

  const index = state.data.findIndex((league) => league.id === updatedLeague.id);

  if (index !== -1) {
    state.data[index] = updatedLeague;
  }
};

const leagueSlice = createSlice({
  name: "league",
  initialState,
  reducers: {
    clearLeagues: (state) => {
      state.data = null;
      state.currentLeague = null;
      state.status = "idle";
      state.error = undefined;
    },

    updateLeagueDraft: (state, action: PayloadAction<Partial<LeagueDraft>>) => {
      state.draft = {
        ...state.draft,
        ...action.payload,
      };
    },

    clearLeagueDraft: (state) => {
      state.draft = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Create League
      .addCase(createLeagueThunk.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(createLeagueThunk.fulfilled, (state, action) => {
        state.status = "fulfilled";
        const createdLeague = action.payload;

        // Add the newly created league to the list of leagues in state
        if (state.data) {
          state.data.push(createdLeague);
        } else {
          state.data = [createdLeague];
        }

        // Set the newly created league as the current league
        state.currentLeague = createdLeague;
        state.draft = {};
      })
      .addCase(createLeagueThunk.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload ?? action.error.message;
      })
      // Get League By Id
      .addCase(getLeagueByIdThunk.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(getLeagueByIdThunk.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.currentLeague = action.payload;
        updateLeagueInState(state, action.payload);
      })
      .addCase(getLeagueByIdThunk.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload ?? action.error.message;
      })
      // Update League
      .addCase(updateLeagueThunk.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(updateLeagueThunk.fulfilled, (state, action) => {
        state.status = "fulfilled";
        const updatedLeague = action.payload;

        // Update the current league with the new data
        state.currentLeague = updatedLeague;
        updateLeagueInState(state, updatedLeague);
      })
      .addCase(updateLeagueThunk.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload ?? action.error.message;
      })
      // Delete League
      .addCase(deleteLeagueThunk.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(deleteLeagueThunk.fulfilled, (state, action) => {
        state.status = "fulfilled";
        const deletedLeagueId = action.meta.arg;

        if (state.data) {
          state.data = state.data.filter((league) => league.id !== deletedLeagueId);
        }

        if (state.currentLeague?.id === deletedLeagueId) {
          state.currentLeague = null;
        }
      })
      .addCase(deleteLeagueThunk.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload ?? action.error.message;
      });
  },
});

export const { clearLeagues, updateLeagueDraft, clearLeagueDraft } = leagueSlice.actions;

export default leagueSlice.reducer;