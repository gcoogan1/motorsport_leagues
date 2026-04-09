import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	createLeagueWithCover,
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

