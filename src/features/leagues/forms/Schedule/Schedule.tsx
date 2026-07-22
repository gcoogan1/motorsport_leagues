import { useEffect, useMemo, useRef, useState } from "react";
import AddItem from "@/components/AddItem/AddItem";
import FormContainerBlock from "@/components/Forms/FormContainerBlock/FormContainerBlock";

import SheetForm from "@/components/Sheets/SheetForm/SheetForm";
import EventSchedule from "@/components/Structures/EventSchedule/EventSchedule";
import FilterBar from "@/components/Tabs/FilterBar/FilterBar";
import Button from "@/components/Button/Button";
import IconBriefing from "@assets/Icon/Briefing.svg?react";
import MoreVerticalIcon from "@assets/Icon/More_Vertical.svg?react";
import EditIcon from "@assets/Icon/Edit.svg?react";
import DeleteIcon from "@assets/Icon/Delete.svg?react";
import {
  useEventDriversByDivision,
  useEvents,
} from "@/rtkQuery/hooks/queries/useEvents";
import { useLeagueSeasonDivisions } from "@/rtkQuery/hooks/queries/useLeagueSeasonDivisions";
import { useCreateEvent } from "@/rtkQuery/hooks/mutations/useEventMutaion";
import { useCreateRound } from "@/rtkQuery/hooks/mutations/useRoundMutation";
import { useRounds } from "@/rtkQuery/hooks/queries/useRounds";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import type { EventTable, JoinedEventTable } from "@/types/event.types";
import type { LeagueSeasonTable } from "@/types/league.types";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { withMinDelay } from "@/utils/withMinDelay";
import { buildDivisionOptions } from "../Assignments/DriverAssignments/util/DriverAssignments.util";
import {
  getNextEventName,
  getNextRoundName,
  sortEvents,
  sortEventsByDate,
  sortRounds,
  sortRoundsByMostRecentEventDate,
} from "./Schedule.util";
import { formatEventDate } from "@/utils/dates";
import MenuDropdown from "@/components/Dropdowns/MenuDropdown/MenuDropdown";
import RenameRound from "../Edit/RenameRound/RenameRound";
import DeleteRound from "../../modals/core/DeleteRound/DeleteRound";
import { usePanel } from "@/providers/panel/usePanel";
import DeleteEvent from "../../modals/core/DeleteEvent/DeleteEvent";
import LoadingMessage from "@/components/Messages/LoadingMessage/LoadingMessage";

type ScheduleProps = {
  seasonData: LeagueSeasonTable;
  leagueTimezone?: string;
};


