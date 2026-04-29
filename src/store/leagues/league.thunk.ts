import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	createLeagueWithCover,
	deleteLeagueById,
	getLeagueById,
	updateLeagueSettings,
} from "@/services/league/league.service";
import type {
	CreateLeaguePayload,
	LeagueTable,
	UpdateLeaguePayload,
} from "@/types/league.types";

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
