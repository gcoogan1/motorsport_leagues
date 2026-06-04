import { supabase } from "@/lib/supabase";
import type {
  CreateEventCarDetailsPayload,
  CreateEventCarDetailsResponse,
  CreateEventDriverPayload,
  CreateEventDriverResponse,
  CreateEventPayload,
  CreateEventResponse,
  CreateEventSessionSettingsPayload,
  CreateEventSessionSettingsResponse,
  CreateEventTrackDetailsPayload,
  CreateEventTrackDetailsResponse,
  DeleteEventCarDetailsResponse,
  DeleteEventDriverResponse,
  DeleteEventResponse,
  DeleteEventSessionSettingsResponse,
  DeleteEventTrackDetailsResponse,
  EventCarDetailsTable,
  EventDriverTable,
  EventIdsLookupResponse,
  EventSessionSettingsTable,
  EventTable,
  EventTrackDetailsTable,
  GetEventByIdResponse,
  GetEventCarDetailsByEventIdResponse,
  GetEventDriversResponse,
  GetEventSessionSettingsByEventIdResponse,
  GetEventsResponse,
  GetEventTrackDetailsByEventIdResponse,
  UpdateEventCarDetailsPayload,
  UpdateEventCarDetailsResponse,
  UpdateEventPayload,
  UpdateEventResponse,
  UpdateEventSessionSettingsPayload,
  UpdateEventSessionSettingsResponse,
  UpdateEventTrackDetailsPayload,
  UpdateEventTrackDetailsResponse,
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
export const getEventById = async (
  eventId: string,
): Promise<GetEventByIdResponse> => {
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
export const getEventsByRoundId = async (
  roundId: string,
): Promise<GetEventsResponse> => {
  const { data, error } = await supabase
    .from("event")
    .select(`
      *,
      event_track_details(*),
      event_car_details(*),
      event_driver(*),
      event_session_settings(*)
    `)
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
export const getEventsByDivisionId = async (
  divisionId: string,
): Promise<GetEventsResponse> => {
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
export const getEventsBySeasonId = async (
  seasonId: string,
): Promise<GetEventsResponse> => {
  const { data, error } = await supabase
    .from("event")
    .select(`
      *,
      event_track_details(*),
      event_car_details(*),
      event_driver(*),
      event_session_settings(*)
    `)
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
export const getEventDriversByEventId = async (
  eventId: string,
): Promise<GetEventDriversResponse> => {
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
export const getEventDriversByDivisionId = async (
  divisionId: string,
): Promise<GetEventDriversResponse> => {
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

// Get Track Details for an event by its ID
export const getTrackDetailsByEventId = async (
  eventId: string,
): Promise<GetEventTrackDetailsByEventIdResponse> => {
  const { data, error } = await supabase
    .from("event_track_details")
    .select("*")
    .eq("event_id", eventId)
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

// Get ALL Car Details for an event by its ID (returns an array of cars for the event, as some events may have multiple cars revealed)
export const getAllCarDetailsByEventId = async (
  eventId: string,
): Promise<GetEventCarDetailsByEventIdResponse> => {
  const { data, error } = await supabase
    .from("event_car_details")
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
    data: (data ?? []) as EventCarDetailsTable[],
  };
};

export const getEventSessionSettingsByEventId = async (eventId: string): Promise<GetEventSessionSettingsByEventIdResponse> => {
  const { data, error } = await supabase
    .from("event_session_settings")
    .select("*")
    .eq("event_id", eventId)
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
    data: data as EventSessionSettingsTable,
  };
};

// -- CREATE -- //

// Create a new event
export const createEvent = async ({
  eventName,
  eventDate,
  eventTimeZone,
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
      event_time_zone: eventTimeZone,
      reveal_date: true,
      reveal_broadcast: true,
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
};

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

// Create Track Details for an event
export const createEventTrackDetails = async ({
  eventId,
  trackName,
  revealTrack,
}: CreateEventTrackDetailsPayload): Promise<
  CreateEventTrackDetailsResponse
> => {
  const { data, error } = await supabase
    .from("event_track_details")
    .insert([
      {
        event_id: eventId,
        track_name: trackName,
        reveal_track: revealTrack,
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
    data: data as EventTrackDetailsTable,
  };
};

// Create Car Details for an event
export const createEventCarDetails = async ({
  eventId,
  carId,
  carSelection,
  carCategory,
  carName,
  carImageUrl,
  revealCarDetails,
}: CreateEventCarDetailsPayload): Promise<CreateEventCarDetailsResponse> => {
  const { data, error } = await supabase
    .from("event_car_details")
    .insert([
      {
        event_id: eventId,
        car_id: carId,
        car_selection: carSelection,
        car_category: carCategory,
        car_name: carName,
        car_image_url: carImageUrl,
        reveal_car: revealCarDetails,
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
    data: data as EventCarDetailsTable,
  };
};

// Create Session Settings for an event
export const createEventSessionSettings = async ({
  eventId,
  revealSession,
  hasQualifying,
  qualifyingType,
  qualifyingTime,
  qualifyingLaps,
  hasRace,
  raceType,
  raceTime,
  raceLaps,
}: CreateEventSessionSettingsPayload): Promise<CreateEventSessionSettingsResponse> => {
  const { data, error } = await supabase
    .from("event_session_settings")
    .insert([
      {
        event_id: eventId,
        reveal_session: revealSession,
        has_qualifying: hasQualifying,
        qualifying_type: qualifyingType,
        qualifying_time: qualifyingTime,
        qualifying_laps: qualifyingLaps,
        has_race: hasRace,
        race_type: raceType,
        race_time: raceTime,
        race_laps: raceLaps,
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
    data: data as EventSessionSettingsTable,
  };
};

// -- UPDATE -- //

// Update an existing event
export const updateEvent = async ({
  eventId,
  eventName,
  eventDate,
  eventTimeZone,
  broadcastUrl,
  revealDate,
  revealBroadcast,
}: UpdateEventPayload): Promise<UpdateEventResponse> => {
  const updateData: Record<string, unknown> = {};

  if (eventName !== undefined) {
    updateData.event_name = eventName;
  }

  if (eventDate !== undefined) {
    updateData.event_date = eventDate;
  }

  if (eventTimeZone !== undefined) {
    updateData.event_time_zone = eventTimeZone;
  }

  if (broadcastUrl !== undefined) {
    updateData.broadcast_url = broadcastUrl;
  }

  if (revealDate !== undefined) {
    updateData.reveal_date = revealDate;
  }

  if (revealBroadcast !== undefined) {
    updateData.reveal_broadcast = revealBroadcast;
  }

  const { data, error } = await supabase
    .from("event")
    .update(updateData)
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
};

// Update Track Details for an event
export const updateEventTrackDetails = async ({
  eventId,
  trackName,
  revealTrack,
}: UpdateEventTrackDetailsPayload): Promise<
  UpdateEventTrackDetailsResponse
> => {
  const updateData: Record<string, unknown> = {};

  if (trackName !== undefined) {
    updateData.track_name = trackName;
  }

  if (revealTrack !== undefined) {
    updateData.reveal_track = revealTrack;
  }

  const { data, error } = await supabase
    .from("event_track_details")
    .update(updateData)
    .eq("event_id", eventId)
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
    data: data as EventTrackDetailsTable,
  };
};

// Update Car Details for an event
export const updateEventCarDetails = async ({
  eventId,
  carId,
  carSelection,
  carCategory,
  carName,
  carImageUrl,
  revealCarDetails,
}: UpdateEventCarDetailsPayload): Promise<UpdateEventCarDetailsResponse> => {
  const updateData: Record<string, unknown> = {};

  if (carSelection !== undefined) {
    updateData.car_selection = carSelection;
  }

  if (carId !== undefined) {
    updateData.car_id = carId;
  }

  if (carCategory !== undefined) {
    updateData.car_category = carCategory;
  }

  if (carName !== undefined) {
    updateData.car_name = carName;
  }

  if (carImageUrl !== undefined) {
    updateData.car_image_url = carImageUrl;
  }

  if (revealCarDetails !== undefined) {
    updateData.reveal_car = revealCarDetails;
  }

  const { data, error } = await supabase
    .from("event_car_details")
    .update(updateData)
    .eq("event_id", eventId)
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
    data: data as EventCarDetailsTable,
  };
};

// Update Session Settings for an event
export const updateEventSessionSettings = async ({
  eventId,
  revealSession,
  hasQualifying,
  qualifyingType,
  qualifyingTime,
  qualifyingLaps,
  hasRace,
  raceType,
  raceTime,
  raceLaps,
}: UpdateEventSessionSettingsPayload): Promise<UpdateEventSessionSettingsResponse> => {
  const updateData: Record<string, unknown> = {};

  if (revealSession !== undefined) {
    updateData.reveal_session = revealSession;
  }

  if (hasQualifying !== undefined) {
    updateData.has_qualifying = hasQualifying;
  }

  if (qualifyingType !== undefined) {
    updateData.qualifying_type = qualifyingType;
  }

  if (qualifyingTime !== undefined) {
    updateData.qualifying_time = qualifyingTime;
  }

  if (qualifyingLaps !== undefined) {
    updateData.qualifying_laps = qualifyingLaps;
  }

  if (hasRace !== undefined) {
    updateData.has_race = hasRace;
  }

  if (raceType !== undefined) {
    updateData.race_type = raceType;
  }

  if (raceTime !== undefined) {
    updateData.race_time = raceTime;
  }

  if (raceLaps !== undefined) {
    updateData.race_laps = raceLaps;
  }

  const { data, error } = await supabase
    .from("event_session_settings")
    .update(updateData)
    .eq("event_id", eventId)
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
    data: data as EventSessionSettingsTable,
  };
};

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
export const deleteEvent = async (
  eventId: string,
): Promise<DeleteEventResponse> => {
  const deleteEventDriversResult = await deleteEventDriverRowsByEventIds([
    eventId,
  ]);

  if (!deleteEventDriversResult.success) {
    return deleteEventDriversResult;
  }

  const deleteTrackDetailsResult = await deleteEventTrackDetailsByEventId(
    eventId,
  );

  if (!deleteTrackDetailsResult.success) {
    return deleteTrackDetailsResult;
  }

  const deleteCarDetailsResult = await deleteEventCarDetailsByEventId(
    eventId,
  );

  if (!deleteCarDetailsResult.success) {
    return deleteCarDetailsResult;
  }

  const deleteSessionSettingsResult = await deleteEventSessionSettingsByEventId(
    eventId,
  );

  if (!deleteSessionSettingsResult.success) {
    return deleteSessionSettingsResult;
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
export const deleteEventDriver = async (
  eventDriverId: string,
): Promise<DeleteEventDriverResponse> => {
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
export const deleteEventDriversByEventId = async (
  eventId: string,
): Promise<DeleteEventDriverResponse> => {
  return deleteEventDriverRowsByEventIds([eventId]);
};

// Delete all events associated with a specific round
export const deleteEventsByRoundId = async (
  roundId: string,
): Promise<DeleteEventResponse> => {
  const eventIdsResult = await getEventIdsByColumn("round_id", roundId);

  if (!eventIdsResult.success) {
    return eventIdsResult;
  }

  const deleteEventDriversResult = await deleteEventDriverRowsByEventIds(
    eventIdsResult.data,
  );

  if (!deleteEventDriversResult.success) {
    return deleteEventDriversResult;
  }

  const deleteTrackDetailsResult = await deleteEventTrackDetailsByEventId(
    eventIdsResult.data[0],
  );

  if (!deleteTrackDetailsResult.success) {
    return deleteTrackDetailsResult;
  }

  const deleteCarDetailsResult = await deleteEventCarDetailsByEventId(
    eventIdsResult.data[0],
  );

  if (!deleteCarDetailsResult.success) {
    return deleteCarDetailsResult;
  }

  const deleteSessionSettingsResult = await deleteEventSessionSettingsByEventId(
    eventIdsResult.data[0],
  );

  if (!deleteSessionSettingsResult.success) {
    return deleteSessionSettingsResult;
  }

  const { error } = await supabase.from("event").delete().eq(
    "round_id",
    roundId,
  );

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
export const deleteEventsByDivisionId = async (
  divisionId: string,
): Promise<DeleteEventResponse> => {
  const eventIdsResult = await getEventIdsByColumn("division_id", divisionId);

  if (!eventIdsResult.success) {
    return eventIdsResult;
  }

  const deleteEventDriversResult = await deleteEventDriverRowsByEventIds(
    eventIdsResult.data,
  );

  if (!deleteEventDriversResult.success) {
    return deleteEventDriversResult;
  }

  const deleteTrackDetailsResult = await deleteEventTrackDetailsByEventId(
    eventIdsResult.data[0],
  );

  if (!deleteTrackDetailsResult.success) {
    return deleteTrackDetailsResult;
  }

  const deleteCarDetailsResult = await deleteEventCarDetailsByEventId(
    eventIdsResult.data[0],
  );

  if (!deleteCarDetailsResult.success) {
    return deleteCarDetailsResult;
  }

  const deleteSessionSettingsResult = await deleteEventSessionSettingsByEventId(
    eventIdsResult.data[0],
  );

  if (!deleteSessionSettingsResult.success) {
    return deleteSessionSettingsResult;
  }

  const { error } = await supabase.from("event").delete().eq(
    "division_id",
    divisionId,
  );

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
export const deleteEventsBySeasonId = async (
  seasonId: string,
): Promise<DeleteEventResponse> => {
  const eventIdsResult = await getEventIdsByColumn("season_id", seasonId);

  if (!eventIdsResult.success) {
    return eventIdsResult;
  }

  const deleteEventDriversResult = await deleteEventDriverRowsByEventIds(
    eventIdsResult.data,
  );

  if (!deleteEventDriversResult.success) {
    return deleteEventDriversResult;
  }

  const deleteTrackDetailsResult = await deleteEventTrackDetailsByEventId(
    eventIdsResult.data[0],
  );

  if (!deleteTrackDetailsResult.success) {
    return deleteTrackDetailsResult;
  }

  const deleteCarDetailsResult = await deleteEventCarDetailsByEventId(
    eventIdsResult.data[0],
  );

  if (!deleteCarDetailsResult.success) {
    return deleteCarDetailsResult;
  }

  const deleteSessionSettingsResult = await deleteEventSessionSettingsByEventId(
    eventIdsResult.data[0],
  );

  if (!deleteSessionSettingsResult.success) {
    return deleteSessionSettingsResult;
  }

  const { error } = await supabase.from("event").delete().eq(
    "season_id",
    seasonId,
  );

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

// Delete Track Details for an event by its ID
export const deleteEventTrackDetailsByEventId = async (
  eventId: string,
): Promise<DeleteEventTrackDetailsResponse> => {
  const { error } = await supabase
    .from("event_track_details")
    .delete()
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
  };
};

// Delete Car Details for an event by its ID
export const deleteEventCarDetailsByEventId = async (
  eventId: string,
): Promise<DeleteEventCarDetailsResponse> => {
  const { error } = await supabase
    .from("event_car_details")
    .delete()
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
  };
};

// Delete Session Settings for an event by its ID
export const deleteEventSessionSettingsByEventId = async (
  eventId: string,
): Promise<DeleteEventSessionSettingsResponse> => {
  const { error } = await supabase
    .from("event_session_settings")
    .delete()
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
  };
};