const Schedule = ({ seasonData, leagueTimezone }: ScheduleProps) => {
  const { openModal } = useModal();
  const { openPanel } = usePanel();
  const { showToast } = useToast();
  const [selectedDivisionId, setSelectedDivisionId] = useState("");
  const [openRoundMenuId, setOpenRoundMenuId] = useState<string | null>(null);
  const [openEventMenuId, setOpenEventMenuId] = useState<string | null>(null);
  const [isCreatingRound, setIsCreatingRound] = useState(false);
  const [creatingEventRoundId, setCreatingEventRoundId] = useState<string | null>(null);
  const dropdownContainerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const seasonDivisions = useLeagueSeasonDivisions(seasonData.id);
  const [createRound] = useCreateRound();
  const [createEvent] = useCreateEvent();
  
  // --- Effect to handle outside clicks for closing dropdown menus --- //
  useEffect(() => {
    const activeMenuId = openRoundMenuId ?? openEventMenuId;

    if (!activeMenuId) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent) => {
      const container = dropdownContainerRefs.current[activeMenuId];
      const target = event.target as Node;

      if (container && !container.contains(target)) {
        setOpenRoundMenuId(null);
        setOpenEventMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [openEventMenuId, openRoundMenuId]);

  // --- Memoized values for division options and effective division ID --- //

  const divisionOptions = useMemo(
    () => buildDivisionOptions(seasonDivisions.data),
    [seasonDivisions.data],
  );

  const effectiveDivisionId = useMemo(() => {
    const firstDivisionId = divisionOptions[0]?.value ?? "";

    if (!selectedDivisionId) {
      return firstDivisionId;
    }

    return divisionOptions.some((division) => division.value === selectedDivisionId)
      ? selectedDivisionId
      : firstDivisionId;
  }, [selectedDivisionId, divisionOptions]);

  const roundsByDivision = useRounds(effectiveDivisionId);
  const eventsByDivision = useEvents(effectiveDivisionId);
  const eventDriversByDivision = useEventDriversByDivision(effectiveDivisionId);

  const rounds = useMemo(() => {
    const sortedRounds = sortRounds(roundsByDivision.data ?? []);

    // Don't re-sort until events are actually loaded
    if (!eventsByDivision.data?.length) return sortedRounds;

    return sortRoundsByMostRecentEventDate(sortedRounds, eventsByDivision.data);
}, [roundsByDivision.data, eventsByDivision.data]);


  const eventsByRoundId = useMemo(() => {
    const sortedEvents = sortEvents(eventsByDivision.data ?? []);
    return sortEventsByDate(sortedEvents).reduce<Record<string, JoinedEventTable[]>>(
      (groupedEvents, event) => {
        if (!groupedEvents[event.round_id]) {
          groupedEvents[event.round_id] = [];
        }

        groupedEvents[event.round_id].push(event);
        return groupedEvents;
      },
      {},
    );
  }, [eventsByDivision.data]);

  const eventDriverCountByEventId = useMemo(
    () =>
      (eventDriversByDivision.data ?? []).reduce<Record<string, number>>((counts, eventDriver) => {
        counts[eventDriver.event_id] = (counts[eventDriver.event_id] ?? 0) + 1;
        return counts;
      }, {}),
    [eventDriversByDivision.data],
  );

  // --- Handlers --- //

  const handleAddRound = async () => {
    if (!effectiveDivisionId) {
      return;
    }

    const roundName = getNextRoundName(rounds);

    try {
      setIsCreatingRound(true);

      await withMinDelay(
        createRound({
          roundName,
          divisionId: effectiveDivisionId,
          seasonId: seasonData.id,
        }).unwrap(),
        500,
      );

      await roundsByDivision.refetch();

      showToast({
        usage: "success",
        message: `${roundName} added.`,
      });
    } catch {
      handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
    } finally {
      setIsCreatingRound(false);
    }
  };

  const handleAddEvent = async (roundId: string) => {
    if (!effectiveDivisionId) {
      return;
    }

    const roundEvents = eventsByRoundId[roundId] ?? [];
    const eventName = getNextEventName(roundEvents);
    const eventTimezone = leagueTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

    try {
      setCreatingEventRoundId(roundId);

      await withMinDelay(
        createEvent({
          eventName,
          // eventDate: new Date().toISOString(),
          eventTimeZone: eventTimezone,
          roundId,
          divisionId: effectiveDivisionId,
          seasonId: seasonData.id,
        }).unwrap(),
        500,
      );

      showToast({
        usage: "success",
        message: `${eventName} added.`,
      });
    } catch {
      handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
    } finally {
      setCreatingEventRoundId(null);
    }
  };

  const handleRoundMenuAction = (roundId: string, action: "rename" | "delete", currentRoundName?: string) => {
    if (action === "rename" && currentRoundName) {
      openModal(<RenameRound roundId={roundId} currentRoundName={currentRoundName} />);
    } else if (action === "delete") {
      openModal(<DeleteRound roundId={roundId} />);
    }
    setOpenRoundMenuId(null);
    return;
  };

  const handleEventMenuAction = (eventId: string, event: EventTable, action: "delete" | "settings" | "details" | "session_settings" | "advanced_settings") => {
    if (action === "delete") {
      openModal(<DeleteEvent eventId={eventId} />);
    } else if (action === "settings") {
      openPanel("EVENT_SETTINGS", { event });
    } else if (action === "details") {
      openPanel("TRACK_CAR_DETAILS", { eventId });
    } else if (action === "session_settings") {
      openPanel("SESSION_SETTINGS", { eventId });
    } else if (action === "advanced_settings") {
      openPanel("ADVANCED_SETTINGS", { eventId });
    }
    setOpenEventMenuId(null);
    return;
  };

  const handleBriefingClick = (roundId: string) => {
    openPanel("BRIEFING", { roundId });
  }

  const handleDriverGridClick = (eventId: string) => {
    openPanel("DRIVER_GRID", { eventId });
  }

  const divisionFilter = divisionOptions.length > 1 ? (
    <FilterBar
      divisions={divisionOptions}
      rounds={[]}
      events={[]}
      sessions={[]}
      selectedDivision={effectiveDivisionId}
      onDivisionChange={setSelectedDivisionId}
    />
  ) : undefined;


  const isLoading = seasonDivisions.isLoading || roundsByDivision.isLoading || eventsByDivision.isLoading;

  const listChildren = isLoading ? (
    <LoadingMessage />
  ) : (
    <>
      {rounds.map((round) => (
        <FormContainerBlock
          key={round.id}
          title={round.round_name}
          addItem={{
            label: creatingEventRoundId === round.id ? "Adding Event..." : "Add Event",
            onClick: () => {
              void handleAddEvent(round.id);
            },
          }}
          buttons={
            <>
              <Button size="small" color="base" rounded icon={{ left: <IconBriefing /> }} onClick={() => handleBriefingClick(round.id)}>{round.briefing ? "Edit" : "Add"} Briefing</Button>
              <div
                ref={(node) => {
                  dropdownContainerRefs.current[`round-${round.id}`] = node;
                }}
                style={{ position: "relative" }}
              >
                <Button
                  size="small"
                  color="base"
                  rounded
                  icon={{ left: <MoreVerticalIcon /> }}
                  onClick={() => {
                    setOpenEventMenuId(null);
                    setOpenRoundMenuId((currentMenuId) =>
                      currentMenuId === `round-${round.id}` ? null : `round-${round.id}`,
                    );
                  }}
                />
                {openRoundMenuId === `round-${round.id}` && (
                  <MenuDropdown
                    type={"text"}
                    isStandAlone={true}
                    options={[
                      {
                        label: "Rename Round",
                        value: "rename",
                        icon: <EditIcon />,
                      },
                      {
                        label: "Delete Round",  
                        value: "delete",
                        icon: <DeleteIcon />,
                      },
                    ]}
                    onSelect={(value) => handleRoundMenuAction(round.id, value as "rename" | "delete", round.round_name)}
                  />
                )}
              </div>
            </>
          }
        >
          <>
            {(eventsByRoundId[round.id] ?? []).map((event) => (
              <EventSchedule
                key={event.id}
                title={event.event_name}
                subtitle={event.event_date ? formatEventDate(event.event_date, event.event_time_zone) : "No Date Set"}
                numOfDrivers={eventDriverCountByEventId[event.id] ?? 0}
                onProfileClick={() => handleDriverGridClick(event.id)}
                onMoreClick={() => {
                  setOpenRoundMenuId(null);
                  setOpenEventMenuId((currentMenuId) =>
                    currentMenuId === `event-${event.id}` ? null : `event-${event.id}`,
                  );
                }}
                moreMenu={openEventMenuId === `event-${event.id}` ? (
                  <div
                    ref={(node) => {
                      dropdownContainerRefs.current[`event-${event.id}`] = node;
                    }}
                  >
                    <MenuDropdown
                      type={"text"}
                      isStandAlone={true}
                      options={[
                        {
                          label: "Event Settings",
                          value: "settings",
                          icon: <EditIcon />,
                        },
                        {
                          label: "Track & Driver Details",
                          value: "details",
                          icon: <EditIcon />,
                        },
                        {
                          label: "Session Settings",
                          value: "session_settings",
                          icon: <EditIcon />,
                        },
                        {
                          label: "Advanced Settings",
                          value: "advanced_settings",
                          icon: <EditIcon />,
                        },
                        {
                          label: "Delete Event",
                          value: "delete",
                          icon: <DeleteIcon />,
                        },
                      ]}
                      onSelect={(value) => handleEventMenuAction(event.id, event, value as "delete" | "settings" | "details" | "session_settings" | "advanced_settings")}
                    />
                  </div>
                ) : undefined}
              />
            ))}
          </>
        </FormContainerBlock>
      ))}
      <AddItem
        label={isCreatingRound ? "Adding Round..." : "Add Round"}
        onClick={handleAddRound}
      />
    </>
  );

  return (
    <SheetForm
      id={"schedule-form"}
      seasonName={seasonData.season_name}
      header={"Schedule Rounds"}
      filters={divisionFilter}
      listChildren={listChildren}
      hideSaveButton
    />
  );
};

export default Schedule;