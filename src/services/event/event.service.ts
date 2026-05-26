import { supabase } from "@/lib/supabase";
import type {
  CreateEventDriverPayload,
  CreateEventDriverResponse,
  CreateEventPayload,
  CreateEventResponse,
  DeleteEventDriverResponse,
  DeleteEventResponse,
  EventDriverTable,
  EventIdsLookupResponse,
  EventTable,
  GetEventByIdResponse,
  GetEventDriversResponse,
  GetEventsResponse,
  UpdateEventPayload,
  UpdateEventResponse,
} from "@/types/event.types";


// -- Event Service -- //

// -- GET -- //

// Get an event IDS by a specific column and value (HELPER)
const getEventIdsByColumn = async (
  column: "round_id" | "division_id" | "season_id",
  value: string,
): Promise<EventIdsLookupResponse> => {
  const { data, error } = await supabase
    .from("event")
    .select("id")
    .eq(column, value);

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        status: 500,
      },
    };
  }

  return {
    success: true,
    data: (data ?? []).map((event) => event.id as string),
  };
};

// Get an event by its ID
export const getEventById = async (eventId: string): Promise<GetEventByIdResponse> => {
  const { data, error } = await supabase
    .from("event")
    .select("*")
    .eq("id", eventId)
    .single();

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        status: 500,
      },
    };
  }

  return {
    success: true,
    data: data,
  };
};

// Get all events for a specific round
export const getEventsByRoundId = async (roundId: string): Promise<GetEventsResponse> => {
  const { data, error } = await supabase
    .from("event")
    .select("*")
    .eq("round_id", roundId);

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        status: 500,
      },
    };
  }

  return {
    success: true,
    data: data,
  };
};

// Get all events for a specific division
export const getEventsByDivisionId = async (divisionId: string): Promise<GetEventsResponse> => {
  const { data, error } = await supabase
    .from("event")
    .select("*")
    .eq("division_id", divisionId);

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        status: 500,
      },
    };
  }

  return {
    success: true,
    data: data,
  };
};

// Get all events for a specific season
export const getEventsBySeasonId = async (seasonId: string): Promise<GetEventsResponse> => {
  const { data, error } = await supabase
    .from("event")
    .select("*")
    .eq("season_id", seasonId);

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        status: 500,
      },
    };
  }

  return {
    success: true,
    data: data,
  };
};

// Get all event drivers for a specific event
export const getEventDriversByEventId = async (eventId: string): Promise<GetEventDriversResponse> => {
  const { data, error } = await supabase
    .from("event_driver")
    .select("*")
    .eq("event_id", eventId);

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        status: 500,
      },
    };
  }

  return {
    success: true,
    data: (data ?? []) as EventDriverTable[],
  };
};

// Get all event drivers for events within a specific division
export const getEventDriversByDivisionId = async (divisionId: string): Promise<GetEventDriversResponse> => {
  const eventIdsResult = await getEventIdsByColumn("division_id", divisionId);

  if (!eventIdsResult.success) {
    return eventIdsResult;
  }

  if (eventIdsResult.data.length === 0) {
    return {
      success: true,
      data: [],
    };
  }

  const { data, error } = await supabase
    .from("event_driver")
    .select("*")
    .in("event_id", eventIdsResult.data);

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        status: 500,
      },
    };
  }

  return {
    success: true,
    data: (data ?? []) as EventDriverTable[],
  };
};

// -- CREATE -- //

// Create a new event
export const createEvent = async ({
  eventName,
  eventDate,
  roundId,
  divisionId,
  seasonId,
}: CreateEventPayload): Promise<CreateEventResponse> => {
  const { data, error } = await supabase.from("event").insert([
    {
      event_name: eventName,
      event_date: eventDate,
      round_id: roundId,
      division_id: divisionId,
      season_id: seasonId,
    },
  ])
    .select()
    .single();

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        status: 500,
      },
    };
  }

  return {
    success: true,
    data: data as EventTable,
  };
}

// Create a new event driver
export const createEventDriver = async ({
  eventId,
  seasonDriverId,
}: CreateEventDriverPayload): Promise<CreateEventDriverResponse> => {
  const { data, error } = await supabase
    .from("event_driver")
    .insert([
      {
        event_id: eventId,
        season_driver_id: seasonDriverId,
      },
    ])
    .select()
    .single();

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        status: 500,
      },
    };
  }

  return {
    success: true,
    data: data as EventDriverTable,
  };
};

