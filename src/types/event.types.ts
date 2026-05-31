// -- SUPABASE TABLES -- //

export type EventTable = {
  id: string;
  created_at: string;
  round_id: string;
  division_id: string;
  season_id: string;
  event_name: string;
  event_date: string;
  event_time_zone?: string;
  broadcast_url?: string;
  reveal_date?: boolean;
  reveal_broadcast?: boolean;
}

export type EventDriverTable = {
  id: string;
  created_at: string;
  event_id: string;
  season_driver_id: string;
}


// -- DRAFT TYPES -- //
export type EventTableDraft = {
  id: string;
  created_at: string;
  round_id: string;
  division_id: string;
  season_id: string;
  event_name: string;
  event_date: string;
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
  eventDate: string;
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

// -- GET -- //

// Get all events for a specific round, division, or season
export type GetEventsSuccess = {
  success: true;
  data: EventTable[];
};

export type GetEventsResponse = GetEventsSuccess | SupabaseError;

// -- GET BY ID -- //

// Get a single event by its ID
export type GetEventByIdSuccess = {
  success: true;
  data: EventTable;
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

export type CreateEventDriverPayload = {
  eventId: string;
  seasonDriverId: string;
};

export type CreateEventDriverSuccess = {
  success: true;
  data: EventDriverTable;
};

export type CreateEventDriverResponse = CreateEventDriverSuccess | SupabaseError;

// -- DELETE -- //

export type DeleteEventResponse = {
  success: true;
} | SupabaseError; 

export type DeleteEventDriverResponse = {
  success: true;
} | SupabaseError;
