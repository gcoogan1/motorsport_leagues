import { useMemo, useState } from "react";
import SheetModal from "@/components/Sheets/SheetModal/SheetModal";
import FilterBar from "@/components/Tabs/FilterBar/FilterBar";
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import LoadingMessage from "@/components/Messages/LoadingMessage/LoadingMessage";
import EventDetails from "@/components/Structures/EventDetails/EventDetails";
import Icon from "@/components/Icon/Icon";
import DetailGroup from "@/components/Tables/DetailGroup/DetailGroup";
import PlaceholderImage from "@assets/Cars/Hidden.png";
import DetailsIcon from "@assets/Icon/Details.svg?react";
import TimerIcon from "@assets/Icon/Timer.svg?react";
import LapsIcon from "@assets/Icon/Laps.svg?react";
import { useModal } from "@/providers/modal/useModal";
import { useLeagueSeasonDivisions } from "@/rtkQuery/hooks/queries/useLeagueSeasonDivisions";
import { useRoundsBySeason } from "@/rtkQuery/hooks/queries/useRounds";
import { useEventsBySeason } from "@/rtkQuery/hooks/queries/useEvents";
import {
  sortEvents,
  sortRounds,
} from "@/features/leagues/forms/Schedule/Schedule.util";
import { formatEventDate } from "@/utils/dates";
import type { EventAdvancedSettingsTable } from "@/types/eventAdvancedSettings";
import type {
  EventCarDetailsTable,
  EventSessionSettingsTable,
} from "@/types/event.types";
import {
  WEATHER_SELECTION_OPTIONS,
  PRESET_WEATHER_OPTIONS,
  TIME_OF_DAY_OPTIONS,
  EQUAL_CONDITION_OPTIONS,
} from "@/lib/constants/timeWeatherSettings";
import {
  START_TYPE_OPTIONS,
  GRID_ORDER_OPTIONS,
  BOP_TUNING_OPTIONS,
  BOOST_OPTIONS,
  SLIPSTREAM_STRENGTH_OPTIONS,
  VISIBLE_DAMAGE_OPTIONS,
  MECHANICAL_DAMAGE_OPTIONS,
  GRIP_REDUCTION_OFF_TRACK_OPTIONS,
  REQ_TIRE_TYPE_CHANGE_OPTIONS,
  NITRO_OVERTAKE_USAGE_OPTIONS,
  SETTINGS_OPTIONS,
  TIRE_WEAR_RATE_FORMATTER,
  TIRE_WEAR_RATE_DEFAULT,
  FUEL_CONSUMPTION_RATE_FORMATTER,
  FUEL_CONSUMPTION_RATE_DEFAULT,
  REFUELING_SPEED_FORMATTER,
  REFUELING_SPEED_DEFAULT,
  INITIAL_FUEL_FORMATTER,
  INITIAL_FUEL_DEFAULT,
  FINISH_DELAY_FORMATTER,
  FINISH_DELAY_DEFAULT,
  MIN_NUM_STOPS_DEFAULT,
} from "@/lib/constants/raceSettings";
import {
  TIME_LIMIT_OPTIONS_DISPLAY,
  SLIPSTREAM_STRENGTH_QUAL_OPTIONS,
  QUALIFYING_CONTINUE_TIME_FORMATTER,
  QUALIFYING_CONTINUE_TIME_DEFAULT,
  TIRE_WEAR_RT_QUAL_FORMATTER,
  TIRE_WEAR_RT_QUAL_DEFAULT,
  FUEL_CONSUMPTION_RT_QUAL_FORMATTER,
  FUEL_CONSUMPTION_RT_QUAL_DEFAULT,
  INITIAL_FUEL_QUAL_FORMATTER,
  INITIAL_FUEL_QUAL_DEFAULT,
} from "@/lib/constants/qualifierSettings";
import {
  FILTER_BY_CATEGORY_OPTIONS,
  USABLE_TIRE_OPTIONS,
  USABLE_TIRE_WEAR_OPTIONS,
  REQUIRED_TIRE_TYPE_OPTIONS,
  NITROUS_OPTIONS,
  KART_USAGE_OPTIONS,
  ENGINE_SWAP_OPTIONS,
  TUNING_PARTS_OPTIONS,
  DRIVETRAIN_OPTIONS,
  ASPIRATION_OPTIONS,
  PP_LIMIT_FORMATTER,
  PP_LIMIT_DEFAULT,
  MAX_POWER_OUTPUT_FORMATTER,
  MAX_POWER_OUTPUT_DEFAULT,
  MIN_WEIGHT_FORMATTER,
  MIN_WEIGHT_DEFAULT,
  YEAR_LOWER_LIMIT_FORMATTER,
  YEAR_LOWER_LIMIT_DEFAULT,
  YEAR_UPPER_LIMIT_FORMATTER,
  YEAR_UPPER_LIMIT_DEFAULT,
} from "@/lib/constants/regulationSettings";
import {
  SHORTCUT_PENALTY_OPTIONS,
  WALL_COLLISION_PENALTY_OPTIONS,
  CORRECT_VEHICLE_COURSE_OPTIONS,
  CAR_COLLISION_PENALTY_OPTIONS,
  PIT_LANE_LINE_CUT_OPTIONS,
  GHOSTING_DURING_RACE_OPTIONS,
  FLAG_RULES_OPTIONS,
} from "@/lib/constants/penaltySettings";
import {
  COUNTERSTEERING_ASSIST_OPTIONS,
  ACTIVE_STABILITY_MANAGE_OPTIONS,
  DRIVING_LINE_ASSIST_OPTIONS,
  TRACTION_CONTROL_OPTIONS,
  ABS_OPTIONS,
  AUTO_DRIVE_OPTIONS,
} from "@/lib/constants/assistsSettings";
import type { CarCategory } from "@/types/cars.types";
import { ListContainer, GroupsGrid, EmptyText, EmptyContainer } from "./DetailsModal.styles";
import {
  formatValue,
  getLabelFromOptions,
  parseStringArrayField,
} from "./DetailsModal.util";

