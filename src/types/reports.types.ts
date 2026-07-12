import type { Tag } from "@/components/Tags/Tags.variants";

export type TicketsTable = {
  id: string;
  created_at: string;
  ticket_id: number;
  season_id: string;
  division_id: string;
  round_id: string;
  event_id: string;
  is_race_session: boolean;
  offending_driver_id: string;
  reporting_driver_id: string;
  incident_description: string;
  status: "open" | "closed";
  // not in supabase
  driverPosition?: number;
  eventName?: string;
  offending_driver?: {
    username: string;
    avatarType: "preset" | "upload";
    avatarValue: string;
    teamName?: string;
  };
  reporting_driver?: {
    username: string;
    avatarType: "preset" | "upload";
    avatarValue: string;
    teamName?: string;
  };
}

export type DecisionsTable = {
  id: string;
  created_at: string;
  ticket_num: number;
  season_id: string;
  offending_driver_id: string;
  steward_id: string; // steward OR director
  incident_title: string;
  decision_summary: string;
  detailed_reasoning: string;
  event_id: string;
  event_name: string;
  session_type: string;
  // not in supbase
  offending_driver?: {
    username: string;
    avatarType: "preset" | "upload";
    avatarValue: string;
    teamName?: string;
  };
  steward_info?: {
    username: string;
    avatarType: "preset" | "upload";
    avatarValue: string;
    teamName?: string;
    tags?: Tag[];
  };
  driverPosition?: number;
};



// -- SUPABASE SERVICE TYPES -- //

export type SupabaseError = {
  success: false;
  error: {
    message: string;
    code: string;
    status: number;
  };
};

// -- TICKET SERVICE TYPES -- //

export type CreateTicketPayload = {
  divisionId: string;
  roundId: string;
  eventId: string;
  isRaceSession: boolean;
  offendingDriverId: string;
  reportingDriverId: string;
  seasonId: string;
  incidentDescription: string;
};

export type CreateTicketSuccessResponse = {
  success: true;
  data: TicketsTable;
};

export type CreateTicketResponse = CreateTicketSuccessResponse | SupabaseError;

export type GetTicketByIdPayload = {
  ticketTableId: string;
};

export type GetTicketByIdSuccessResponse = {
  success: true;
  data: TicketsTable;
};

export type GetTicketByIdResponse = GetTicketByIdSuccessResponse | SupabaseError;

export type GetTicketsBySeasonIdPayload = {
  seasonId: string;
};

export type GetTicketsBySeasonIdSuccessResponse = {
  success: true;
  data: TicketsTable[];
};
export type GetTicketsBySeasonIdResponse = GetTicketsBySeasonIdSuccessResponse | SupabaseError;

export type DeleteTicketPayload = {
  ticketTableId: string;
};

export type DeleteTicketSuccessResponse = {
  success: true;
};

export type DeleteTicketResponse = DeleteTicketSuccessResponse | SupabaseError;

// -- DECISION SERVICE TYPES -- //

export type CreateDecisionPayload = {
  ticketId: string;
  ticketNum: number;
  offendingDriverId: string;
  stewardId: string; // steward OR director
  seasonId: string;
  incidentTitle: string;
  decisionSummary: string;
  detailedReasoning: string;
  eventId: string;
  eventName: string;
  sessionType: string;
};

export type CreateDecisionSuccessResponse = {
  success: true;
  data: DecisionsTable;
};

export type CreateDecisionResponse = CreateDecisionSuccessResponse | SupabaseError;

export type UpdateDecisionPayload = {
  decisionId: string;
  seasonId: string;
  offendingDriverId: string;
  incidentTitle: string;
  decisionSummary: string;
  detailedReasoning: string;
};

export type UpdateDecisionSuccessResponse = {
  success: true;
  data: DecisionsTable;
};

export type UpdateDecisionResponse = UpdateDecisionSuccessResponse | SupabaseError;

export type GetDecisionByIdPayload = {
  decisionTableId: string;
};

export type GetDecisionByIdSuccessResponse = {
  success: true;
  data: DecisionsTable;
};

export type GetDecisionByIdResponse = GetDecisionByIdSuccessResponse | SupabaseError;

export type GetDecisionsBySeasonIDPayload = {
  seasonId: string;
};

export type GetDecisionsBySeasonIDSuccessResponse = {
  success: true;
  data: DecisionsTable[];
};

export type GetDecisionsBySeasonIDResponse = GetDecisionsBySeasonIDSuccessResponse | SupabaseError;

export type DeleteDecisionPayload = {
  decisionTableId: string;
};

export type DeleteDecisionSuccessResponse = {
  success: true;
};

export type DeleteDecisionResponse = DeleteDecisionSuccessResponse | SupabaseError;