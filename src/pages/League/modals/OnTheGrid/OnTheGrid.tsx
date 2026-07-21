import { useEffect, useMemo, useState } from "react";
import { navigate } from "@/app/navigation/navigation";
import SheetModal from "@/components/Sheets/SheetModal/SheetModal";
import FilterBar from "@/components/Tabs/FilterBar/FilterBar";
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import LoadingMessage from "@/components/Messages/LoadingMessage/LoadingMessage";
import Button from "@/components/Button/Button";
import MenuDropdown from "@/components/Dropdowns/MenuDropdown/MenuDropdown";
import ProfileIcon from "@assets/Icon/Profile.svg?react";
import MoreIcon from "@assets/Icon/More_Vertical.svg?react";
import {
  ColumnText,
  ExtraCell,
  ExtraColumn,
  NumberCell,
  NumberColumn,
  NumberText,
  ParticipantCell,
  ParticipantColumn,
  ParticipantHeader,
  TableBody,
  TableRow,
  TableWrapper,
} from "./OnTheGrid.styles";
import { useModal } from "@/providers/modal/useModal";
import { useLeagueSeasonDivisions, useLeagueSeasonDivisionDrivers, useLeagueSeasonDivisionTeams } from "@/rtkQuery/hooks/queries/useLeagueSeasonDivisions";
import { useRoundsBySeason } from "@/rtkQuery/hooks/queries/useRounds";
import { useEventsBySeason, useEventDrivers } from "@/rtkQuery/hooks/queries/useEvents";
import { sortRoundsByMostRecentEventDate, sortEventsByDate } from "@/features/leagues/forms/Schedule/Schedule.util";
import ReadOnlyInput from "@/components/Inputs/ReadOnlyInput/ReadOnlyInput";
import { formatEventDate } from "@/utils/dates";

type OnTheGridProps = {
  eventId: string;
  seasonId: string;
  seasonName: string;
};