// -- UPDATE -- //

// Update an existing event
export const updateEvent = async ({
  eventId,
  eventName,
  eventDate,
  broadcastLink,
}: UpdateEventPayload): Promise<UpdateEventResponse> => {
  const { data, error } = await supabase
    .from("event")
    .update({
      ...(eventName && { event_name: eventName }),
      ...(eventDate && { event_date: eventDate }),
      ...(broadcastLink && { broadcast_link: broadcastLink }),
    })
    .eq("id", eventId)
    .select()
    .single();

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        status: 500,
      },
    };
  }

  return {
    success: true,
    data: data as EventTable,
  };
}

// -- DELETE -- //

// Delete event drivers by their associated event IDs (HELPER)
const deleteEventDriverRowsByEventIds = async (
  eventIds: string[],
): Promise<DeleteEventDriverResponse> => {
  if (eventIds.length === 0) {
    return { success: true };
  }

  const { error } = await supabase
    .from("event_driver")
    .delete()
    .in("event_id", eventIds);

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        status: 500,
      },
    };
  }

  return { success: true };
};

// Delete an event by its ID
export const deleteEvent = async (eventId: string): Promise<DeleteEventResponse> => {
  const deleteEventDriversResult = await deleteEventDriverRowsByEventIds([eventId]);

  if (!deleteEventDriversResult.success) {
    return deleteEventDriversResult;
  }

  const { error } = await supabase.from("event").delete().eq("id", eventId);

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        status: 500,
      },
    };
  }

  return {
    success: true,
  };
};

// Delete an event driver by its driver ID
export const deleteEventDriver = async (eventDriverId: string): Promise<DeleteEventDriverResponse> => {
  const { error } = await supabase
    .from("event_driver")
    .delete()
    .eq("id", eventDriverId);

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        status: 500,
      },
    };
  }

  return {
    success: true,
  };
};

// Delete all event drivers associated with a specific event
export const deleteEventDriversByEventId = async (eventId: string): Promise<DeleteEventDriverResponse> => {
  return deleteEventDriverRowsByEventIds([eventId]);
};

// Delete all events associated with a specific round
export const deleteEventsByRoundId = async (roundId: string): Promise<DeleteEventResponse> => {
  const eventIdsResult = await getEventIdsByColumn("round_id", roundId);

  if (!eventIdsResult.success) {
    return eventIdsResult;
  }

  const deleteEventDriversResult = await deleteEventDriverRowsByEventIds(eventIdsResult.data);

  if (!deleteEventDriversResult.success) {
    return deleteEventDriversResult;
  }

  const { error } = await supabase.from("event").delete().eq("round_id", roundId);

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        status: 500,
      },
    };
  }

  return {
    success: true,
  };
};

// Delete all events associated with a specific division
export const deleteEventsByDivisionId = async (divisionId: string): Promise<DeleteEventResponse> => {
  const eventIdsResult = await getEventIdsByColumn("division_id", divisionId);

  if (!eventIdsResult.success) {
    return eventIdsResult;
  }

  const deleteEventDriversResult = await deleteEventDriverRowsByEventIds(eventIdsResult.data);

  if (!deleteEventDriversResult.success) {
    return deleteEventDriversResult;
  }

  const { error } = await supabase.from("event").delete().eq("division_id", divisionId);

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        status: 500,
      },
    };
  }

  return {
    success: true,
  };
};

// Delete all events associated with a specific season
export const deleteEventsBySeasonId = async (seasonId: string): Promise<DeleteEventResponse> => {
  const eventIdsResult = await getEventIdsByColumn("season_id", seasonId);

  if (!eventIdsResult.success) {
    return eventIdsResult;
  }

  const deleteEventDriversResult = await deleteEventDriverRowsByEventIds(eventIdsResult.data);

  if (!deleteEventDriversResult.success) {
    return deleteEventDriversResult;
  }

  const { error } = await supabase.from("event").delete().eq("season_id", seasonId);

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        status: 500,
      },
    };
  }

  return {
    success: true,
  };
};