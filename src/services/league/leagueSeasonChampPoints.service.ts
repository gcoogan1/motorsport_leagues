import { supabase } from "@/lib/supabase";
import type {
	AddLeagueSeasonChampPointsPayload,
	AddLeagueSeasonChampPointsResult,
	ChampPointsTable,
	GetLeagueSeasonChampPointsResult,
	RemoveLeagueSeasonChampPointsPayload,
	RemoveLeagueSeasonChampPointsResult,
	UpdateLeagueSeasonChampPointsPayload,
	UpdateLeagueSeasonChampPointsResult,
} from "@/types/champPoints.types";

// -- League Season Champ Points Service -- //

const mapChampPointsForDisplay = (
	champPoints: ChampPointsTable,
): ChampPointsTable => ({
	id: champPoints.id,
	created_at: champPoints.created_at,
	season_id: champPoints.season_id,
	league_id: champPoints.league_id,
	position: champPoints.position,
	points: champPoints.points ?? "1",
});

// -- Get League Season Champ Points By Season Id -- //
export const getLeagueSeasonChampPointsBySeasonId = async (
	seasonId: string,
	signal?: AbortSignal,
): Promise<GetLeagueSeasonChampPointsResult> => {
	let query = supabase
		.from("season_champ_points")
		.select("id,created_at,season_id,league_id,position,points")
		.eq("season_id", seasonId)

	if (signal) {
		query = query.abortSignal(signal);
	}

	const { data, error } = await query;

	if (error) {
		if (error.code === "ABORT" || error.message?.includes("abort")) {
			return { success: true, data: [] };
		}

		return {
			success: false,
			error: {
				message: error.message,
				code: error.code || "SERVER_ERROR",
				status: 500,
			},
		};
	}

	return {
		success: true,
		data: (data ?? []).map(mapChampPointsForDisplay),
	};
};

// -- Add League Season Champ Points -- //
export const addLeagueSeasonChampPoints = async ({
	seasonId,
	leagueId,
	position,
	points,
}: AddLeagueSeasonChampPointsPayload): Promise<AddLeagueSeasonChampPointsResult> => {
	const { data, error } = await supabase
		.from("season_champ_points")
		.insert({
			season_id: seasonId,
			league_id: leagueId,
			position,
			points,
		})
		.select("id,created_at,season_id,league_id,position,points")
		.single();

	if (error) {
		return {
			success: false,
			error: {
				message: error.message,
				code: error.code || "SERVER_ERROR",
				status: 500,
			},
		};
	}

	return {
		success: true,
		data: mapChampPointsForDisplay(data),
	};
};

// -- Update League Season Champ Points -- //
export const updateLeagueSeasonChampPoints = async ({
	champPointsId,
	position,
	points,
}: UpdateLeagueSeasonChampPointsPayload): Promise<UpdateLeagueSeasonChampPointsResult> => {
	const { data, error } = await supabase
		.from("season_champ_points")
		.update({
			position,
			points,
		})
		.eq("id", champPointsId)
		.select("id,created_at,season_id,league_id,position,points")
		.single();

	if (error) {
		return {
			success: false,
			error: {
				message: error.message,
				code: error.code || "SERVER_ERROR",
				status: 500,
			},
		};
	}

	return {
		success: true,
		data: mapChampPointsForDisplay(data),
	};
};

// -- Remove League Season Chamo Points -- //
export const removeLeagueSeasonChampPoints = async (
	{ champPointsId }: RemoveLeagueSeasonChampPointsPayload,
	signal?: AbortSignal,
): Promise<RemoveLeagueSeasonChampPointsResult> => {
	let query = supabase.from("season_champ_points").delete().eq("id", champPointsId);

	if (signal) {
		query = query.abortSignal(signal);
	}

	const { error } = await query;

	if (error) {
		if (error.code === "ABORT" || error.message?.includes("abort")) {
			return { success: true };
		}

		return {
			success: false,
			error: {
				message: error.message,
				code: error.code || "SERVER_ERROR",
				status: 500,
			},
		};
	}

	return { success: true };
};
