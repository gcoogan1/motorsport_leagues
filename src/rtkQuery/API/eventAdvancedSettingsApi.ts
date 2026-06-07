import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  createEventAdvancedSettings,
  deleteEventAdvancedSettings,
  getEventAdvancedSettings,
  updateEventAdvancedSettings,
} from "@/services/event/eventAdvancedSettings";
import type {
  CreateEventAdvancedSettingsPayload,
  DeleteEventAdvancedSettingsPayload,
  DeleteEventAdvancedSettingsResponse,
  EventAdvancedSettingsTable,
  GetEventAdvancedSettingsResponse,
  UpdateEventAdvancedSettingsPayload,
} from "@/types/eventAdvancedSettings";

export const eventAdvancedSettingsApi = createApi({
  reducerPath: "eventAdvancedSettingsApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["EventsAdvancedSettings"],
  endpoints: (builder) => ({
    getEventAdvancedSettings: builder.query<EventAdvancedSettingsTable, string>(
      {
        queryFn: async (eventId) => {
          try {
            const result: GetEventAdvancedSettingsResponse =
              await getEventAdvancedSettings(eventId);

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
          { type: "EventsAdvancedSettings", id: eventId },
        ],
      },
    ),
    createEventAdvancedSettings: builder.mutation<
      EventAdvancedSettingsTable,
      { payload: CreateEventAdvancedSettingsPayload }
    >({
      queryFn: async ({ payload }) => {
        try {
          const result = await createEventAdvancedSettings(payload);
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
      invalidatesTags: (_result, _error, _arg) => [
        { type: "EventsAdvancedSettings", id: _arg.payload.eventId },
      ],
    }),
    updateEventAdvancedSettings: builder.mutation<
      EventAdvancedSettingsTable,
      { payload: UpdateEventAdvancedSettingsPayload }
    >({
      queryFn: async ({ payload }) => {
        try {
          const result = await updateEventAdvancedSettings(payload);

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
      invalidatesTags: (_result, _error, _arg) => [
        { type: "EventsAdvancedSettings", id: _arg.payload.eventId },
      ],
    }),
    deleteEventAdvancedSettings: builder.mutation<
      boolean,
      DeleteEventAdvancedSettingsPayload
    >({
      queryFn: async ({ eventId }) => {
        try {
          const result: DeleteEventAdvancedSettingsResponse =
            await deleteEventAdvancedSettings(eventId);

          if (!result.success) {
            return {
              error: {
                status: 500,
                data: { message: "Failed to delete event advanced settings" },
              },
            };
          }

          return { data: true };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: (_result, _error, { eventId }) => [
        { type: "EventsAdvancedSettings", id: eventId },
      ],
    }),
  }),
});

export const {
  useGetEventAdvancedSettingsQuery,
  useCreateEventAdvancedSettingsMutation,
  useUpdateEventAdvancedSettingsMutation,
  useDeleteEventAdvancedSettingsMutation,
} = eventAdvancedSettingsApi;
