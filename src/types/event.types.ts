// -- SUPABASE TABLES -- //

export type EventTable = {
  id: string;
  created_at: string;
  round_id: string;
  division_id: string;
  season_id: string;
  event_name: string;
  event_date: string;
  broadcast_link?: string;
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

// -- UPDATE -- //

export type UpdateEventPayload = {
  eventId: string;
  eventName?: string;
  eventDate?: string;
  broadcastLink?: string;
};

export type UpdateEventSuccess = {
  success: true;
  data: EventTable;
};

export type UpdateEventResponse = UpdateEventSuccess | SupabaseError;

// -- DELETE -- //

export type DeleteEventResponse = {
  success: true;
} | SupabaseError; 
