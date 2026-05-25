import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
	createEvent,
	deleteEvent,
	deleteEventsByDivisionId,
	deleteEventsBySeasonId,
	getEventById,
	getEventsByDivisionId,
	getEventsBySeasonId,
	updateEvent,
} from "@/services/event/event.service";
import type {
	CreateEventPayload,
	CreateEventResponse,
	DeleteEventResponse,
	GetEventByIdResponse,
	GetEventsResponse,
	EventTable,
	UpdateEventPayload,
	UpdateEventResponse,
} from "@/types/event.types";

type DeleteEventMutationPayload = {
	eventId: string;
	divisionId?: string;
};

export const eventApi = createApi({
	reducerPath: "eventApi",
	baseQuery: fakeBaseQuery(),
	tagTypes: ["Events"],
	endpoints: (builder) => ({
		getEventById: builder.query<EventTable, string>({
			queryFn: async (eventId) => {
				try {
					const result: GetEventByIdResponse = await getEventById(eventId);

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
			providesTags: (_result, _error, eventId) => [
				{ type: "Events", id: eventId },
			],
		}),
		getEventsByDivisionId: builder.query<EventTable[], string>({
			queryFn: async (divisionId) => {
				try {
					const result: GetEventsResponse =
						await getEventsByDivisionId(divisionId);

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
				{ type: "Events", id: `division-${divisionId}` },
				...(result?.map((event) => ({
					type: "Events" as const,
					id: event.id,
				})) ?? []),
			],
		}),
    getEventsBySeasonId: builder.query<EventTable[], string>({
      queryFn: async (seasonId) => {
        try {
          const result: GetEventsResponse =
            await getEventsBySeasonId(seasonId);

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
        { type: "Events", id: `season-${seasonId}` },
        ...(result?.map((event) => ({
          type: "Events" as const,
          id: event.id,
        })) ?? []),
      ],
    }),
		createEvent: builder.mutation<EventTable, CreateEventPayload>({
			queryFn: async (payload) => {
				try {
					const result: CreateEventResponse = await createEvent(payload);

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
				{ type: "Events", id: `division-${payload.divisionId}` },
				...(result ? [{ type: "Events" as const, id: result.id }] : []),
			],
		}),
		updateEvent: builder.mutation<EventTable, UpdateEventPayload>({
			queryFn: async (payload) => {
				try {
					const result: UpdateEventResponse = await updateEvent(payload);

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
						type: "Events" as const,
						id: `division-${divisionId}`,
					}));

				return [
					{ type: "Events", id: payload.eventId },
					...divisionTags,
				];
			},
		}),
		deleteEvent: builder.mutation<boolean, DeleteEventMutationPayload>({
			queryFn: async ({ eventId }) => {
				try {
					const result: DeleteEventResponse = await deleteEvent(eventId);

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
			invalidatesTags: (_result, _error, { eventId, divisionId }) => [
				{ type: "Events", id: eventId },
				...(divisionId
					? [{ type: "Events" as const, id: `division-${divisionId}` }]
					: ["Events" as const]),
			],
		}),
		deleteEventsByDivisionId: builder.mutation<boolean, string>({
			queryFn: async (divisionId) => {
				try {
					const result: DeleteEventResponse =
						await deleteEventsByDivisionId(divisionId);

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
				{ type: "Events", id: `division-${divisionId}` },
			],
		}),
    deleteEventsBySeasonId: builder.mutation<boolean, string>({
      queryFn: async (seasonId) => {
        try {
          const result: DeleteEventResponse =
            await deleteEventsBySeasonId(seasonId);

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
        { type: "Events", id: `season-${seasonId}` },
      ],
    }),
	}),
});

export const {
	useGetEventByIdQuery,
	useGetEventsByDivisionIdQuery,
  useGetEventsBySeasonIdQuery,
	useCreateEventMutation,
	useUpdateEventMutation,
	useDeleteEventMutation,
	useDeleteEventsByDivisionIdMutation,
	useDeleteEventsBySeasonIdMutation,
} = eventApi;
