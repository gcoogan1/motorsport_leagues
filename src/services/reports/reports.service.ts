
import { supabase } from "@/lib/supabase";
import type { Tag } from "@/components/Tags/Tags.variants";
import type { CreateDecisionPayload, CreateDecisionResponse, CreateTicketPayload, CreateTicketResponse, DeleteDecisionResponse, DeleteTicketResponse, GetDecisionByIdResponse, GetDecisionsBySeasonIDResponse, GetTicketByIdResponse, GetTicketsBySeasonIdResponse, UpdateDecisionPayload, UpdateDecisionResponse } from "@/types/reports.types";

type LeagueSeasonDriverWithTeam = {
  display_name?: string | null;
  avatar_type?: "preset" | "upload" | null;
  avatar_value?: string | null;
  profile_id?: string | null;
  league_season_team?:
    | { team_name?: string | null }
    | Array<{ team_name?: string | null }>
    | null;
};

const getTeamName = (driver: LeagueSeasonDriverWithTeam | null | undefined): string | undefined => {
  const team = driver?.league_season_team;

  if (!team) {
    return undefined;
  }

  if (Array.isArray(team)) {
    return team[0]?.team_name ?? undefined;
  }

  return team.team_name ?? undefined;
};

const isTag = (value: string): value is Tag => {
  return [
    "director",
    "founder",
    "driver",
    "host",
    "steward",
    "broadcaster",
    "staff",
    "champion",
  ].includes(value);
};

const resolveAvatarValue = (
  avatarType: "preset" | "upload",
  avatarValue: string,
): string => {
  if (avatarType !== "upload") {
    return avatarValue;
  }

  if (/^https?:\/\//i.test(avatarValue)) {
    return avatarValue;
  }

  const { data } = supabase.storage
    .from("avatars")
    .getPublicUrl(avatarValue);

  return data.publicUrl;
};

