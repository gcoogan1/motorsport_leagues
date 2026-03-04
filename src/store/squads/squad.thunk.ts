import { createSquadWithBanner, getSquadsByAccountId, getSquadById, editSquadBanner } from "@/services/squad.service";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { SquadTable, CreateSquadPayload, BannerImageValue, } from "@/types/squad.types";

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
    payload: { squadId: string; banner: BannerImageValue },
    { rejectWithValue },
  ) => {
    const result = await editSquadBanner(payload.squadId, payload.banner);

    if (!result.success) {
      return rejectWithValue(result.error.message);
    }

    return result.data;
  },
);