import { supabase } from "@/lib/supabase";
import type { CreateEventPayload, CreateEventResponse, DeleteEventResponse, EventTable, GetEventByIdResponse, GetEventsResponse, UpdateEventPayload, UpdateEventResponse } from "@/types/event.types";

// -- Event Service -- //

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

// Delete an event by its ID
export const deleteEvent = async (eventId: string): Promise<DeleteEventResponse> => {
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

// Delete all events associated with a specific round
export const deleteEventsByRoundId = async (roundId: string): Promise<DeleteEventResponse> => {
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