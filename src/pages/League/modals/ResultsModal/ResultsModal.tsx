import { useMemo, useState } from "react";
import SheetModal from "@/components/Sheets/SheetModal/SheetModal";
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import FilterBar from "@/components/Tabs/FilterBar/FilterBar";
import Table from "@/components/Tables/Table/Table";
import { useModal } from "@/providers/modal/useModal";
import SetupIcon from "@assets/Icon/Season_Setup.svg?react";
import { sortEventsByDate, sortRoundsByMostRecentEventDate } from "@/features/leagues/forms/Schedule/Schedule.util";
import DriverPerformance from "@/pages/League/modals/DriverPerformance/DriverPerformance";
import {
  useEvent,
  useEventSessionSettings,
  useEventsBySeason,
  useEventTrackDetails,
} from "@/rtkQuery/hooks/queries/useEvents";
import { useLeagueSeasonDivisions, useLeagueSeasonDivisionDrivers } from "@/rtkQuery/hooks/queries/useLeagueSeasonDivisions";
import { useGetResultsByEventId } from "@/rtkQuery/hooks/queries/useResults";
import { useRoundsBySeason } from "@/rtkQuery/hooks/queries/useRounds";
import type { SessionType } from "@/types/results.types";
import { formatEventDate } from "@/utils/dates";
import { isFastestLapOnlyRow, mergeFastestLapPointsForDisplay } from "@/utils/resultsDisplay";

interface ResultsModalProps {
  eventId: string;
  seasonId: string;
  seasonName: string;
}

