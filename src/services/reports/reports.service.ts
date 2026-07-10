
import { supabase } from "@/lib/supabase";
import type { CreateDecisionPayload, CreateDecisionResponse, CreateTicketPayload, CreateTicketResponse, DeleteDecisionResponse, DeleteTicketResponse, GetDecisionByIdResponse, GetDecisionsBySeasonIDResponse, GetTicketByIdResponse, GetTicketsBySeasonIdResponse, UpdateDecisionPayload, UpdateDecisionResponse } from "@/types/reports.types";

// -- Reports Service -- //

// -- TICKET SERVICE FUNCTIONS -- //

export const getTicketById = async (ticketTableId: string): Promise<GetTicketByIdResponse> => {
  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("id", ticketTableId)
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

export const getTicketsBySeasonId = async (seasonId: string): Promise<GetTicketsBySeasonIdResponse> => {
  const { data, error } = await supabase
    .from("tickets")
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

  // Fetch results and driver info for each ticket
  const enrichedData = await Promise.all(
    data.map(async (ticket) => {
      const [resultResponse, offendingDriverResponse, reportingDriverResponse, eventResponse] = await Promise.all([
        supabase
          .from("results")
          .select("position")
          .eq("driver_id", ticket.offending_driver_id)
          .eq("event_id", ticket.event_id)
          .maybeSingle(),
        supabase
          .from("league_season_driver")
          .select("display_name, avatar_type, avatar_value, team_id, league_season_team ( team_name )")
          .eq("id", ticket.offending_driver_id)
          .maybeSingle(),
        supabase
          .from("league_season_driver")
          .select("display_name, avatar_type, avatar_value, team_id, league_season_team ( team_name )")
          .eq("id", ticket.reporting_driver_id)
          .maybeSingle(),
        supabase
          .from("event")
          .select("event_name")
          .eq("id", ticket.event_id)
          .maybeSingle(),
      ]);

      return {
        ...ticket,
        driverPosition: resultResponse.data?.position ?? 0,
        eventName: eventResponse.data?.event_name ?? "Unknown Event",
        offending_driver: {
          username: offendingDriverResponse.data?.display_name ?? "Unknown",
          avatarType: offendingDriverResponse.data?.avatar_type ?? "preset",
          avatarValue: offendingDriverResponse.data?.avatar_value ?? "black",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          teamName: (offendingDriverResponse.data as any)?.league_season_team?.team_name ?? undefined,
        },
        reporting_driver: {
          username: reportingDriverResponse.data?.display_name ?? "Unknown",
          avatarType: reportingDriverResponse.data?.avatar_type ?? "preset",
          avatarValue: reportingDriverResponse.data?.avatar_value ?? "black",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          teamName: (reportingDriverResponse.data as any)?.league_season_team?.team_name ?? undefined,
        },
      };
    })
  );

  return {
    success: true,
    data: enrichedData,
  };
};

export const createTicket = async (
  payload: CreateTicketPayload,
): Promise<CreateTicketResponse> => {
  // Get the latest ticket number for this season
  const { data: latestTicket, error: latestTicketError } = await supabase
    .from("tickets")
    .select("ticket_id")
    .eq("season_id", payload.seasonId)
    .order("ticket_id", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latestTicketError) {
    return {
      success: false,
      error: {
        message: latestTicketError.message,
        code: latestTicketError.code,
        status: 500,
      },
    };
  }

  const ticketNumber = (latestTicket?.ticket_id ?? 0) + 1;

  const { data, error } = await supabase
    .from("tickets")
    .insert([
      {
        ticket_id: ticketNumber,
        season_id: payload.seasonId,
        division_id: payload.divisionId,
        round_id: payload.roundId,
        event_id: payload.eventId,
        is_race_session: payload.isRaceSession,
        offending_driver_id: payload.offendingDriverId,
        reporting_driver_id: payload.reportingDriverId,
        incident_description: payload.incidentDescription,
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
    data,
  };
};

export const deleteTicket = async (ticketTableId: string): Promise<DeleteTicketResponse> => {
  const { error } = await supabase
    .from("tickets")
    .delete()
    .eq("id", ticketTableId);

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

// -- DECISION SERVICE FUNCTIONS -- //

export const getDecisionById = async (decisionTableId: string): Promise<GetDecisionByIdResponse> => {
  const { data, error } = await supabase
    .from("decisions")
    .select("*")
    .eq("id", decisionTableId)
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

export const getDecisionsBySeasonID = async (seasonId: string): Promise<GetDecisionsBySeasonIDResponse> => {
  const { data, error } = await supabase
    .from("decisions")
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

export const createDecision = async (payload: CreateDecisionPayload): Promise<CreateDecisionResponse> => {
  const { data, error } = await supabase
    .from("decisions")
    .insert([
      {
        ticket_table_id: payload.ticketTableId,
        offending_driver_id: payload.offendingDriverId,
        season_id: payload.seasonId,
        incident_title: payload.incidentTitle,
        decision_summary: payload.decisionSummary,
        detailed_reasoning: payload.detailedReasoning,
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
    data,
  };
};

export const updateDecision = async (payload: UpdateDecisionPayload): Promise<UpdateDecisionResponse> => {
  const { data, error } = await supabase
    .from("decisions")
    .update({
      offending_driver_id: payload.offendingDriverId,
      season_id: payload.seasonId,
      incident_title: payload.incidentTitle,
      decision_summary: payload.decisionSummary,
      detailed_reasoning: payload.detailedReasoning,
    })
    .eq("id", payload.decisionTableId)
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
    data,
  };
};

export const deleteDecision = async (decisionTableId: string): Promise<DeleteDecisionResponse> => {
  const { error } = await supabase
    .from("decisions")
    .delete()
    .eq("id", decisionTableId)
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
  };
};