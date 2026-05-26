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
  useCreateEventMutation,
  useGetEventsByDivisionIdQuery,
} from "@/rtkQuery/API/eventApi";
import { useGetLeagueSeasonDivisionsQuery } from "@/rtkQuery/API/leagueApi";
import {
  useCreateRoundMutation,
  useGetRoundsByDivisionIdQuery,
} from "@/rtkQuery/API/roundApi";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import type { EventTable } from "@/types/event.types";
import type { LeagueSeasonTable } from "@/types/league.types";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { withMinDelay } from "@/utils/withMinDelay";
import { buildDivisionOptions } from "../Assignments/DriverAssignments/util/DriverAssignments.util";
import {
  getNextEventName,
  getNextRoundName,
  sortEvents,
  sortRounds,
} from "./Schedule.util";
import { formatEventDate } from "@/utils/dates";
import MenuDropdown from "@/components/Dropdowns/MenuDropdown/MenuDropdown";
import RenameRound from "../Edit/RenameRound/RenameRound";
import DeleteRound from "../../modals/core/DeleteRound/DeleteRound";
import { usePanel } from "@/providers/panel/usePanel";

type ScheduleProps = {
  seasonData: LeagueSeasonTable;
};


const Schedule = ({ seasonData }: ScheduleProps) => {
  const { openModal } = useModal();
  const { openPanel } = usePanel();
  const { showToast } = useToast();
  const [selectedDivisionId, setSelectedDivisionId] = useState("");
  const [openRoundMenuId, setOpenRoundMenuId] = useState<string | null>(null);
  const [openEventMenuId, setOpenEventMenuId] = useState<string | null>(null);
  const [isCreatingRound, setIsCreatingRound] = useState(false);
  const [creatingEventRoundId, setCreatingEventRoundId] = useState<string | null>(null);
  const dropdownContainerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const seasonDivisions = useGetLeagueSeasonDivisionsQuery(seasonData.id);
  const [createRound] = useCreateRoundMutation();
  const [createEvent] = useCreateEventMutation();

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

  const roundsByDivision = useGetRoundsByDivisionIdQuery(effectiveDivisionId, {
    skip: !effectiveDivisionId,
  });
  const eventsByDivision = useGetEventsByDivisionIdQuery(effectiveDivisionId, {
    skip: !effectiveDivisionId,
  });

  const rounds = useMemo(
    () => sortRounds(roundsByDivision.data ?? []),
    [roundsByDivision.data],
  );

  const eventsByRoundId = useMemo(() => {
    return sortEvents(eventsByDivision.data ?? []).reduce<Record<string, EventTable[]>>(
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

    try {
      setCreatingEventRoundId(roundId);

      await withMinDelay(
        createEvent({
          eventName,
          eventDate: new Date().toISOString(),
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

  const handleEventMenuAction = (eventId: string, action: "delete") => {
    console.log(`event:${action}`, eventId);
    setOpenEventMenuId(null);
  };

  const handleBriefingClick = (roundId: string) => {
    openPanel("BRIEFING", { roundId });
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

  const listChildren = (
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
                subtitle={formatEventDate(event.event_date)}
                numOfDrivers={0}
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
                          label: "Delete Event",
                          value: "delete",
                          icon: <DeleteIcon />,
                        },
                      ]}
                      onSelect={(value) => handleEventMenuAction(event.id, value as "delete")}
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