const ResultsModal = ({ eventId, seasonId, seasonName }: ResultsModalProps) => {
  const { closeModal, openModal } = useModal();
  const [selectedDivisionId, setSelectedDivisionId] = useState("");
  const [selectedRoundId, setSelectedRoundId] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedSessionType, setSelectedSessionType] = useState<SessionType | "">("");

  const seasonDivisions = useLeagueSeasonDivisions(seasonId);
  const roundsBySeason = useRoundsBySeason(seasonId);
  const eventsBySeason = useEventsBySeason(seasonId);

  const divisionOptions = useMemo(
    () =>
      (seasonDivisions.data ?? []).map((division) => ({
        label: division.division_name,
        value: division.id,
      })),
    [seasonDivisions.data],
  );

  const allRounds = useMemo(
    () => sortRoundsByMostRecentEventDate(roundsBySeason.data ?? [], eventsBySeason.data ?? []),
    [roundsBySeason.data, eventsBySeason.data],
  );

  const allEvents = useMemo(
    () => sortEventsByDate(eventsBySeason.data ?? []),
    [eventsBySeason.data],
  );

  const initialEvent = useMemo(
    () => allEvents.find((event) => event.id === eventId),
    [allEvents, eventId],
  );

  const initialRound = useMemo(
    () => allRounds.find((round) => round.id === initialEvent?.round_id),
    [allRounds, initialEvent],
  );

  const effectiveDivisionId = useMemo(() => {
    if (
      selectedDivisionId
      && divisionOptions.some((division) => division.value === selectedDivisionId)
    ) {
      return selectedDivisionId;
    }

    if (initialEvent?.division_id) {
      return initialEvent.division_id;
    }

    return divisionOptions[0]?.value ?? "";
  }, [divisionOptions, initialEvent, selectedDivisionId]);

  const roundsForDivision = useMemo(
    () => {
      const filtered = allRounds.filter((round) => round.division_id === effectiveDivisionId);
      return sortRoundsByMostRecentEventDate(filtered, eventsBySeason.data ?? []);
    },
    [allRounds, effectiveDivisionId, eventsBySeason.data],
  );

  const roundOptions = useMemo(
    () => roundsForDivision.map((round) => ({ label: round.round_name, value: round.id })),
    [roundsForDivision],
  );

  const effectiveRoundId = useMemo(() => {
    if (selectedRoundId && roundsForDivision.some((round) => round.id === selectedRoundId)) {
      return selectedRoundId;
    }

    if (initialRound && initialRound.division_id === effectiveDivisionId) {
      return initialRound.id;
    }

    return roundsForDivision[0]?.id ?? "";
  }, [effectiveDivisionId, initialRound, roundsForDivision, selectedRoundId]);

  const eventsForRound = useMemo(
    () => {
      const filtered = allEvents.filter(
        (event) =>
          event.division_id === effectiveDivisionId
          && event.round_id === effectiveRoundId,
      );
      return sortEventsByDate(filtered);
    },
    [allEvents, effectiveDivisionId, effectiveRoundId],
  );

  const eventOptions = useMemo(
    () => eventsForRound.map((event) => ({ label: event.event_name, value: event.id })),
    [eventsForRound],
  );

  const effectiveEventId = useMemo(() => {
    if (selectedEventId && eventsForRound.some((event) => event.id === selectedEventId)) {
      return selectedEventId;
    }

    if (
      initialEvent
      && initialEvent.division_id === effectiveDivisionId
      && initialEvent.round_id === effectiveRoundId
    ) {
      return initialEvent.id;
    }

    return eventsForRound[0]?.id ?? "";
  }, [effectiveDivisionId, effectiveRoundId, eventsForRound, initialEvent, selectedEventId]);

  const { data: eventData } = useEvent(effectiveEventId);
  const { data: eventTrackDetails } = useEventTrackDetails(effectiveEventId);
  const eventSessionSettings = useEventSessionSettings(effectiveEventId);
  const resultsByEvent = useGetResultsByEventId(effectiveEventId);
  const divisionDrivers = useLeagueSeasonDivisionDrivers(effectiveDivisionId);

  const sessionOptions = useMemo(() => {
    const sessionSettings = eventSessionSettings.currentData;

    if (!sessionSettings) {
      return [] as Array<{ label: string; value: SessionType }>;
    }

    const options: Array<{ label: string; value: SessionType }> = [];

  const RESULT_TYPE_LABEL: Record<SessionType, string> = {
    qualifying: "Qualifying Session",
    race: "Race Session",
  };

    if (sessionSettings.has_qualifying) {
      options.push({
        label: RESULT_TYPE_LABEL.qualifying,
        value: "qualifying",
      });
    }

    if (sessionSettings.has_race) {
      options.push({
        label: RESULT_TYPE_LABEL.race,
        value: "race",
      });
    }

    return options;
  }, [eventSessionSettings.currentData]);

  const effectiveSessionType = useMemo<SessionType | undefined>(() => {
    if (selectedSessionType && sessionOptions.some((option) => option.value === selectedSessionType)) {
      return selectedSessionType;
    }

    // Prefer race session if available, otherwise use first available
    const raceOption = sessionOptions.find((option) => option.value === "race");
    return raceOption?.value ?? sessionOptions[0]?.value;
  }, [selectedSessionType, sessionOptions]);

  const driverById = useMemo(
    () =>
      new Map((divisionDrivers.currentData ?? []).map((driver) => [driver.id, driver] as const)),
    [divisionDrivers.currentData],
  );

  const selectedSessionResults = useMemo(
    () => {
      const sessionRows = (resultsByEvent.data ?? []).filter(
        (result) => result.session_type === effectiveSessionType,
      );

      return mergeFastestLapPointsForDisplay(sessionRows)
        .sort((left, right) => left.position - right.position);
    },
    [effectiveSessionType, resultsByEvent.data],
  );

  const fastestLapResults = useMemo(
    () =>
      (resultsByEvent.data ?? [])
        .filter((result) => result.session_type === effectiveSessionType)
        .filter((result) => isFastestLapOnlyRow(result)),
    [effectiveSessionType, resultsByEvent.data],
  );

  const selectedSessionLabel = useMemo(
    () => sessionOptions.find((option) => option.value === effectiveSessionType)?.label ?? "Results",
    [effectiveSessionType, sessionOptions],
  );

  const handleDriverClick = (driverId: string, driverName?: string, teamName?: string) => {
    closeModal();
    openModal(
      <DriverPerformance
        driverId={driverId}
        seasonId={seasonId}
        seasonName={seasonName}
        driverName={driverName}
        teamName={teamName}
      />,
    );
  };

  const filters =
    divisionOptions.length > 0
    || roundOptions.length > 0
    || eventOptions.length > 0
    || sessionOptions.length > 0 ? (
      <FilterBar
        divisions={divisionOptions}
        rounds={roundOptions}
        events={eventOptions}
        sessions={sessionOptions}
        selectedDivision={effectiveDivisionId}
        selectedRound={effectiveRoundId}
        selectedEvent={effectiveEventId}
        selectedSession={effectiveSessionType}
        onDivisionChange={(value) => {
          setSelectedDivisionId(value);
          setSelectedRoundId("");
          setSelectedEventId("");
          setSelectedSessionType("");
        }}
        onRoundChange={(value) => {
          setSelectedRoundId(value);
          setSelectedEventId("");
          setSelectedSessionType("");
        }}
        onEventChange={(value) => {
          setSelectedEventId(value);
          setSelectedSessionType("");
        }}
        onSessionChange={(value) => setSelectedSessionType(value as SessionType)}
      />
    ) : undefined;

  // -- Event Track and Date Details -- //
  const showTrack = eventTrackDetails?.reveal_track;
  const trackName = showTrack
    ? eventTrackDetails?.track_name
    : "Hidden Track";

  const showDate = eventData?.reveal_date;
  const eventDate =
    showDate && eventData?.event_date
      ? formatEventDate(
          eventData.event_date,
          eventData.event_time_zone ?? "UTC",
        )
      : "No Date Set";

  const listChildren = !effectiveSessionType ? (
    <EmptyMessage
      icon={<SetupIcon />}
      title="No Session"
      subtitle="No sessions are configured for this event yet."
    />
  ) : selectedSessionResults.length === 0 ? (
    <EmptyMessage
      icon={<SetupIcon />}
      title="No Results"
      subtitle="No results have been posted for this session yet."
    />
  ) : (
    <>
      <Table
        title={selectedSessionLabel}
        hidePoints={effectiveSessionType === "qualifying"}
        results={selectedSessionResults.map((result) => {
          const driver = driverById.get(result.driver_id);

          return {
            position: result.position,
            points: result.points ?? 0,
            time: result.time,
            type: "driver" as const,
            driver: {
              id: result.id,
              username: driver?.display_name ?? "Unknown Driver",
              avatarType: driver?.avatar_type ?? "preset",
              avatarValue: driver?.avatar_value ?? "black",
              teamName: result.team_name,
            },
            onClick: () =>
              handleDriverClick(
                result.driver_id,
                driver?.display_name,
                result.team_name,
              ),
          };
        })}
      />
      {fastestLapResults.length > 0 && (
        <Table
          title="Fastest Lap"
          hidePoints={effectiveSessionType === "qualifying"}
          results={fastestLapResults.map((result, index) => {
            const driver = driverById.get(result.driver_id);

            return {
              position: index,
              points: result.points ?? 0,
              time: result.time,
              type: "driver" as const,
              driver: {
                id: `fastest-lap-${result.id}`,
                username: driver?.display_name ?? "Unknown Driver",
                avatarType: driver?.avatar_type ?? "preset",
                avatarValue: driver?.avatar_value ?? "black",
                teamName: result.team_name,
              },
              onClick: () =>
                handleDriverClick(
                  result.driver_id,
                  driver?.display_name,
                  result.team_name,
                ),
            };
          })}
        />
      )}
    </>
  );

  return (
    <SheetModal
      id={"results"}
      seasonName={seasonName}
      header={"Session Results"}
      filters={filters}
      details={{
        title: trackName,
        information: eventDate,
      }}
      listChildren={listChildren}
      onClose={closeModal}
    />
  );
};

export default ResultsModal;
