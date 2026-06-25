import { supabase } from "@/lib/supabase";
import type {
	AddLeagueSeasonContentBlockPayload,
	AddLeagueSeasonContentBlockResult,
	ContentBlockTable,
	GetLeagueSeasonContentBlocksResult,
	RemoveLeagueSeasonContentBlockPayload,
	RemoveLeagueSeasonContentBlockResult,
	UpdateLeagueSeasonContentBlockPayload,
	UpdateLeagueSeasonContentBlockResult,
	UploadLeagueSeasonContentBlockImagePayload,
	UploadLeagueSeasonContentBlockImageResult,
} from "@/types/contentBlock.types";

// -- League Season Content Block Service -- //

// -- Content Block Image Constants -- //
const CONTENT_BLOCK_BUCKET = "content_block";
const DEFAULT_CONTENT_IMAGE_FILE = "defaultContent.png";
const CONTENT_BLOCK_PUBLIC_PATH_SEGMENT = `/storage/v1/object/public/${CONTENT_BLOCK_BUCKET}/`;

// -- Content Block Image Helpers -- //
const getContentImagePublicUrl = (filePath: string): string => {
	const { data } = supabase.storage
		.from(CONTENT_BLOCK_BUCKET)
		.getPublicUrl(filePath);

	return data.publicUrl;
};

const getStoredContentImagePath = (contentImageUrl?: string): string => {
	if (!contentImageUrl) {
		return DEFAULT_CONTENT_IMAGE_FILE;
	}

	const publicPathIndex = contentImageUrl.indexOf(
		CONTENT_BLOCK_PUBLIC_PATH_SEGMENT,
	);

	if (publicPathIndex === -1) {
		return contentImageUrl;
	}

	return decodeURIComponent(
		contentImageUrl
			.slice(publicPathIndex + CONTENT_BLOCK_PUBLIC_PATH_SEGMENT.length)
			.split("?")[0] ?? DEFAULT_CONTENT_IMAGE_FILE,
	);
};

export const resolveContentImageUrl = (contentImageUrl?: string): string =>
	getContentImagePublicUrl(getStoredContentImagePath(contentImageUrl));

export const uploadLeagueSeasonContentBlockImage = async ({
	accountId,
	seasonId,
	file,
}: UploadLeagueSeasonContentBlockImagePayload): Promise<UploadLeagueSeasonContentBlockImageResult> => {
	const fileExt = file.name.split(".").pop();
	const filePath = `${accountId}/${seasonId}-${crypto.randomUUID()}.${fileExt}`;

	const { error } = await supabase.storage
		.from(CONTENT_BLOCK_BUCKET)
		.upload(filePath, file, {
			upsert: true,
			contentType: file.type,
		});

	if (error) {
		return {
			success: false,
			error: {
				message: error.message,
				code: "SERVER_ERROR",
				status: 500,
			},
		};
	}

	const { data } = supabase.storage
		.from(CONTENT_BLOCK_BUCKET)
		.getPublicUrl(filePath);

	return {
		success: true,
		data: {
			src: data.publicUrl,
			path: filePath,
		},
	};
};

const mapContentBlockForDisplay = (
	contentBlock: ContentBlockTable,
): ContentBlockTable => ({
	...contentBlock,
	content_image_url: resolveContentImageUrl(contentBlock.content_image_url),
});

// -- Get League Season Content Blocks By Season ID -- //
export const getLeagueSeasonContentBlocksBySeasonId = async (
	seasonId: string,
	signal?: AbortSignal,
): Promise<GetLeagueSeasonContentBlocksResult> => {
	let query = supabase
		.from("season_content_block")
		.select("*")
		.eq("season_id", seasonId)
		.order("created_at", { ascending: true });

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
		data: (data ?? []).map(mapContentBlockForDisplay),
	};
};

// -- Add League Season Content Block -- //
export const addLeagueSeasonContentBlock = async ({
	seasonId,
	leagueId,
	header,
	description,
	contentImageUrl,
}: AddLeagueSeasonContentBlockPayload): Promise<AddLeagueSeasonContentBlockResult> => {
	const { data, error } = await supabase
		.from("season_content_block")
		.insert({
			season_id: seasonId,
			league_id: leagueId,
			header,
			description,
			content_image_url: getStoredContentImagePath(contentImageUrl),
		})
		.select("*")
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
		data: mapContentBlockForDisplay(data),
	};
};

// -- Update League Season Content Block -- //
export const updateLeagueSeasonContentBlock = async ({
	contentBlockId,
	header,
	description,
	contentImageUrl,
}: UpdateLeagueSeasonContentBlockPayload): Promise<UpdateLeagueSeasonContentBlockResult> => {
	const { data, error } = await supabase
		.from("season_content_block")
		.update({
			header,
			description,
			content_image_url: getStoredContentImagePath(contentImageUrl),
		})
		.eq("id", contentBlockId)
		.select("*")
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
		data: mapContentBlockForDisplay(data),
	};
};

// -- Remove League Season Content Block -- //
export const removeLeagueSeasonContentBlock = async (
	{ contentBlockId }: RemoveLeagueSeasonContentBlockPayload,
	signal?: AbortSignal,
): Promise<RemoveLeagueSeasonContentBlockResult> => {
	let query = supabase.from("season_content_block").delete().eq("id", contentBlockId);

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
