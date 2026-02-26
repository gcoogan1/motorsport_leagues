import { fetchSquadsByAccountId } from "@/services/squad.serice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { SquadTable } from "@/types/squad.types";

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
    const result = await fetchSquadsByAccountId(accountId);

    if (!result.success) {
      return rejectWithValue(result.error.message);
    }

    return result.data;
  },
);