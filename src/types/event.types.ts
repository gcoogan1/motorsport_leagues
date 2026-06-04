// -- SUPABASE TABLES -- //

import type { CarCategory } from "./cars.types";

export type EventTable = {
  id: string;
  created_at: string;
  round_id: string;
  division_id: string;
  season_id: string;
  event_name: string;
  event_date?: string;
  event_time_zone?: string;
  broadcast_url?: string;
  reveal_date?: boolean;
  reveal_broadcast?: boolean;
}

export type JoinedEventTable = EventTable & {
  event_track_details?: EventTrackDetailsTable;
  event_car_details?: EventCarDetailsTable[];
}

export type EventDriverTable = {
  id: string;
  created_at: string;
  event_id: string;
  season_driver_id: string;
}

export type EventTrackDetailsTable = {
  id: string;
  created_at: string;
  event_id: string;
  track_name: string;
  reveal_track?: boolean;
}

export type EventCarDetailsTable = {
  id: string;
  created_at: string;
  event_id: string;
  car_id: string;
  car_name: string;
  car_selection: "Specified" | "Category" | "Assigned";
  car_category: CarCategory;
  car_image_url: string;
  reveal_car: boolean;
}

export type EventSessionSettingsTable = {
  id: string;
  created_at: string;
  event_id: string;
  reveal_session: boolean;
  has_qualifying: boolean;
  qualifying_type?: "laps" | "time";
  qualifying_time?: string;
  qualifying_laps?: number;
  has_race: boolean;
  race_type?: "laps" | "time";
  race_time?: string;
  race_laps?: number;
}


// -- DRAFT TYPES -- //
export type EventTableDraft = {
  id: string;
  created_at: string;
  round_id: string;
  division_id: string;
  season_id: string;
  event_name: string;
  event_date?: string;
  event_time_zone?: string;
}


// -- SUPABASE SERVICE TYPES -- //

type SupabaseError = {
  success: false;
  error: {
    message: string;
    code: string;
    status: number;
  };
};

// -- CREATE -- //

export type CreateEventPayload = {
  eventName: string;
  eventDate?: string;
  eventTimeZone?: string;
  roundId: string;
  divisionId: string;
  seasonId: string;
};

export type CreateEventSuccess = {
  success: true;
  data: EventTable;
};

export type CreateEventResponse = CreateEventSuccess | SupabaseError;

export type CreateEventDriverPayload = {
  eventId: string;
  seasonDriverId: string;
};

export type CreateEventDriverSuccess = {
  success: true;
  data: EventDriverTable;
};

export type CreateEventDriverResponse = CreateEventDriverSuccess | SupabaseError;

export type CreateEventTrackDetailsPayload = {
  eventId: string;
  trackName: string;
  revealTrack?: boolean;
};

export type CreateEventTrackDetailsSuccess = {
  success: true;
  data: EventTrackDetailsTable;
};

export type CreateEventTrackDetailsResponse = CreateEventTrackDetailsSuccess | SupabaseError;

export type CreateEventCarDetailsPayload = {
  eventId: string;
  carSelection: "Specified" | "Category" | "Assigned";
  carCategory: CarCategory;
  carId: string;
  carName?: string;
  carImageUrl?: string;
  revealCarDetails?: boolean;
};

export type CreateEventCarDetailsSuccess = {
  success: true;
  data: EventCarDetailsTable;
};

export type CreateEventCarDetailsResponse = CreateEventCarDetailsSuccess | SupabaseError;

export type CreateEventSessionSettingsPayload = {
  eventId: string;
  revealSession: boolean;
  hasQualifying: boolean;
  qualifyingType?: "laps" | "time";
  qualifyingTime?: string;
  qualifyingLaps?: number;
  hasRace: boolean;
  raceType?: "laps" | "time";
  raceTime?: string;
  raceLaps?: number;
};

export type CreateEventSessionSettingsSuccess = {
  success: true;
  data: EventSessionSettingsTable;
};

export type CreateEventSessionSettingsResponse = CreateEventSessionSettingsSuccess | SupabaseError;

