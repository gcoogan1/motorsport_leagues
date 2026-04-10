import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	createLeagueWithCover,
	getLeagueById,
	getLeaguesByAccountId,
} from "@/services/league.service";
import type {
	CreateLeaguePayload,
	LeagueTable,
} from "@/types/league.types";

export const fetchLeaguesByAccountIdThunk = createAsyncThunk<
	LeagueTable[],
	string,
	{ rejectValue: string }
>("league/getByAccountId", async (accountId, { rejectWithValue }) => {
	const result = await getLeaguesByAccountId(accountId);

	if (!result.success) {
		return rejectWithValue(result.error.message);
	}

	return result.data;
});

export const createLeagueThunk = createAsyncThunk<
	LeagueTable,
	CreateLeaguePayload,
	{ rejectValue: string }
>("league/create", async (payload, { rejectWithValue }) => {
	const result = await createLeagueWithCover(payload);

	if (!result.success) {
		return rejectWithValue(result.error.message);
	}

	return result.data;
});

export const getLeagueByIdThunk = createAsyncThunk<
  LeagueTable,
  string,
  { rejectValue: string }
>(
  "league/getById",
  async (leagueId: string, { rejectWithValue }) => {
    const result = await getLeagueById(leagueId);

    if (!result.success) {
      return rejectWithValue(result.error.message);
    }

    return result.data;
  },
);
