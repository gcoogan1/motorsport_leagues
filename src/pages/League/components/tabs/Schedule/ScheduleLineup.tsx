import { useMemo, useState } from "react";
import { useModal } from "@/providers/modal/useModal";
import SetupIcon from "@assets/Icon/Season_Setup.svg?react";
import PlaceholderImage from "@assets/Graphics/Placeholder.svg";
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import type { LeagueSeasonTable, LeagueStatus } from "@/types/league.types";
import { LineupContainer } from "./ScheduleLineup.styles";
import SegmentedTab from "@/components/Tabs/SegmentedTabs/SegmentedTab";
import Round from "@/components/Structures/Round/Round";
import { useLeagueSeasonDivisions } from "@/rtkQuery/hooks/queries/useLeagueSeasonDivisions";
import { useEventsBySeason } from "@/rtkQuery/hooks/queries/useEvents";
import { useRoundsBySeason } from "@/rtkQuery/hooks/queries/useRounds";
import { formatEventDate } from "@/utils/dates";
import { sortEvents, sortRounds } from "@/features/leagues/forms/Schedule/Schedule.util";
import { buildDivisionOptions } from "./ScheduleLineup.utils";
import BriefingModal from "@/pages/League/modals/BriefingModal/BriefingModal";

type ScheduleProps = {
  seasonStatus: LeagueStatus;
  seasonData?: LeagueSeasonTable;
};

const formatActiveDivisionTabLabel = (label: string): string => {
  if (!label || label.toLowerCase() === "pre-q") {
    return label;
  }

  return `Division ${label}`;
};

const normalizeDivisionTabLabel = (label: string): string =>
  label.replace(/\s+division$/i, "");

const ScheduleLineup = ({ seasonStatus, seasonData }: ScheduleProps) => {
  const { openModal } = useModal();
  const [selectedDivisionLabel, setSelectedDivisionLabel] = useState("");
  const seasonDivisions = useLeagueSeasonDivisions(seasonData?.id);
  const roundsBySeason = useRoundsBySeason(seasonData?.id);
  const eventsBySeason = useEventsBySeason(seasonData?.id);

  // -- Memoized values to avoid unnecessary re-renders -- //

  const divisionOptions = useMemo(
    () => buildDivisionOptions(seasonDivisions.data),
    [seasonDivisions.data],
  );

  const activeDivisionLabel = useMemo(() => {
    const firstDivisionLabel = divisionOptions[0]?.label ?? "";

    if (!selectedDivisionLabel) {
      return firstDivisionLabel;
    }

    return divisionOptions.some((division) => division.label === selectedDivisionLabel)
      ? selectedDivisionLabel
      : firstDivisionLabel;
  }, [divisionOptions, selectedDivisionLabel]);

  const activeDivision = useMemo(
    () => divisionOptions.find((division) => division.label === activeDivisionLabel),
    [activeDivisionLabel, divisionOptions],
  );

  const rounds = useMemo(
    () =>
      sortRounds(roundsBySeason.data ?? []).filter(
        (round) => !activeDivision || round.division_id === activeDivision.value,
      ),
    [activeDivision, roundsBySeason.data],
  );

  const eventsByRoundId = useMemo(() => {
    const filteredEvents = sortEvents(eventsBySeason.data ?? []).filter(
      (event) => !activeDivision || event.division_id === activeDivision.value,
    );

    return filteredEvents.reduce<Record<string, typeof filteredEvents>>((groupedEvents, event) => {
      if (!groupedEvents[event.round_id]) {
        groupedEvents[event.round_id] = [];
      }

      groupedEvents[event.round_id].push(event);
      return groupedEvents;
    }, {});
  }, [activeDivision, eventsBySeason.data]);

  const roundCards = useMemo(
    () =>
      rounds.map((round) => ({
        roundId: round.id,
        roundName: round.round_name,
        cards: (eventsByRoundId[round.id] ?? []).map((event) => ({
          eventName: event.event_name,
          eventDate: formatEventDate(event.event_date),
          carImageUrls: [PlaceholderImage],
        })),
      })),
    [eventsByRoundId, rounds],
  );

  // -- Handlers -- //

  const openBriefingModal = (roundId: string) => {
    if (!seasonData) {
      return;
    }

    openModal(
      <BriefingModal
        roundId={roundId}
        seasonId={seasonData.id}
        seasonName={seasonData.season_name}
      />,
    );
  }

  return (
    <>
      {seasonStatus === "setup" ? (
        <EmptyMessage
          icon={<SetupIcon />}
          title="Coming Soon"
          subtitle="The latest Season of this League is being set up!"
        />
      ) : !seasonData ? (
        <EmptyMessage
          icon={<SetupIcon />}
          title="Empty Schedule"
          subtitle="No season schedule is available yet."
        />
      ) : (
        <LineupContainer $isEmpty={roundCards.length === 0}>
          {divisionOptions.length > 1 && (
            <SegmentedTab
              tabs={divisionOptions.map((division) => ({
                label:
                  division.label === activeDivisionLabel
                    ? formatActiveDivisionTabLabel(division.label)
                    : division.label,
              }))}
              activeTab={formatActiveDivisionTabLabel(activeDivisionLabel)}
              onChange={(tab) => setSelectedDivisionLabel(normalizeDivisionTabLabel(tab))}
            />
          )}

          {roundCards.length === 0 ? (
            <EmptyMessage
              icon={<SetupIcon />}
              title="Empty Schedule"
              subtitle="No events have been added just yet."
            />
          ) : (
            roundCards.map((round) => (
              <Round
                key={round.roundId}
                roundName={round.roundName}
                roundCards={round.cards}
                briefingButton={{
                  onClick: () => openBriefingModal(round.roundId)
                }}
              />
            ))
          )}
        </LineupContainer>
      )}
    </>
  );
};

export default ScheduleLineup;