// -- GET -- //

// Get all events for a specific round, division, or season
export type GetEventsSuccess = {
  success: true;
  data: EventTable[] | JoinedEventTable[];
};

export type GetEventsResponse = GetEventsSuccess | SupabaseError;

// -- GET BY ID -- //

// Get a single event by its ID
export type GetEventByIdSuccess = {
  success: true;
  data: EventTable | JoinedEventTable;
};

export type GetEventByIdResponse = GetEventByIdSuccess | SupabaseError;

export type GetEventDriversSuccess = {
  success: true;
  data: EventDriverTable[];
};

export type GetEventDriversResponse = GetEventDriversSuccess | SupabaseError;

export type EventIdsLookupSuccess = {
  success: true;
  data: string[];
};

export type EventIdsLookupResponse = EventIdsLookupSuccess | SupabaseError;

export type GetEventTrackDetailsByEventIdSuccess = {
  success: true;
  data: EventTrackDetailsTable;
};

export type GetEventTrackDetailsByEventIdResponse = GetEventTrackDetailsByEventIdSuccess | SupabaseError;

export type GetEventCarDetailsByEventIdSuccess = {
  success: true;
  data: EventCarDetailsTable[];
};

export type GetEventCarDetailsByEventIdResponse = GetEventCarDetailsByEventIdSuccess | SupabaseError;

export type GetEventSessionSettingsByEventIdSuccess = {
  success: true;
  data: EventSessionSettingsTable;
};

export type GetEventSessionSettingsByEventIdResponse = GetEventSessionSettingsByEventIdSuccess | SupabaseError;

// -- UPDATE -- //

export type UpdateEventPayload = {
  eventId: string;
  eventName?: string;
  eventDate?: string;
  eventTimeZone?: string;
  broadcastUrl?: string;
  revealDate?: boolean;
  revealBroadcast?: boolean;
};

export type UpdateEventSuccess = {
  success: true;
  data: EventTable;
};

export type UpdateEventResponse = UpdateEventSuccess | SupabaseError;

export type UpdateEventCarDetailsSuccess = {
  success: true;
  data: EventCarDetailsTable;
};

export type UpdateEventCarDetailsResponse = UpdateEventCarDetailsSuccess | SupabaseError;


export type UpdateEventTrackDetailsPayload = {
  eventId: string;
  trackName: string;
  revealTrack?: boolean;
};

export type UpdateEventTrackDetailsSuccess = {
  success: true;
  data: EventTrackDetailsTable;
};

export type UpdateEventTrackDetailsResponse = UpdateEventTrackDetailsSuccess | SupabaseError;

export type UpdateEventCarDetailsPayload = {
  eventId: string;
  carSelection: "Specified" | "Category" | "Assigned";
  carCategory?: CarCategory;
  carId?: string;
  carName?: string;
  carImageUrl?: string;
  revealCarDetails?: boolean;
};

export type UpdateEventSessionSettingsPayload = {
  eventId: string;
  revealSession: boolean;
  hasQualifying: boolean;
  qualifyingType?: "laps" | "time" | null;
  qualifyingTime?: string | null;
  qualifyingLaps?: number | null;
  hasRace: boolean;
  raceType?: "laps" | "time" | null;
  raceTime?: string | null;
  raceLaps?: number | null;
};

export type UpdateEventSessionSettingsSuccess = {
  success: true;
  data: EventSessionSettingsTable;
};

export type UpdateEventSessionSettingsResponse = UpdateEventSessionSettingsSuccess | SupabaseError;

// -- DELETE -- //

export type DeleteEventResponse = {
  success: true;
} | SupabaseError; 

export type DeleteEventDriverResponse = {
  success: true;
} | SupabaseError;

export type DeleteEventTrackDetailsResponse = {
  success: true;
} | SupabaseError;

export type DeleteEventCarDetailsResponse = {
  success: true;
} | SupabaseError;

export type DeleteEventSessionSettingsResponse = {
  success: true;
} | SupabaseError;
