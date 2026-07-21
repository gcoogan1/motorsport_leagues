import { useState } from "react";
import { useSelector } from "react-redux";
import { useModal } from "@/providers/modal/useModal";
import { formatTimeAgo } from "@/utils/dates";
import { useLeagueParticipants } from "@/rtkQuery/hooks/queries/useLeagues";
import {
  useTicketsBySeasonId,
  useDecisionsBySeasonId,
} from "@/rtkQuery/hooks/queries/useReports";
import type { LeagueSeasonTable } from "@/types/league.types";
import type { DecisionsTable, TicketsTable } from "@/types/reports.types";
import type { RootState } from "@/store";
import StewardIcon from "@assets/Icon/Stewards.svg?react";
import PanelLayout from "@/components/Panels/components/PanelLayout/PanelLayout";
import TicketMessage from "@/components/Messages/TicketMessage/TicketMessage";
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import LoadingMessage from "@/components/Messages/LoadingMessage/LoadingMessage";
import ViewTicket from "./forms/ViewTicket/ViewTicket";
import ResolveTicket from "./forms/ResolveTicket/ResolveTicket";
import EditDecision from "./forms/EditDecision/EditDecision";
import DeleteDecision from "./modals/chore/DeleteDecision/DeleteDecision";

const TABS = [{ label: "For Review" }, { label: "Decisions" }];

type TicketsProps = {
  isStewardOrDirector: boolean;
  seasonData: LeagueSeasonTable;
};

