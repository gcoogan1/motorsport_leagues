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
	getAllCarDetailsByEventId,
	getTrackDetailsByEventId,
	createEventCarDetails,
	createEventTrackDetails,
	updateEventCarDetails,
	updateEventTrackDetails,
	deleteEventTrackDetailsByEventId,
	deleteEventCarDetailsByEventId,
	getEventSessionSettingsByEventId,
	createEventSessionSettings,
	updateEventSessionSettings,
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
	EventCarDetailsTable,
	EventTrackDetailsTable,
	GetEventCarDetailsByEventIdResponse,
	GetEventTrackDetailsByEventIdResponse,
	CreateEventCarDetailsResponse,
	CreateEventTrackDetailsResponse,
	UpdateEventCarDetailsResponse,
	UpdateEventTrackDetailsResponse,
	DeleteEventCarDetailsResponse,
	DeleteEventTrackDetailsResponse,
	JoinedEventTable,
	GetEventSessionSettingsByEventIdResponse,
	EventSessionSettingsTable,
	CreateEventSessionSettingsResponse,
	CreateEventSessionSettingsPayload,
	UpdateEventSessionSettingsPayload,
	UpdateEventSessionSettingsResponse,
} from "@/types/event.types";
import type { CarCategory } from "@/types/cars.types";

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
		getEventById: builder.query<JoinedEventTable, string>({
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
    getEventsBySeasonId: builder.query<JoinedEventTable[], string>({
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
		getEventTrackDetailsByEventId: builder.query<EventTrackDetailsTable, string>({
			queryFn: async (eventId) => {
				try {
					const result: GetEventTrackDetailsByEventIdResponse =
						await getTrackDetailsByEventId(eventId);

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
				{ type: "Events", id: `track-details-${eventId}` },
			],
		}),
		getEventCarDetailsByEventId: builder.query<EventCarDetailsTable[], string>({
			queryFn: async (eventId) => {
				try {
					const result: GetEventCarDetailsByEventIdResponse =
						await getAllCarDetailsByEventId(eventId);

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
				{ type: "Events", id: `car-details-${eventId}` },
			],
		}),
		getEventSessionSettingsByEventId: builder.query<EventSessionSettingsTable, string>({
			queryFn: async (eventId) => {
				try {
					const result: GetEventSessionSettingsByEventIdResponse =
						await getEventSessionSettingsByEventId(eventId);

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
				{ type: "Events", id: `session-settings-${eventId}` },
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
		createEventTrackDetails: builder.mutation<EventTrackDetailsTable, { eventId: string; trackName: string; revealTrack?: boolean }>({
			queryFn: async ({ eventId, trackName, revealTrack }) => {
				try {
					const result: CreateEventTrackDetailsResponse =
						await createEventTrackDetails({
							eventId,
							trackName,
							revealTrack,
						});

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
			invalidatesTags: (_result, _error, { eventId }) => [
				{ type: "Events", id: `track-details-${eventId}` },
				{ type: "Events", id: eventId },
			],
		}),
		createEventCarDetails: builder.mutation<EventCarDetailsTable, { eventId: string; carId: string; carSelection: "Specified" | "Category" | "Assigned"; carCategory: CarCategory; carName: string; carImageUrl: string; revealCarDetails: boolean }>({
			queryFn: async ({ eventId, carId, carSelection, carCategory, carName, carImageUrl, revealCarDetails }) => {
				try {
					const result: CreateEventCarDetailsResponse =
						await createEventCarDetails({
							eventId,
							carId,
							carSelection,
							carCategory,
							carName,
							carImageUrl,
							revealCarDetails,
						});

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
			invalidatesTags: (_result, _error, { eventId }) => [
				{ type: "Events", id: `car-details-${eventId}` },
				{ type: "Events", id: eventId },
			],
		}),
		createEventSessionSettings: builder.mutation<EventSessionSettingsTable, CreateEventSessionSettingsPayload>({
			queryFn: async (payload) => {
				try {
					const result: CreateEventSessionSettingsResponse = await createEventSessionSettings(payload);

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
			invalidatesTags: (_result, _error, { eventId }) => [
				{ type: "Events", id: `session-settings-${eventId}` },
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
		updateEventTrackDetails: builder.mutation<EventTrackDetailsTable, { eventId: string; trackName: string; revealTrack?: boolean }>({
			queryFn: async ({ eventId, trackName, revealTrack }) => {
				try {
					const result: UpdateEventTrackDetailsResponse =
						await updateEventTrackDetails({
							eventId,
							trackName,
							revealTrack,
						});

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
			invalidatesTags: (_result, _error, { eventId }) => [
				{ type: "Events", id: `track-details-${eventId}` },
				{ type: "Events", id: eventId },
			],
		}),
		updateEventCarDetails: builder.mutation<EventCarDetailsTable, { eventId: string; carId: string; carSelection: "Specified" | "Category" | "Assigned"; carCategory: CarCategory; carName: string; carImageUrl: string; revealCarDetails: boolean }>({
			queryFn: async ({ eventId, carId, carSelection, carCategory, carName, carImageUrl, revealCarDetails }) => {
				try {
					const result: UpdateEventCarDetailsResponse = await updateEventCarDetails({
						eventId,
						carId,
						carSelection,
						carCategory,
						carName,
						carImageUrl,
						revealCarDetails,
					});

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
			invalidatesTags: (_result, _error, { eventId }) => [
				{ type: "Events", id: `car-details-${eventId}` },
				{ type: "Events", id: eventId },
			],
		}),
		updateEventSessionSettings: builder.mutation<EventSessionSettingsTable, UpdateEventSessionSettingsPayload>({
			queryFn: async (payload) => {
				try {
					const result: UpdateEventSessionSettingsResponse = await updateEventSessionSettings(payload);

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
			invalidatesTags: (_result, _error, { eventId }) => [
				{ type: "Events", id: `session-settings-${eventId}` },
			],
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
		deleteEventTracksByEventId: builder.mutation<boolean, string>({
			queryFn: async (eventId) => {
				try {
					const result: DeleteEventTrackDetailsResponse =
						await deleteEventTrackDetailsByEventId(eventId);

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
				{ type: "Events", id: `track-details-${eventId}` },
				{ type: "Events", id: eventId },
			],
		}),
		deleteEventCarsByEventId: builder.mutation<boolean, string>({
			queryFn: async (eventId) => {
				try {
					const result: DeleteEventCarDetailsResponse =
						await deleteEventCarDetailsByEventId(eventId);

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
				{ type: "Events", id: `car-details-${eventId}` },
				{ type: "Events", id: eventId },
			],
		}),
		deleteEventSessionSettingsByEventId: builder.mutation<boolean, string>({
			queryFn: async (eventId) => {
				try {
					const result: DeleteEventTrackDetailsResponse =
						await deleteEventTrackDetailsByEventId(eventId);

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
				{ type: "Events", id: `session-settings-${eventId}` },
				{ type: "Events", id: eventId },
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
	useGetEventTrackDetailsByEventIdQuery,
	useGetEventCarDetailsByEventIdQuery,
	useGetEventSessionSettingsByEventIdQuery,
	useCreateEventMutation,
	useCreateEventDriverMutation,
	useCreateEventTrackDetailsMutation,
	useCreateEventCarDetailsMutation,
	useCreateEventSessionSettingsMutation,
	useUpdateEventMutation,
	useUpdateEventTrackDetailsMutation,
	useUpdateEventCarDetailsMutation,
	useUpdateEventSessionSettingsMutation,
	useDeleteEventMutation,
	useDeleteEventDriverMutation,
	useDeleteEventDriversByEventIdMutation,
	useDeleteEventsByRoundIdMutation,
	useDeleteEventsByDivisionIdMutation,
	useDeleteEventsBySeasonIdMutation,
	useDeleteEventTracksByEventIdMutation,
	useDeleteEventCarsByEventIdMutation,
	useDeleteEventSessionSettingsByEventIdMutation,
} = eventApi;
