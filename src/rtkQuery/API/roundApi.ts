import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
	createRound,
	deleteRound,
	deleteRoundsByDivisionId,
	deleteRoundsBySeasonId,
	getRoundById,
	getRoundsByDivisionId,
	getRoundsBySeasonId,
	updateRound,
} from "@/services/round/round.service";
import type {
	CreateRoundPayload,
	CreateRoundResponse,
	DeleteRoundResponse,
	GetRoundByIdResponse,
	GetRoundsResponse,
	RoundTable,
	UpdateRoundPayload,
	UpdateRoundResponse,
} from "@/types/round.types";

type DeleteRoundMutationPayload = {
	roundId: string;
	divisionId?: string;
};

export const roundApi = createApi({
	reducerPath: "roundApi",
	baseQuery: fakeBaseQuery(),
	tagTypes: ["Rounds"],
	endpoints: (builder) => ({
		getRoundById: builder.query<RoundTable, string>({
			queryFn: async (roundId) => {
				try {
					const result: GetRoundByIdResponse = await getRoundById(roundId);

					if (!result.success) {
						return {
							error: {
								status: result.error.status,
								data: result.error,
							},
						};
					}

					return { data: result.data };
				} catch (error) {
					return { error };
				}
			},
			providesTags: (_result, _error, roundId) => [
				{ type: "Rounds", id: roundId },
			],
		}),
		getRoundsByDivisionId: builder.query<RoundTable[], string>({
			queryFn: async (divisionId) => {
				try {
					const result: GetRoundsResponse =
						await getRoundsByDivisionId(divisionId);

					if (!result.success) {
						return {
							error: {
								status: result.error.status,
								data: result.error,
							},
						};
					}

					return { data: result.data };
				} catch (error) {
					return { error };
				}
			},
			providesTags: (result, _error, divisionId) => [
				{ type: "Rounds", id: `division-${divisionId}` },
				...(result?.map((round) => ({
					type: "Rounds" as const,
					id: round.id,
				})) ?? []),
			],
		}),
    getRoundsBySeasonId: builder.query<RoundTable[], string>({
      queryFn: async (seasonId) => {
        try {
          const result: GetRoundsResponse =
            await getRoundsBySeasonId(seasonId);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result.data };
        } catch (error) {
          return { error };
        }
      },
      providesTags: (result, _error, seasonId) => [
        { type: "Rounds", id: `season-${seasonId}` },
        ...(result?.map((round) => ({
          type: "Rounds" as const,
          id: round.id,
        })) ?? []),
      ],
    }),
		createRound: builder.mutation<RoundTable, CreateRoundPayload>({
			queryFn: async (payload) => {
				try {
					const result: CreateRoundResponse = await createRound(payload);

					if (!result.success) {
						return {
							error: {
								status: result.error.status,
								data: result.error,
							},
						};
					}

					return { data: result.data };
				} catch (error) {
					return { error };
				}
			},
			invalidatesTags: (result, _error, payload) => [
				{ type: "Rounds", id: `division-${payload.divisionId}` },
				...(result ? [{ type: "Rounds" as const, id: result.id }] : []),
			],
		}),
		updateRound: builder.mutation<RoundTable, UpdateRoundPayload>({
			queryFn: async (payload) => {
				try {
					const result: UpdateRoundResponse = await updateRound(payload);

					if (!result.success) {
						return {
							error: {
								status: result.error.status,
								data: result.error,
							},
						};
					}

					return { data: result.data };
				} catch (error) {
					return { error };
				}
			},
			invalidatesTags: (result, _error, payload) => {
				const divisionTags = [result?.division_id]
					.filter(Boolean)
					.map((divisionId) => ({
						type: "Rounds" as const,
						id: `division-${divisionId}`,
					}));

				return [
					{ type: "Rounds", id: payload.roundId },
					...divisionTags,
				];
			},
		}),
		deleteRound: builder.mutation<boolean, DeleteRoundMutationPayload>({
			queryFn: async ({ roundId }) => {
				try {
					const result: DeleteRoundResponse = await deleteRound(roundId);

					if (!result.success) {
						return {
							error: {
								status: result.error.status,
								data: result.error,
							},
						};
					}

					return { data: true };
				} catch (error) {
					return { error };
				}
			},
			invalidatesTags: (_result, _error, { roundId, divisionId }) => [
				{ type: "Rounds", id: roundId },
				...(divisionId
					? [{ type: "Rounds" as const, id: `division-${divisionId}` }]
					: ["Rounds" as const]),
			],
		}),
		deleteRoundsByDivisionId: builder.mutation<boolean, string>({
			queryFn: async (divisionId) => {
				try {
					const result: DeleteRoundResponse =
						await deleteRoundsByDivisionId(divisionId);

					if (!result.success) {
						return {
							error: {
								status: result.error.status,
								data: result.error,
							},
						};
					}

					return { data: true };
				} catch (error) {
					return { error };
				}
			},
			invalidatesTags: (_result, _error, divisionId) => [
				{ type: "Rounds", id: `division-${divisionId}` },
			],
		}),
    deleteRoundsBySeasonId: builder.mutation<boolean, string>({
      queryFn: async (seasonId) => {
        try {
          const result: DeleteRoundResponse =
            await deleteRoundsBySeasonId(seasonId);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: true };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: (_result, _error, seasonId) => [
        { type: "Rounds", id: `season-${seasonId}` },
      ],
    }),
	}),
});

export const {
	useGetRoundByIdQuery,
	useGetRoundsByDivisionIdQuery,
  useGetRoundsBySeasonIdQuery,
	useCreateRoundMutation,
	useUpdateRoundMutation,
	useDeleteRoundMutation,
	useDeleteRoundsByDivisionIdMutation,
	useDeleteRoundsBySeasonIdMutation,
} = roundApi;
