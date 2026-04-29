import { createSquadWithBanner, getSquadsByAccountId, getSquadById, editSquadBanner, editSquadName, deleteSquadById } from "@/services/squad/squad.service";
import { squadApi } from "@/rtkQuery/API/squadApi";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { SquadTable, CreateSquadPayload, EditBannerPayload, EditSquadNamePayload } from "@/types/squad.types";

export const fetchSquadsByAccountIdThunk = createAsyncThunk<
  SquadTable[],
  string,
  { rejectValue: string }
>(
  "squad/getByAccountId",
  async (
    accountId: string,
    { rejectWithValue }
  ) => {
    const result = await getSquadsByAccountId(accountId);

    if (!result.success) {
      return rejectWithValue(result.error.message);
    }

    return result.data;
  },
);

export const createSquadThunk = createAsyncThunk(
  "squad/create",
  async (
    { founderAccountId, founderProfileId, squadName, banner }: CreateSquadPayload,
    { rejectWithValue },
  ) => {
    const result = await createSquadWithBanner({
      founderAccountId,
      founderProfileId,
      squadName,
      banner,
    });

    if (!result.success) {
      return rejectWithValue(result.error);
    }

    return result;
  },
);;

export const getSquadByIdThunk = createAsyncThunk<
  SquadTable,
  string,
  { rejectValue: string }
>(
  "squad/getById",
  async (squadId: string, { rejectWithValue }) => {
    const result = await getSquadById(squadId);

    if (!result.success) {
      return rejectWithValue(result.error.message);
    }

    return result.data;
  },
);

export const editBannerThunk = createAsyncThunk(
  "squad/editBanner",
  async (
    payload: EditBannerPayload,
    { rejectWithValue },
  ) => {
    const result = await editSquadBanner(payload);

    if (!result.success) {
      return rejectWithValue(result.error.message);
    }

    return result.data;
  },
);

export const editSquadNameThunk = createAsyncThunk(
  "squad/editName",
  async (
    payload: EditSquadNamePayload,
    { rejectWithValue },
  ) => {
    const result = await editSquadName(payload);

    if (!result.success) {
      return rejectWithValue(result.error.message);
    }

    return result.data;
  },
);

export const deleteSquadThunk = createAsyncThunk(
  "squad/delete",
  async (
    squadId: string,
    { rejectWithValue, dispatch },
  ) => { 
    const result = await deleteSquadById(squadId);

      if (!result.success) {
        return rejectWithValue(result.error.message);
      }

      dispatch(
        squadApi.util.invalidateTags([
          "Squads",
          "SquadMembers",
          "SquadFollowers",
          "SquadFollowing",
        ]),
      );

      return result;
  },
);