const OnTheGrid = ({ eventId, seasonId, seasonName }: OnTheGridProps) => {
  const { closeModal } = useModal();

  const [selectedDivisionId, setSelectedDivisionId] = useState("");
  const [selectedRoundId, setSelectedRoundId] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

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
    [eventId, allEvents],
  );

  const initialRound = useMemo(
    () => allRounds.find((round) => round.id === initialEvent?.round_id),
    [initialEvent, allRounds],
  );

  const effectiveDivisionId = useMemo(() => {
    if (selectedDivisionId && divisionOptions.some((d) => d.value === selectedDivisionId)) {
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
    [effectiveDivisionId, allRounds, eventsBySeason.data],
  );

  const roundOptions = useMemo(
    () => roundsForDivision.map((round) => ({ label: round.round_name, value: round.id })),
    [roundsForDivision],
  );

  const effectiveRoundId = useMemo(() => {
    if (selectedRoundId && roundsForDivision.some((r) => r.id === selectedRoundId)) {
      return selectedRoundId;
    }
    if (initialRound && initialRound.division_id === effectiveDivisionId) {
      return initialRound.id;
    }
    return roundsForDivision[0]?.id ?? "";
  }, [effectiveDivisionId, initialRound, roundsForDivision, selectedRoundId]);

  const eventsForRound = useMemo(
    () => {
      const filtered = allEvents.filter((event) => event.round_id === effectiveRoundId);
      return sortEventsByDate(filtered);
    },
    [effectiveRoundId, allEvents],
  );

  const eventOptions = useMemo(
    () => eventsForRound.map((event) => ({ label: event.event_name, value: event.id })),
    [eventsForRound],
  );

  const effectiveEventId = useMemo(() => {
    if (selectedEventId && eventsForRound.some((e) => e.id === selectedEventId)) {
      return selectedEventId;
    }
    if (initialEvent && initialEvent.round_id === effectiveRoundId) {
      return initialEvent.id;
    }
    return eventsForRound[0]?.id ?? "";
  }, [effectiveRoundId, initialEvent, eventsForRound, selectedEventId]);

  const selectedEvent = useMemo(
    () => allEvents.find((event) => event.id === effectiveEventId),
    [allEvents, effectiveEventId],
  );

  const seasonDrivers = useLeagueSeasonDivisionDrivers(effectiveDivisionId);
  const divisionTeams = useLeagueSeasonDivisionTeams(effectiveDivisionId);
  const eventDrivers = useEventDrivers(effectiveEventId);

  const isLoading =
    seasonDivisions.isLoading ||
    roundsBySeason.isLoading ||
    eventsBySeason.isLoading ||
    seasonDrivers.isLoading ||
    divisionTeams.isLoading ||
    eventDrivers.isLoading;

  const teamsByIdMap = useMemo(
    () => new Map((divisionTeams.data ?? []).map((team) => [team.id, team.team_name] as const)),
    [divisionTeams.data],
  );

  type DriverRow = {
    profileId: string;
    displayName: string;
    avatarType: "preset" | "upload";
    avatarValue: string;
    teamName?: string;
  };

  const driverRows = useMemo((): DriverRow[] => {
    const drivers = seasonDrivers.data ?? [];
    const assigned = eventDrivers.data ?? [];

    return assigned.reduce<DriverRow[]>((acc, ed) => {
      const driver = drivers.find((d) => d.id === ed.season_driver_id);
      if (!driver) return acc;
      acc.push({
        profileId: driver.profile_id,
        displayName: driver.display_name ?? "Unknown Driver",
        avatarType: driver.avatar_type ?? "preset",
        avatarValue: driver.avatar_value ?? "black",
        teamName: driver.team_id ? teamsByIdMap.get(driver.team_id) : undefined,
      });
      return acc;
    }, []);
  }, [seasonDrivers.data, eventDrivers.data, teamsByIdMap]);

  useEffect(() => {
    if (!openMenuId) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("[data-actions-container='true']")) return;
      setOpenMenuId(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  const handleViewProfile = (profileId: string) => {
    closeModal();
    navigate(`/profile/${profileId}`);
  };

  const listChildren =
    isLoading ? (
      <LoadingMessage />
    ) : driverRows.length > 0 ? (
      <TableWrapper style={{ maxWidth: "640px" }}>
        <ParticipantHeader>
          <TableRow>
            <NumberColumn>
              <ColumnText>#</ColumnText>
            </NumberColumn>
            <ParticipantColumn>
              <ColumnText>Driver</ColumnText>
            </ParticipantColumn>
            <ExtraColumn />
          </TableRow>
        </ParticipantHeader>
        <TableBody>
          {driverRows.map((row, i) => (
            <TableRow key={row.profileId}>
              <NumberCell>
                <NumberText>{i + 1}</NumberText>
              </NumberCell>
              <ParticipantCell>
                <ReadOnlyInput
                  profile={{
                    username: row.displayName,
                    information: row.teamName,
                    avatarType: row.avatarType,
                    avatarValue: row.avatarValue,
                    size: "medium",
                  }}
                />
              </ParticipantCell>
              <ExtraCell data-actions-container="true" style={{ position: "relative" }}>
                {row.profileId && (
                  <Button
                    size="small"
                    color="base"
                    rounded
                    variant="ghost"
                    ariaLabel="row actions"
                    icon={{ left: <MoreIcon /> }}
                    onClick={() => setOpenMenuId((prev) => (prev === row.profileId ? null : row.profileId))}
                  />
                )}
                {openMenuId === row.profileId && row.profileId !== null && (
                  <MenuDropdown
                    type="text"
                    isStandAlone
                    options={[{ label: "View Profile", value: "view", icon: <ProfileIcon /> }]}
                    onSelect={() => {
                      setOpenMenuId(null);
                      handleViewProfile(row.profileId);
                    }}
                  />
                )}
              </ExtraCell>
            </TableRow>
          ))}
        </TableBody>
      </TableWrapper>
    ) : (
      <EmptyMessage
        icon={<ProfileIcon />}
        title="No Drivers"
        subtitle={
          effectiveEventId
            ? "No drivers have been assigned to this event yet."
            : "No events are available for this round yet."
        }
      />
    );

  const filters =
    divisionOptions.length > 0 || roundOptions.length > 0 || eventOptions.length > 0 ? (
      <FilterBar
        divisions={divisionOptions}
        rounds={roundOptions}
        events={eventOptions}
        sessions={[]}
        selectedDivision={effectiveDivisionId}
        selectedRound={effectiveRoundId}
        selectedEvent={effectiveEventId}
        onDivisionChange={(value) => {
          setSelectedDivisionId(value);
          setSelectedRoundId("");
          setSelectedEventId("");
        }}
        onRoundChange={(value) => {
          setSelectedRoundId(value);
          setSelectedEventId("");
        }}
        onEventChange={setSelectedEventId}
      />
    ) : undefined;

  const details = selectedEvent
    ? {
        title: selectedEvent.event_name,
        information: formatEventDate(selectedEvent.event_date, selectedEvent.event_time_zone ?? "UTC"),
      }
    : undefined;

  return (
    <SheetModal
      id={"league-on-the-grid-modal"}
      seasonName={seasonName}
      header={"On The Grid"}
      details={details}
      listChildren={listChildren}
      filters={filters}
      onClose={closeModal}
    />
  );
};

export default OnTheGrid;