const getParticipantTagsByLeagueAndProfile = async (
  leagueId: string,
  profileId: string,
): Promise<Tag[]> => {
  const participantResponse = await supabase
    .from("league_participants")
    .select("id")
    .eq("league_id", leagueId)
    .eq("profile_id", profileId)
    .maybeSingle();

  const participantId = participantResponse.data?.id;

  if (!participantId) {
    return [];
  }

  const rolesResponse = await supabase
    .from("league_participants_role")
    .select("role")
    .eq("participant_id", participantId);

  return (
    rolesResponse.data
      ?.map((roleRow: { role: string }) => roleRow.role)
      .filter(isTag) ?? []
  );
};

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

  const seasonResponse = await supabase
    .from("league_season")
    .select("league_id")
    .eq("id", seasonId)
    .maybeSingle();

  const leagueId = seasonResponse.data?.league_id;

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
          .select("display_name, avatar_type, avatar_value, profile_id, team_id, league_season_team ( team_name )")
          .eq("id", ticket.offending_driver_id)
          .maybeSingle(),
        supabase
          .from("league_season_driver")
          .select("display_name, avatar_type, avatar_value, profile_id, team_id, league_season_team ( team_name )")
          .eq("id", ticket.reporting_driver_id)
          .maybeSingle(),
        supabase
          .from("event")
          .select("event_name")
          .eq("id", ticket.event_id)
          .maybeSingle(),
      ]);

      const offendingDriverProfileId = offendingDriverResponse.data?.profile_id;
      const reportingDriverProfileId = reportingDriverResponse.data?.profile_id;

      const offendingDriverTags =
        leagueId && offendingDriverProfileId
          ? await getParticipantTagsByLeagueAndProfile(
              leagueId,
              offendingDriverProfileId,
            )
          : [];

      const reportingDriverTags =
        leagueId && reportingDriverProfileId
          ? await getParticipantTagsByLeagueAndProfile(
              leagueId,
              reportingDriverProfileId,
            )
          : [];

      return {
        ...ticket,
        driverPosition: resultResponse.data?.position ?? 0,
        eventName: eventResponse.data?.event_name ?? "Unknown Event",
        offending_driver: {
          username: offendingDriverResponse.data?.display_name ?? "Unknown",
          avatarType: offendingDriverResponse.data?.avatar_type ?? "preset",
          avatarValue: offendingDriverResponse.data?.avatar_value ?? "black",
          teamName: getTeamName(
            offendingDriverResponse.data as LeagueSeasonDriverWithTeam | null | undefined,
          ),
          tags: offendingDriverTags,
        },
        reporting_driver: {
          username: reportingDriverResponse.data?.display_name ?? "Unknown",
          avatarType: reportingDriverResponse.data?.avatar_type ?? "preset",
          avatarValue: reportingDriverResponse.data?.avatar_value ?? "black",
          teamName: getTeamName(
            reportingDriverResponse.data as LeagueSeasonDriverWithTeam | null | undefined,
          ),
          tags: reportingDriverTags,
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
        status: "open"
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

  const [resultResponse, offendingDriverResponse] = await Promise.all([
    supabase
      .from("results")
      .select("position")
      .eq("driver_id", data.offending_driver_id)
      .eq("event_id", data.event_id)
      .maybeSingle(),
    supabase
      .from("league_season_driver")
      .select("display_name, avatar_type, avatar_value, profile_id, team_id, league_season_team ( team_name )")
      .eq("id", data.offending_driver_id)
      .maybeSingle(),
  ]);

  const seasonResponse = await supabase
    .from("league_season")
    .select("league_id")
    .eq("id", data.season_id)
    .maybeSingle();

  const leagueId = seasonResponse.data?.league_id;

  const participantResponse = await supabase
    .from("league_participants")
    .select("profile_id")
    .eq("id", data.steward_id)
    .maybeSingle();

  const stewardRolesResponse = await supabase
    .from("league_participants_role")
    .select("role")
    .eq("participant_id", data.steward_id);

  const stewardProfileId = participantResponse.data?.profile_id;
  const reportingDriverResponse = stewardProfileId
    ? await supabase
        .from("profiles")
        .select("username, avatar_type, avatar_value")
        .eq("id", stewardProfileId)
        .maybeSingle()
    : { data: null };

  const offendingDriverProfileId = offendingDriverResponse.data?.profile_id;
  const offendingDriverTags =
    leagueId && offendingDriverProfileId
      ? await getParticipantTagsByLeagueAndProfile(leagueId, offendingDriverProfileId)
      : [];

  const enrichedData = {
    ...data,
    driverPosition: resultResponse.data?.position ?? 0,
    offending_driver: {
      username: offendingDriverResponse.data?.display_name ?? "Unknown",
      avatarType: offendingDriverResponse.data?.avatar_type ?? "preset",
      avatarValue: offendingDriverResponse.data?.avatar_value ?? "black",
      teamName: getTeamName(
        offendingDriverResponse.data as LeagueSeasonDriverWithTeam | null | undefined,
      ),
      tags: offendingDriverTags,
    },
    steward_info: {
      username: reportingDriverResponse.data?.username ?? "Unknown",
      avatarType: reportingDriverResponse.data?.avatar_type ?? "preset",
      avatarValue: resolveAvatarValue(
        (reportingDriverResponse.data?.avatar_type ?? "preset") as
          | "preset"
          | "upload",
        reportingDriverResponse.data?.avatar_value ?? "black",
      ),
      tags:
        stewardRolesResponse.data
          ?.map((roleRow) => roleRow.role)
          .filter(isTag) ?? [],
    },
  };

  return {
    success: true,
    data: enrichedData,
  };
};

export const getDecisionsBySeasonID = async (seasonId: string): Promise<GetDecisionsBySeasonIDResponse> => {
  const { data, error } = await supabase
    .from("decisions")
    .select("*")
    .eq("season_id", seasonId);

  const seasonResponse = await supabase
    .from("league_season")
    .select("league_id")
    .eq("id", seasonId)
    .maybeSingle();

  const leagueId = seasonResponse.data?.league_id;

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

  // Fetch offending driver and steward profile info and position for each decision
  const enrichedData = await Promise.all(
    data.map(async (decision) => {
      // Fetch driver position and offending driver details in parallel
      const [resultResponse, offendingDriverResponse] = await Promise.all([
        supabase
          .from("results")
          .select("position")
          .eq("driver_id", decision.offending_driver_id)
          .eq("event_id", decision.event_id)
          .maybeSingle(),
        supabase
          .from("league_season_driver")
          .select("display_name, avatar_type, avatar_value, profile_id, team_id, league_season_team ( team_name )")
          .eq("id", decision.offending_driver_id)
          .maybeSingle(),
      ]);

      const offendingDriverProfileId = offendingDriverResponse.data?.profile_id;
      const offendingDriverTags =
        leagueId && offendingDriverProfileId
          ? await getParticipantTagsByLeagueAndProfile(
              leagueId,
              offendingDriverProfileId,
            )
          : [];

      // Steward ID points to league_participants.id; resolve to profile first, then fetch profile info.
      const participantResponse = await supabase
        .from("league_participants")
        .select("profile_id")
        .eq("id", decision.steward_id)
        .maybeSingle();

      const stewardRolesResponse = await supabase
        .from("league_participants_role")
        .select("role")
        .eq("participant_id", decision.steward_id);

      const stewardProfileId = participantResponse.data?.profile_id;
      const reportingDriverResponse = stewardProfileId
        ? await supabase
            .from("profiles")
            .select("username, avatar_type, avatar_value")
            .eq("id", stewardProfileId)
            .maybeSingle()
        : { data: null };

      return {
        ...decision,
        driverPosition: resultResponse.data?.position ?? 0,
        offending_driver: {
          username: offendingDriverResponse.data?.display_name ?? "Unknown",
          avatarType: offendingDriverResponse.data?.avatar_type ?? "preset",
          avatarValue: offendingDriverResponse.data?.avatar_value ?? "black",
          teamName: getTeamName(
            offendingDriverResponse.data as LeagueSeasonDriverWithTeam | null | undefined,
          ),
          tags: offendingDriverTags,
        },
        steward_info: {
          username: reportingDriverResponse.data?.username ?? "Unknown",
          avatarType: reportingDriverResponse.data?.avatar_type ?? "preset",
          avatarValue: resolveAvatarValue(
            (reportingDriverResponse.data?.avatar_type ?? "preset") as
              | "preset"
              | "upload",
            reportingDriverResponse.data?.avatar_value ?? "black",
          ),
          tags:
            stewardRolesResponse.data
              ?.map((roleRow) => roleRow.role)
              .filter(isTag) ?? [],
        },
      };
    })
  );

  return {
    success: true,
    data: enrichedData,
  };
};

export const createDecision = async (payload: CreateDecisionPayload): Promise<CreateDecisionResponse> => {
  const { data, error } = await supabase
    .from("decisions")
    .insert([
      {
        ticket_num: payload.ticketNum,
        offending_driver_id: payload.offendingDriverId,
        steward_id: payload.stewardId,
        season_id: payload.seasonId,
        incident_title: payload.incidentTitle,
        decision_summary: payload.decisionSummary,
        detailed_reasoning: payload.detailedReasoning,
        event_id: payload.eventId,
        event_name: payload.eventName,
        session_type: payload.sessionType,
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

  // Update ticket status to closed instead of deleting
  const { error: updateError } = await supabase
    .from("tickets")
    .update({ status: "closed" })
    .eq("id", payload.ticketId);

  if (updateError) {
    return {
      success: false,
      error: {
        message: updateError.message,
        code: updateError.code,
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
      incident_title: payload.incidentTitle,
      decision_summary: payload.decisionSummary,
      detailed_reasoning: payload.detailedReasoning,
    })
    .eq("id", payload.decisionId)
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
  // First get the decision to find the ticket_id
  const { data: decisionData, error: fetchError } = await supabase
    .from("decisions")
    .select("ticket_num, season_id")
    .eq("id", decisionTableId)
    .maybeSingle();

  if (fetchError || !decisionData) {
    return {
      success: false,
      error: {
        message: fetchError?.message || "Decision not found",
        code: fetchError?.code || "NOT_FOUND",
        status: 500,
      },
    };
  }

  // Find the ticket to delete
  const { data: ticketData, error: ticketFetchError } = await supabase
    .from("tickets")
    .select("id")
    .eq("ticket_id", decisionData.ticket_num)
    .eq("season_id", decisionData.season_id)
    .maybeSingle();

  if (ticketFetchError) {
    return {
      success: false,
      error: {
        message: ticketFetchError.message,
        code: ticketFetchError.code,
        status: 500,
      },
    };
  }

  // Delete the decision
  const { error: deleteDecisionError } = await supabase
    .from("decisions")
    .delete()
    .eq("id", decisionTableId);

  if (deleteDecisionError) {
    return {
      success: false,
      error: {
        message: deleteDecisionError.message,
        code: deleteDecisionError.code,
        status: 500,
      },
    };
  }

  // Delete the associated ticket if it exists
  if (ticketData?.id) {
    const { error: deleteTicketError } = await supabase
      .from("tickets")
      .delete()
      .eq("id", ticketData.id);

    if (deleteTicketError) {
      return {
        success: false,
        error: {
          message: deleteTicketError.message,
          code: deleteTicketError.code,
          status: 500,
        },
      };
    }
  }

  return {
    success: true,
  };
};