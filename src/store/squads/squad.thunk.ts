import { createSquadWithBanner, getSquadsByAccountId} from "@/services/squad.service";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { SquadTable, CreateSquadPayload, } from "@/types/squad.types";

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