type DetailsModalProps = {
  eventId: string;
  seasonId: string;
  seasonName: string;
};

const DetailsModal = ({ eventId, seasonId, seasonName }: DetailsModalProps) => {
  const { closeModal } = useModal();

  // State for selected division, round, and event
  const [selectedDivisionId, setSelectedDivisionId] = useState("");
  const [selectedRoundId, setSelectedRoundId] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");

  // Fetch divisions, rounds, and events for the season
  const seasonDivisions = useLeagueSeasonDivisions(seasonId);
  const roundsBySeason = useRoundsBySeason(seasonId);
  const eventsBySeason = useEventsBySeason(seasonId);

  // Memoized options and selected values

  const divisionOptions = useMemo(
    () =>
      (seasonDivisions.data ?? []).map((division) => ({
        label: division.division_name,
        value: division.id,
      })),
    [seasonDivisions.data],
  );

  const allRounds = useMemo(
    () => sortRounds(roundsBySeason.data ?? []),
    [roundsBySeason.data],
  );

  const allEvents = useMemo(
    () => sortEvents(eventsBySeason.data ?? []),
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

  // Determine effective division, round, and event based on selection or initial values
  const effectiveDivisionId = useMemo(() => {
    if (
      selectedDivisionId &&
      divisionOptions.some((division) => division.value === selectedDivisionId)
    ) {
      return selectedDivisionId;
    }

    if (initialEvent?.division_id) {
      return initialEvent.division_id;
    }

    return divisionOptions[0]?.value ?? "";
  }, [divisionOptions, initialEvent, selectedDivisionId]);

  const isLoading = seasonDivisions.isLoading || roundsBySeason.isLoading || eventsBySeason.isLoading;

  const roundsForDivision = useMemo(
    () =>
      allRounds.filter((round) => round.division_id === effectiveDivisionId),
    [allRounds, effectiveDivisionId],
  );

  const roundOptions = useMemo(
    () =>
      roundsForDivision.map((round) => ({
        label: round.round_name,
        value: round.id,
      })),
    [roundsForDivision],
  );

  // Determine effective round based on selection or initial values, ensuring it belongs to the effective division
  const effectiveRoundId = useMemo(() => {
    if (
      selectedRoundId &&
      roundsForDivision.some((round) => round.id === selectedRoundId)
    ) {
      return selectedRoundId;
    }

    if (initialRound && initialRound.division_id === effectiveDivisionId) {
      return initialRound.id;
    }

    return roundsForDivision[0]?.id ?? "";
  }, [effectiveDivisionId, initialRound, roundsForDivision, selectedRoundId]);

  const eventsForRound = useMemo(
    () => allEvents.filter((event) => event.round_id === effectiveRoundId),
    [allEvents, effectiveRoundId],
  );

  const eventOptions = useMemo(
    () =>
      eventsForRound.map((event) => ({
        label: event.event_name,
        value: event.id,
      })),
    [eventsForRound],
  );

  // Determine effective event based on selection or initial values, ensuring it belongs to the effective round
  const effectiveEventId = useMemo(() => {
    if (
      selectedEventId &&
      eventsForRound.some((event) => event.id === selectedEventId)
    ) {
      return selectedEventId;
    }

    if (initialEvent && initialEvent.round_id === effectiveRoundId) {
      return initialEvent.id;
    }

    return eventsForRound[0]?.id ?? "";
  }, [effectiveRoundId, eventsForRound, initialEvent, selectedEventId]);

  const selectedEvent = useMemo(
    () => allEvents.find((event) => event.id === effectiveEventId),
    [allEvents, effectiveEventId],
  );

  const getSessionSettings = (
    settings?: EventSessionSettingsTable | EventSessionSettingsTable[] | null,
  ): EventSessionSettingsTable | undefined => {
    if (!settings) return undefined;
    return Array.isArray(settings) ? settings[0] : settings;
  };

  const getAdvancedSettings = (
    settings?: EventAdvancedSettingsTable | EventAdvancedSettingsTable[] | null,
  ): EventAdvancedSettingsTable | undefined => {
    if (!settings) return undefined;
    return Array.isArray(settings) ? settings[0] : settings;
  };

  const getCarDetails = (
    carDetails?: EventCarDetailsTable[] | EventCarDetailsTable | null,
  ): EventCarDetailsTable[] => {
    if (!carDetails) return [];
    return Array.isArray(carDetails) ? carDetails : [carDetails];
  };

  // Extracted session settings, advanced settings, and car details for the selected event
  const sessionSettings = getSessionSettings(
    selectedEvent?.event_session_settings,
  );
  const advancedSettings = getAdvancedSettings(
    selectedEvent?.event_advanced_settings,
  );
  const eventCars = getCarDetails(selectedEvent?.event_car_details);
  const hasQualifying = selectedEvent?.event_session_settings?.has_qualifying;
  const revealSession = selectedEvent?.event_session_settings?.reveal_session;

  const sessionLabels = useMemo(() => {
    if (!sessionSettings) return [];

    const sessions: Array<{ label: string; icon?: React.ReactNode }> = [];

    if (sessionSettings.has_qualifying  && revealSession) {
      const isQualTime = sessionSettings.qualifying_type === "time";
      sessions.push({
        label: isQualTime
          ? `${sessionSettings.qualifying_time ?? "Not Set"} Qualifier`
          : `${sessionSettings.qualifying_laps ?? "Not Set"} Lap Qualifier`,
        icon: (
          <Icon size="medium">{isQualTime ? <TimerIcon /> : <LapsIcon />}</Icon>
        ),
      });
    }

    if (sessionSettings.has_race && revealSession) {
      const isRaceTime = sessionSettings.race_type === "time";
      sessions.push({
        label: isRaceTime
          ? `${sessionSettings.race_time ?? "Not Set"} Race`
          : `${sessionSettings.race_laps ?? "Not Set"} Lap Race`,
        icon: (
          <Icon size="medium">{isRaceTime ? <TimerIcon /> : <LapsIcon />}</Icon>
        ),
      });
    }

    return sessions.length > 0 ? sessions : [];
  }, [sessionSettings, revealSession]);

  const eventDetailItems = useMemo(
    () =>
      eventCars.length > 0
        ? eventCars.map((car) => ({
            imageUrl: car.reveal_car ? car.car_image_url : PlaceholderImage,
            text: `${car.car_category.toUpperCase()} • ${car.reveal_car ? car.car_name : "Hidden"}`,
          }))
        : [{ imageUrl: PlaceholderImage, text: "STOCK • Hidden" }],
    [eventCars],
  );

  const carSelectionTitle = useMemo(() => {
    if (eventCars.length === 0) {
      return "Car Selection";
    }

    const count = eventCars.length;
    const carText = count === 1 ? "Car" : "Cars";

    const isSpecifiedCategory = eventCars.filter(
      (car) => car.car_selection === "Specified",
    );
    const isAssignedCategory = eventCars.filter(
      (car) => car.car_selection === "Assigned",
    );

    // Specified Cat.
    if (isSpecifiedCategory.length >= 1) {
      return `${count} Specified ${carText}`;
    }

    // Assigned Cat. (should only be 1 car max, but just in case)
    if (isAssignedCategory.length >= 1) {
      return "Assigned Car";
    }

    // Category in general (cars should all be the same category since Spec/Assigned should be filtered out at this point, but just in case)
    const categorySet = new Set(
      eventCars
        .map((car) => car.car_category)
        .filter((value): value is CarCategory => Boolean(value)),
    );

    if (categorySet.size === 1) {
      const [category] = Array.from(categorySet);
      return `${category.toUpperCase()} ${carText}`;
    }
    if (count === 0) {
      return "Car Selection";
    }

    return `${count} ${carText}`;
  }, [eventCars]);


  const showTrack = selectedEvent?.event_track_details?.reveal_track;
  const trackName = showTrack
    ? selectedEvent?.event_track_details?.track_name
    : "Hidden Track";
  const showDate = selectedEvent?.reveal_date;
  const eventDate =
    showDate && selectedEvent?.event_date
      ? formatEventDate(
          selectedEvent.event_date,
          selectedEvent.event_time_zone ?? "UTC",
        )
      : "No Date Set";
  const weatherSelection = getLabelFromOptions(
    WEATHER_SELECTION_OPTIONS,
    advancedSettings?.weather_selection,
  );
  const regulationCategory = getLabelFromOptions(
    FILTER_BY_CATEGORY_OPTIONS,
    advancedSettings?.filter_category,
  );
  const regulationTitle = regulationCategory
    ? `${regulationCategory} Regulation Settings`
    : "Regulation Settings";


  // Detail groups for the details table (weather/time settings, race settings, qualifier settings if applicable, regulation settings, penalty settings)
  const detailGroups = useMemo(
    () => [
      {
        title: `${weatherSelection}`,
        details: [
          {
            detailSetting: "Time of the Day",
            detailOption: getLabelFromOptions(
              TIME_OF_DAY_OPTIONS,
              advancedSettings?.time_of_day,
            ),
          },
          ...(advancedSettings?.equal_con_mode === "false" || advancedSettings?.weather_selection === "customWeatherSelection"
            ? [
                {
                detailSetting: "Variable Time Speed Rate",
                detailOption: advancedSettings?.variable_time_speed_rate
                  ? `${advancedSettings.variable_time_speed_rate}x`
                  : "Not Set",
              }
              ]
            : []),
          ...(advancedSettings?.weather_selection === "presetWeatherSelection"
            ? [
                {
                  detailSetting: "Equal Conditions Mode",
                  detailOption: getLabelFromOptions(
                    EQUAL_CONDITION_OPTIONS,
                    advancedSettings?.equal_con_mode,
                  ),
                },
              ]
            : []),
          ...(advancedSettings?.weather_selection === "presetWeatherSelection"
            ? [
                {
                  detailSetting: "Preset Weather",
                  detailOption: getLabelFromOptions(
                    PRESET_WEATHER_OPTIONS,
                    advancedSettings?.preset_weather,
                  ),
                },
              ]
            : [
                {
                  detailSetting: "Custom Weather",
                  detailOption: formatValue(advancedSettings?.custom_weather),
                },
              ]),
        ],
      },
      {
        title: "Race Settings",
        details: [
          {
            detailSetting: "Start Type",
            detailOption: getLabelFromOptions(
              START_TYPE_OPTIONS,
              advancedSettings?.start_type,
            ),
          },
          {
            detailSetting: "Grid Order",
            detailOption: getLabelFromOptions(
              GRID_ORDER_OPTIONS,
              advancedSettings?.grid_order,
            ),
          },
          {
            detailSetting: "BoP / Tuning Prohibited",
            detailOption: getLabelFromOptions(
              BOP_TUNING_OPTIONS,
              advancedSettings?.bop_tuning_prohibited,
            ),
          },
          {
            detailSetting: "Settings Options",
            detailOption: getLabelFromOptions(
              SETTINGS_OPTIONS,
              advancedSettings?.settings_options,
            ),
          },
          {
            detailSetting: "Boost",
            detailOption: getLabelFromOptions(
              BOOST_OPTIONS,
              advancedSettings?.boost,
            ),
          },
          {
            detailSetting: "Slipstream Strength",
            detailOption: getLabelFromOptions(
              SLIPSTREAM_STRENGTH_OPTIONS,
              advancedSettings?.slipstream_strength,
            ),
          },
          {
            detailSetting: "Visible Damage",
            detailOption: getLabelFromOptions(
              VISIBLE_DAMAGE_OPTIONS,
              advancedSettings?.visible_damage,
            ),
          },
          {
            detailSetting: "Mechanical Damage",
            detailOption: getLabelFromOptions(
              MECHANICAL_DAMAGE_OPTIONS,
              advancedSettings?.mechanical_damage,
            ),
          },
          {
            detailSetting: "Tire Wear Rate",
            detailOption: TIRE_WEAR_RATE_FORMATTER(advancedSettings?.tire_wear_rate ?? TIRE_WEAR_RATE_DEFAULT),
          },
          {
            detailSetting: "Fuel Consumption Rate",
            detailOption: FUEL_CONSUMPTION_RATE_FORMATTER(advancedSettings?.fuel_consumption_rate ?? FUEL_CONSUMPTION_RATE_DEFAULT),
          },
          {
            detailSetting: "Refueling Speed",
            detailOption: REFUELING_SPEED_FORMATTER(advancedSettings?.refueling_speed ?? REFUELING_SPEED_DEFAULT),
          },
          {
            detailSetting: "Initial Fuel",
            detailOption: INITIAL_FUEL_FORMATTER(advancedSettings?.initial_fuel ?? INITIAL_FUEL_DEFAULT),
          },
          {
            detailSetting: "Grip Reduction Off Track",
            detailOption: getLabelFromOptions(
              GRIP_REDUCTION_OFF_TRACK_OPTIONS,
              advancedSettings?.grip_reduction_off_track,
            ),
          },
          {
            detailSetting: "Race Finish Delay",
            detailOption: FINISH_DELAY_FORMATTER(advancedSettings?.race_finish_delay ?? FINISH_DELAY_DEFAULT),
          },
          {
            detailSetting: "Minimum No. of Pit Stops",
            detailOption: formatValue(advancedSettings?.min_num_stops ?? MIN_NUM_STOPS_DEFAULT),
          },
          {
            detailSetting: "Required Tire Type Change",
            detailOption: getLabelFromOptions(
              REQ_TIRE_TYPE_CHANGE_OPTIONS,
              advancedSettings?.req_tire_type_change,
            ),
          },
          {
            detailSetting: "Nitro / Overtaking System Usage Time Multiplier",
            detailOption: getLabelFromOptions(
              NITRO_OVERTAKE_USAGE_OPTIONS,
              advancedSettings?.nitro_overtake_usage,
            ),
          },
        ],
      },
      ...(hasQualifying
        ? [
            {
              title: "Qualifier Settings",
              details: [
                {
                  detailSetting: "Time Limit",
                  detailOption: getLabelFromOptions(
                    TIME_LIMIT_OPTIONS_DISPLAY,
                    advancedSettings?.time_limit,
                  ),
                },
                {
                  detailSetting: "Qualifying Continuation Time",
                  detailOption: QUALIFYING_CONTINUE_TIME_FORMATTER(advancedSettings?.qual_contin_time ?? QUALIFYING_CONTINUE_TIME_DEFAULT),
                },
                {
                  detailSetting: "Tire Wear Rate (Qualifier)",
                  detailOption: TIRE_WEAR_RT_QUAL_FORMATTER(advancedSettings?.tire_wear_rt_qual ?? TIRE_WEAR_RT_QUAL_DEFAULT),
                },
                {
                  detailSetting: "Fuel Consumption Rate (Qualifier)",
                  detailOption: FUEL_CONSUMPTION_RT_QUAL_FORMATTER(advancedSettings?.fuel_consumption_rt_qual ?? FUEL_CONSUMPTION_RT_QUAL_DEFAULT),
                },
                {
                  detailSetting: "Initial Fuel (Qualifier)",
                  detailOption: INITIAL_FUEL_QUAL_FORMATTER(advancedSettings?.initial_fuel_qual ?? INITIAL_FUEL_QUAL_DEFAULT),
                },
                {
                  detailSetting: "Slipstream Strength (Qualifier)",
                  detailOption: getLabelFromOptions(
                    SLIPSTREAM_STRENGTH_QUAL_OPTIONS,
                    advancedSettings?.slipstream_strength_qual,
                  ),
                },
              ],
            },
          ]
        : []),
      {
        title: `
${regulationTitle}
        `,
        details: [
          {
            detailSetting: "PP Limit",
            detailOption: PP_LIMIT_FORMATTER(advancedSettings?.pp_limit ?? PP_LIMIT_DEFAULT),
          },
          {
            detailSetting: "Max. Power Output",
            detailOption: MAX_POWER_OUTPUT_FORMATTER(advancedSettings?.max_power_output ?? MAX_POWER_OUTPUT_DEFAULT),
          },
          {
            detailSetting: "Minimum Weight",
            detailOption: MIN_WEIGHT_FORMATTER(advancedSettings?.min_weight ?? MIN_WEIGHT_DEFAULT),
          },
          {
            detailSetting: "Usable Tires",
            detailOption: getLabelFromOptions(
              USABLE_TIRE_OPTIONS,
              advancedSettings?.usable_tires,
            ),
          },
          {
            detailSetting: "Usable Tire & Types",
            detailOption:
              advancedSettings?.usable_tires_types?.length === 24 // FIX LATER
                ? "All"
                : parseStringArrayField(advancedSettings?.usable_tires_types)
                    .map((value) =>
                      getLabelFromOptions(USABLE_TIRE_WEAR_OPTIONS, value),
                    )
                    .join(", ") || "Not Set",
          },
          {
            detailSetting: "Required Tire Type",
            detailOption:
              parseStringArrayField(advancedSettings?.req_tire_type)
                .map((value) =>
                  getLabelFromOptions(REQUIRED_TIRE_TYPE_OPTIONS, value),
                )
                .join(", ") || "None",
          },
          {
            detailSetting: "Nitrous",
            detailOption: getLabelFromOptions(
              NITROUS_OPTIONS,
              advancedSettings?.nitrous,
            ),
          },
          {
            detailSetting: "Kart Usage",
            detailOption: getLabelFromOptions(
              KART_USAGE_OPTIONS,
              advancedSettings?.kart_usage,
            ),
          },
          {
            detailSetting: "Engine Swap",
            detailOption: getLabelFromOptions(
              ENGINE_SWAP_OPTIONS,
              advancedSettings?.engine_swap,
            ),
          },
          {
            detailSetting: "Tuning Parts",
            detailOption: getLabelFromOptions(
              TUNING_PARTS_OPTIONS,
              advancedSettings?.tuning_parts,
            ),
          },
          {
            detailSetting: "Year (Lower Limit)",
            detailOption: YEAR_LOWER_LIMIT_FORMATTER(advancedSettings?.year_lower_limit ?? YEAR_LOWER_LIMIT_DEFAULT),
          },
          {
            detailSetting: "Year (Upper Limit)",
            detailOption: YEAR_UPPER_LIMIT_FORMATTER(advancedSettings?.year_upper_limit ?? YEAR_UPPER_LIMIT_DEFAULT),
          },
          {
            detailSetting: "Drivetrain",
            detailOption: getLabelFromOptions(
              DRIVETRAIN_OPTIONS,
              advancedSettings?.drivetrain,
            ),
          },
          {
            detailSetting: "Aspiration",
            detailOption: getLabelFromOptions(
              ASPIRATION_OPTIONS,
              advancedSettings?.aspiration,
            ),
          },
        ],
      },
      {
        title: "Penalty Settings",
        details: [
          {
            detailSetting: "Shortcut Penalty",
            detailOption: getLabelFromOptions(
              SHORTCUT_PENALTY_OPTIONS,
              advancedSettings?.shortcut_penalty,
            ),
          },
          {
            detailSetting: "Wall Collision Penalty",
            detailOption: getLabelFromOptions(
              WALL_COLLISION_PENALTY_OPTIONS,
              advancedSettings?.wall_coll_penalty,
            ),
          },
          {
            detailSetting: "Correct Vehicle Course After Wall Collision",
            detailOption: getLabelFromOptions(
              CORRECT_VEHICLE_COURSE_OPTIONS,
              advancedSettings?.correct_vehicle_course,
            ),
          },
          {
            detailSetting: "Car Collision Penalty",
            detailOption: getLabelFromOptions(
              CAR_COLLISION_PENALTY_OPTIONS,
              advancedSettings?.car_coll_penalty,
            ),
          },
          {
            detailSetting: "Pit Lane Line-Cutting Penalty",
            detailOption: getLabelFromOptions(
              PIT_LANE_LINE_CUT_OPTIONS,
              advancedSettings?.pit_lane_line_cut_penalty,
            ),
          },
          {
            detailSetting: "Ghosting During Race",
            detailOption: getLabelFromOptions(
              GHOSTING_DURING_RACE_OPTIONS,
              advancedSettings?.ghosting_during_race,
            ),
          },
          {
            detailSetting: "Flag Rules",
            detailOption: getLabelFromOptions(
              FLAG_RULES_OPTIONS,
              advancedSettings?.flag_rules,
            ),
          },
        ],
      },
      {
        title: "Driving Options Limitations",
        details: [
          {
            detailSetting: "Countersteering Assist",
            detailOption: getLabelFromOptions(
              COUNTERSTEERING_ASSIST_OPTIONS,
              advancedSettings?.countersteering_assist,
            ),
          },
          {
            detailSetting: "Active Stability Management (ASM)",
            detailOption: getLabelFromOptions(
              ACTIVE_STABILITY_MANAGE_OPTIONS,
              advancedSettings?.active_stability_manage,
            ),
          },
          {
            detailSetting: "Driving Line Assist",
            detailOption: getLabelFromOptions(
              DRIVING_LINE_ASSIST_OPTIONS,
              advancedSettings?.driving_line_assist,
            ),
          },
          {
            detailSetting: "Traction Control",
            detailOption: getLabelFromOptions(
              TRACTION_CONTROL_OPTIONS,
              advancedSettings?.traction_control,
            ),
          },
          {
            detailSetting: "ABS",
            detailOption: getLabelFromOptions(
              ABS_OPTIONS,
              advancedSettings?.abs,
            ),
          },
          {
            detailSetting: "Auto-Drive",
            detailOption: getLabelFromOptions(
              AUTO_DRIVE_OPTIONS,
              advancedSettings?.auto_drive,
            ),
          },
        ],
      },
    ],
    [advancedSettings, weatherSelection, hasQualifying, regulationTitle],
  );

  const eventDetails = selectedEvent?.event_advanced_settings
  const showDetails = eventDetails && eventDetails?.reveal_advanced_settings


  const filters =
    divisionOptions.length > 0 ||
    roundOptions.length > 0 ||
    eventOptions.length > 0 ? (
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
        title: trackName ?? "Unknown Track",
        information: eventDate,
      }
    : undefined;

  const listChildren = isLoading ? (
    <LoadingMessage />
  ) : selectedEvent ? (
    <ListContainer>
      <EventDetails
        sessions={sessionLabels}
        sectionTitle={carSelectionTitle}
        items={eventDetailItems}
        fallbackText="Hidden"
      />

      <GroupsGrid>
        {showDetails ? detailGroups.map((group) => (
          <DetailGroup
            key={group.title}
            title={group.title}
            details={group.details}
          />
        )) : (
          <EmptyContainer>
            <EmptyText>Event Details Not Yet Revealed</EmptyText>
          </EmptyContainer>
        )}
      </GroupsGrid>
    </ListContainer>
  ) : (
    <EmptyMessage
      icon={<DetailsIcon />}
      title="No Event Details"
      subtitle="No events are available for this selection yet."
    />
  );

  return (
    <SheetModal
      id={"league-event-details-modal"}
      seasonName={seasonName ?? "Event Details"}
      header={"Event Details"}
      details={details}
      filters={filters}
      listChildren={listChildren}
      onClose={closeModal}
      fullScreen
    ></SheetModal>
  );
};

export default DetailsModal;
