import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	createLeagueWithCover,
	deleteLeagueById,
	getLeagueById,
	getLeaguesWithInfoByAccountId,
	updateLeagueSettings,
} from "@/services/league.service";
import type {
	CreateLeaguePayload,
	LeagueTable,
	LeagueWithInfo,
	UpdateLeaguePayload,
} from "@/types/league.types";

export const fetchLeaguesByAccountIdThunk = createAsyncThunk<
	LeagueWithInfo[],
	string,
	{ rejectValue: string }
>("league/getByAccountId", async (accountId, { rejectWithValue }) => {
	const result = await getLeaguesWithInfoByAccountId(accountId);

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

export const updateLeagueThunk = createAsyncThunk<
  LeagueTable,
  UpdateLeaguePayload,
  { rejectValue: string }
>("league/update", async (payload, { rejectWithValue }) => {
  const result = await updateLeagueSettings(payload);

  if (!result.success) {
    return rejectWithValue(result.error.message);
  }

  return result.data;
});

export const deleteLeagueThunk = createAsyncThunk<
	{ success: true },
	string,
	{ rejectValue: string }
>("league/delete", async (leagueId, { rejectWithValue }) => {
	const result = await deleteLeagueById(leagueId);

	if (!result.success) {
		return rejectWithValue(result.error.message);
	}

	return result;
});