const Tickets = ({ isStewardOrDirector, seasonData }: TicketsProps) => {
  const { openModal } = useModal();
  const [activeTab, setActiveTab] = useState<string>(TABS[0].label);
  const accountId = useSelector((state: RootState) => state.account.data?.id);
  const { data: participants = [] } = useLeagueParticipants(
    seasonData?.league_id,
  );
  const currentParticipant = participants.find(
    (participant) => participant.account_id === accountId,
  );

  const { data: allTickets = [], isLoading: isTicketsLoading } = useTicketsBySeasonId(
    isStewardOrDirector ? seasonData?.id : undefined,
  );

  const { data: allDecisions = [], isLoading: isDecisionsLoading } = useDecisionsBySeasonId(
    seasonData?.id,
  );

  const openTickets = allTickets.filter((ticket) => ticket.status === "open");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const onViewClick = (ticket: TicketsTable) => {
    return openModal(
      <ViewTicket
        ticketId={ticket.id}
        seasonId={seasonData.id}
        ticketNum={ticket.ticket_id}
        stewardId={currentParticipant?.id || ""}
        eventId={ticket.event_id}
        seasonName={seasonData.season_name}
        sessionType={ticket.is_race_session ? "Race" : "Qualifying"}
        eventName={ticket.eventName || "Unknown Event"}
        description={ticket.incident_description}
        createdAt={formatTimeAgo(ticket.created_at)}
        reportingDriver={{
          id: ticket.reporting_driver_id,
          username: ticket.reporting_driver?.username || "Unknown",
          avatarType: ticket.reporting_driver?.avatarType || "preset",
          avatarValue: ticket.reporting_driver?.avatarValue || "black",
          teamName: ticket.reporting_driver?.teamName,
        }}
        offendingDriver={{
          id: ticket.offending_driver_id,
          username: ticket.offending_driver?.username || "Unknown",
          avatarType: ticket.offending_driver?.avatarType || "preset",
          avatarValue: ticket.offending_driver?.avatarValue || "black",
          teamName: ticket.offending_driver?.teamName,
        }}
      />,
    );
  };

  const onResolveClick = (ticket: TicketsTable) => {
    return openModal(
      <ResolveTicket
        ticketId={ticket.id}
        seasonId={seasonData.id}
        ticketNum={ticket.ticket_id}
        stewardId={currentParticipant?.id || ""}
        eventId={ticket.event_id}
        eventName={ticket.eventName || "Unknown Event"}
        sessionType={ticket.is_race_session ? "Race" : "Qualifying"}
        offendingDriver={{
          id: ticket.offending_driver_id,
          username: ticket.offending_driver?.username || "Unknown",
          avatarType: ticket.offending_driver?.avatarType || "preset",
          avatarValue: ticket.offending_driver?.avatarValue || "black",
          tags: ticket.offending_driver?.tags || [],
        }}
      />,
    );
  };

  const onEditDecisionClick = (decision: DecisionsTable) => {
    return openModal(
      <EditDecision
        decisionId={decision.id}
        seasonId={seasonData.id}
        seasonName={seasonData.season_name}
        ticketNum={decision.ticket_num}
        offendingDriver={{
          id: decision.offending_driver_id,
          username: decision.offending_driver?.username || "Unknown",
          avatarType: decision.offending_driver?.avatarType || "preset",
          avatarValue: decision.offending_driver?.avatarValue || "black",
          tags: decision.offending_driver?.tags || [],
        }}
        incidentTitle={decision.incident_title}
        decisionSummary={decision.decision_summary}
        detailedReasoning={decision.detailed_reasoning}
      />,
    );
  };

  const onDeleteDecisionClick = (decisionId: string) => {
    return openModal(<DeleteDecision decisionId={decisionId} />);
  };

  return (
    <PanelLayout
      panelTitle="Steward Decisions"
      panelTitleIcon={<StewardIcon />}
      tabs={isStewardOrDirector ? TABS : undefined}
      onTabChange={handleTabChange}
    >
      {isStewardOrDirector ? (
        <>
          {activeTab === "For Review" ? (
            <>
              {isTicketsLoading ? (
                <LoadingMessage />
              ) : openTickets.length > 0 ? (
                openTickets.map((ticket) => (
                  <TicketMessage
                    key={ticket.id}
                    type="Report"
                    isStewardOrDirector={isStewardOrDirector}
                    ticketNum={ticket.ticket_id}
                    seasonName={seasonData.season_name}
                    eventName={ticket.eventName || "Unknown Event"}
                    sessionType={ticket.is_race_session ? "Race" : "Qualifying"}
                    driverPosition={ticket.driverPosition || 0}
                    createdAt={formatTimeAgo(ticket.created_at)}
                    reportingDriver={{
                      username: ticket.reporting_driver?.username || "Unknown",
                      avatarType:
                        ticket.reporting_driver?.avatarType || "preset",
                      avatarValue:
                        ticket.reporting_driver?.avatarValue || "black",
                      tags: ticket.reporting_driver?.tags || [],
                    }}
                    offendingDriver={{
                      username: ticket.offending_driver?.username || "Unknown",
                      avatarType:
                        ticket.offending_driver?.avatarType || "preset",
                      avatarValue:
                        ticket.offending_driver?.avatarValue || "black",
                      tags: ticket.offending_driver?.tags || [],
                    }}
                    handleViewClick={() => onViewClick(ticket)}
                    handleResolveClick={() => onResolveClick(ticket)}
                  />
                ))
              ) : (
                <EmptyMessage
                  title="No Tickets"
                  subtitle="There are no tickets for review."
                  hideIcon
                />
              )}
            </>
          ) : (
            <>
              {isDecisionsLoading ? (
                <LoadingMessage />
              ) : allDecisions.length > 0 ? (
                allDecisions.map((decision) => (
                  <TicketMessage
                    key={decision.id}
                    ticketNum={decision.ticket_num}
                    seasonName={seasonData.season_name}
                    incidentTitle={decision.incident_title}
                    decisionSummary={decision.decision_summary}
                    reasoning={decision.detailed_reasoning}
                    type={"Decision"}
                    eventName={decision.event_name}
                    sessionType={decision.session_type}
                    driverPosition={decision.driverPosition || 0}
                    createdAt={formatTimeAgo(decision.created_at)}
                    isStewardOrDirector={isStewardOrDirector}
                    offendingDriver={{
                      username:
                        decision.offending_driver?.username || "Steward",
                      avatarType:
                        decision.offending_driver?.avatarType || "preset",
                      avatarValue:
                        decision.offending_driver?.avatarValue || "black",
                      tags: decision.offending_driver?.tags || [],
                    }}
                    reportingDriver={{
                      username: decision.steward_info?.username || "Steward",
                      avatarType: decision.steward_info?.avatarType || "preset",
                      avatarValue:
                        decision.steward_info?.avatarValue || "black",
                      tags: decision.steward_info?.tags || [],
                    }}
                    handleEditClick={() => onEditDecisionClick(decision)}
                    handleDeleteClick={() => onDeleteDecisionClick(decision.id)}
                  />
                ))
              ) : (
                <EmptyMessage
                  title="No Decisions"
                  subtitle="There are no decisions yet."
                  hideIcon
                />
              )}
            </>
          )}
        </>
      ) : (
        <>
          {isDecisionsLoading ? (
            <LoadingMessage />
          ) : allDecisions.length > 0 ? (
            allDecisions.map((decision) => (
              <TicketMessage
                key={decision.id}
                type="Decision"
                isStewardOrDirector={isStewardOrDirector}
                ticketNum={decision.ticket_num}
                seasonName={seasonData.season_name}
                incidentTitle={decision.incident_title}
                decisionSummary={decision.decision_summary}
                reasoning={decision.detailed_reasoning}
                eventName={decision?.event_name || "Unknown Event"}
                sessionType={decision?.session_type || "Unknown"}
                driverPosition={decision?.driverPosition || 0}
                createdAt={formatTimeAgo(decision.created_at)}
                offendingDriver={{
                  username: decision.offending_driver?.username || "Unknown",
                  avatarType: decision.offending_driver?.avatarType || "preset",
                  avatarValue:
                    decision.offending_driver?.avatarValue || "black",
                  tags: decision.offending_driver?.tags || [],
                }}
                reportingDriver={{
                  username: decision.steward_info?.username || "Steward",
                  avatarType: decision.steward_info?.avatarType || "preset",
                  avatarValue: decision.steward_info?.avatarValue || "black",
                  tags: decision.steward_info?.tags || [],
                }}
                handleEditClick={() => onEditDecisionClick(decision)}
                handleDeleteClick={() => onDeleteDecisionClick(decision.id)}
              />
            ))
          ) : (
            <EmptyMessage
              title="No Decisions"
              subtitle="There are no decisions yet."
              hideIcon
            />
          )}
        </>
      )}
    </PanelLayout>
  );
};

export default Tickets;
