import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
	createEvent,
	createEventDriver,
	deleteEvent,
	deleteEventDriver,
	deleteEventDriversByEventId,
	deleteEventsByRoundId,
	deleteEventsByDivisionId,
	deleteEventsBySeasonId,
	getEventById,
	getEventDriversByDivisionId,
	getEventDriversByEventId,
	getEventsByDivisionId,
	getEventsBySeasonId,
	updateEvent,
} from "@/services/event/event.service";
import type {
	CreateEventDriverPayload,
	CreateEventDriverResponse,
	CreateEventPayload,
	CreateEventResponse,
	DeleteEventDriverResponse,
	DeleteEventResponse,
	EventDriverTable,
	GetEventByIdResponse,
	GetEventDriversResponse,
	GetEventsResponse,
	EventTable,
	UpdateEventPayload,
	UpdateEventResponse,
} from "@/types/event.types";

type DeleteEventMutationPayload = {
	eventId: string;
	divisionId?: string;
};

type DeleteEventDriverMutationPayload = {
	eventDriverId: string;
	eventId?: string;
};

export const eventApi = createApi({
	reducerPath: "eventApi",
	baseQuery: fakeBaseQuery(),
	tagTypes: ["Events", "EventDrivers"],
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
		getEventDriversByEventId: builder.query<EventDriverTable[], string>({
			queryFn: async (eventId) => {
				try {
					const result: GetEventDriversResponse = await getEventDriversByEventId(eventId);

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
			providesTags: (result, _error, eventId) => [
				{ type: "EventDrivers", id: `event-${eventId}` },
				...(result?.map((eventDriver) => ({
					type: "EventDrivers" as const,
					id: eventDriver.id,
				})) ?? []),
			],
		}),
		getEventDriversByDivisionId: builder.query<EventDriverTable[], string>({
			queryFn: async (divisionId) => {
				try {
					const result: GetEventDriversResponse = await getEventDriversByDivisionId(divisionId);

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
				{ type: "EventDrivers", id: `division-${divisionId}` },
				...(result?.map((eventDriver) => ({
					type: "EventDrivers" as const,
					id: eventDriver.id,
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
		createEventDriver: builder.mutation<EventDriverTable, CreateEventDriverPayload>({
			queryFn: async (payload) => {
				try {
					const result: CreateEventDriverResponse = await createEventDriver(payload);

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
				{ type: "EventDrivers", id: `event-${payload.eventId}` },
				"EventDrivers" as const,
				...(result ? [{ type: "EventDrivers" as const, id: result.id }] : []),
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
				{ type: "EventDrivers", id: `event-${eventId}` },
				"EventDrivers" as const,
				...(divisionId
					? [{ type: "Events" as const, id: `division-${divisionId}` }]
					: ["Events" as const]),
			],
		}),
		deleteEventDriver: builder.mutation<boolean, DeleteEventDriverMutationPayload>({
			queryFn: async ({ eventDriverId }) => {
				try {
					const result: DeleteEventDriverResponse = await deleteEventDriver(eventDriverId);

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
			invalidatesTags: (_result, _error, { eventDriverId, eventId }) => [
				{ type: "EventDrivers", id: eventDriverId },
				"EventDrivers" as const,
				...(eventId
					? [{ type: "EventDrivers" as const, id: `event-${eventId}` }]
					: ["EventDrivers" as const]),
			],
		}),
		deleteEventDriversByEventId: builder.mutation<boolean, string>({
			queryFn: async (eventId) => {
				try {
					const result: DeleteEventDriverResponse = await deleteEventDriversByEventId(eventId);

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
			invalidatesTags: (_result, _error, eventId) => [
				{ type: "EventDrivers", id: `event-${eventId}` },
				"EventDrivers" as const,
			],
		}),
		deleteEventsByRoundId: builder.mutation<boolean, string>({
			queryFn: async (roundId) => {
				try {
					const result: DeleteEventResponse =
						await deleteEventsByRoundId(roundId);

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
			invalidatesTags: () => ["Events" as const, "EventDrivers" as const],
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
				"EventDrivers" as const,
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
        "EventDrivers" as const,
      ],
    }),
	}),
});

export const {
	useGetEventByIdQuery,
	useGetEventDriversByDivisionIdQuery,
	useGetEventsByDivisionIdQuery,
  useGetEventDriversByEventIdQuery,
  useGetEventsBySeasonIdQuery,
	useCreateEventMutation,
	useCreateEventDriverMutation,
	useUpdateEventMutation,
	useDeleteEventMutation,
	useDeleteEventDriverMutation,
	useDeleteEventDriversByEventIdMutation,
	useDeleteEventsByRoundIdMutation,
	useDeleteEventsByDivisionIdMutation,
	useDeleteEventsBySeasonIdMutation,
} = eventApi;
