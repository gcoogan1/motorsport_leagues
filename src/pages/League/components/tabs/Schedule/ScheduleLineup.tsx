import { useMemo, useState } from "react";
import { useModal } from "@/providers/modal/useModal";
import SetupIcon from "@assets/Icon/Season_Setup.svg?react";
import PlaceholderImage from "@assets/Cars/Hidden.png";
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import type { LeagueSeasonTable, LeagueStatus } from "@/types/league.types";
import { LineupContainer } from "./ScheduleLineup.styles";
import SegmentedTab from "@/components/Tabs/SegmentedTabs/SegmentedTab";
import Round from "@/components/Structures/Round/Round";
import { useGetCarsQuery } from "@/rtkQuery/API/carsApi";
import { useLeagueSeasonDivisions } from "@/rtkQuery/hooks/queries/useLeagueSeasonDivisions";
import { useEventsBySeason } from "@/rtkQuery/hooks/queries/useEvents";
import { useRoundsBySeason } from "@/rtkQuery/hooks/queries/useRounds";
import { formatEventDate } from "@/utils/dates";
import { sortEvents, sortRounds } from "@/features/leagues/forms/Schedule/Schedule.util";
import { buildDivisionOptions } from "./ScheduleLineup.utils";
import BriefingModal from "@/pages/League/modals/BriefingModal/BriefingModal";
import OnTheGrid from "@/pages/League/modals/OnTheGrid/OnTheGrid";
import type { EventCarDetailsTable, EventTrackDetailsTable } from "@/types/event.types";

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

const getTrackDetails = (
  trackDetails?: EventTrackDetailsTable | EventTrackDetailsTable[] | null,
): EventTrackDetailsTable | undefined => {
  if (!trackDetails) {
    return undefined;
  }

  return Array.isArray(trackDetails) ? trackDetails[0] : trackDetails;
};

const getCarDetails = (
  carDetails?: EventCarDetailsTable[] | EventCarDetailsTable | null,
): EventCarDetailsTable[] => {
  if (!carDetails) {
    return [];
  }

  return Array.isArray(carDetails) ? carDetails : [carDetails];
};

const ScheduleLineup = ({ seasonStatus, seasonData }: ScheduleProps) => {
  const { openModal } = useModal();
  const [selectedDivisionLabel, setSelectedDivisionLabel] = useState("");
  const { data: carsData } = useGetCarsQuery();
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

  const carsById = useMemo(() => {
    const entries = (carsData ?? []).map((car) => [car.id, car] as const);
    return new Map(entries);
  }, [carsData]);

  const stockFallbackImage = useMemo(() => {
    const stockCar = (carsData ?? []).find((car) => car.car_category === "stock" && car.car_name === "hidden");
    console.log("Stock car details:", stockCar);
    return stockCar?.car_image_url || PlaceholderImage;
  }, [carsData]);

  const categoryImageByCategory = useMemo(() => {
    const map = new Map<string, string>();

    for (const car of carsData ?? []) {
      if (car.car_image_url && !map.has(car.car_category)) {
        map.set(car.car_category, car.car_image_url);
      }
    }

    return map;
  }, [carsData]);



  const roundCards = useMemo(
    () =>
      rounds.map((round) => ({
        roundId: round.id,
        roundName: round.round_name,
        cards: (eventsByRoundId[round.id] ?? []).map((event) => {
          const trackDetails = getTrackDetails(event.event_track_details);
          const eventCarDetails = getCarDetails(event.event_car_details);

          const cars =
            eventCarDetails.length > 0
              ? eventCarDetails.map((car) => {
                  const lookupCar = carsById.get(car.car_id);
                  const categoryFallbackImage =
                    categoryImageByCategory.get(car.car_category) || stockFallbackImage;
                  const resolvedImageUrl =
                    lookupCar?.car_image_url || car.car_image_url || categoryFallbackImage;
                  const label = `${car.car_category.toUpperCase()} · ${car.reveal_car === false ? "Hidden" : car.car_name || "Hidden"}`;
                  return {
                    imageUrl:
                      car.reveal_car === false
                        ? PlaceholderImage
                        : resolvedImageUrl,
                    label,
                  };
                })
              : [{ imageUrl: stockFallbackImage, label: "STOCK · Hidden" }];

          return {
            eventId: event.id,
            eventName: event.event_name,
            eventDate:
              !event.event_date || event.reveal_date === false
                ? "Date Not Set"
                : formatEventDate(
                    event.event_date,
                    event.event_time_zone ?? "UTC",
                  ),
            trackName:
              trackDetails?.reveal_track !== false && trackDetails?.track_name
                ? trackDetails.track_name
                : "Hidden track",
            carImageUrls: cars.map((car) => car.imageUrl),
            cars,
            revealCars: eventCarDetails.some((car) => car.reveal_car === true),
          };
        }),
      })),
    [carsById, categoryImageByCategory, eventsByRoundId, rounds, stockFallbackImage],
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

  const openOnTheGridModal = (eventId: string) => {
    if (!seasonData) {
      return;
    }

    openModal(
      <OnTheGrid
        eventId={eventId}
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
                roundCards={round.cards.map((card) => ({
                  ...card,
                  driversButton: {
                    onClick: () => openOnTheGridModal(card.eventId),
                  },
                }))}
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
