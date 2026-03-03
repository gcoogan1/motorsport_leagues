import type { SquadDraft, SquadState } from "@/types/squad.types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { deleteProfileThunk } from "@/store/profile/profile.thunk";
import { createSquadThunk, fetchSquadsByAccountIdThunk, getSquadByIdThunk } from "./squad.thunk";

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

    updateSquadDraft: (state, action: PayloadAction<Partial<SquadDraft>>) => {
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
      // Create Squad
      .addCase(createSquadThunk.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(createSquadThunk.fulfilled, (state, action) => {
        state.status = "fulfilled";
        const createdSquad = {
          ...action.payload.data,
          member_count: action.payload.data.member_count ?? 1,
        };

        if (state.data) {
          state.data.push(createdSquad);
        } else {
          state.data = [createdSquad];
        }
        state.currentSquad = createdSquad;
      })
      .addCase(createSquadThunk.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      })
      // Get Squad By Id
      .addCase(getSquadByIdThunk.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(getSquadByIdThunk.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.currentSquad = action.payload;
      })
      .addCase(getSquadByIdThunk.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload ?? action.error.message;
      })
      // Remove squads founded by deleted profile from local squad state
      .addCase(deleteProfileThunk.fulfilled, (state, action) => {
        const deletedProfileId = action.meta.arg.profileId;

        if (state.data) {
          state.data = state.data.filter(
            (squad) => squad.founder_profile_id !== deletedProfileId,
          );
        }

        if (state.currentSquad?.founder_profile_id === deletedProfileId) {
          state.currentSquad = null;
        }
      });
  },
});

export const { clearSquads, updateSquadDraft, clearSquadDraft } =
  squadSlice.actions;

export default squadSlice.reducer;
