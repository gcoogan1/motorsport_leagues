import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import FormModal from "@/components/Forms/FormModal/FormModal";
import { useCreateTicket } from "@/rtkQuery/hooks/mutations/useReportsMutation";
import FilterBar from "@/components/Tabs/FilterBar/FilterBar";
import ProfileSelectInput from "@/components/Inputs/ProfileSelectInput/ProfileSelectInput";
import RichTextEditor from "@/components/Inputs/RichTextEditor/RichTextEditor";
import { useLeagueSeasonDrivers, useLeagueSeasonTeams } from "@/rtkQuery/hooks/queries/useLeagueSeasons";
import { convertDriversToSelectOptions } from "@/utils/convertDriversToSelectOptions";
import type { RootState } from "@/store";
import { selectAllProfiles } from "@/store/profile/profile.selectors";
import {
  createTicketSchema,
  type CreateTicketSchema,
} from "./ReportIncidentModal.schema";
import { sortRounds, sortEventsByDate } from "../../Schedule/Schedule.util";
import { useLeagueSeasonDivisions } from "@/rtkQuery/hooks/queries/useLeagueSeasonDivisions";
import { useRoundsBySeason } from "@/rtkQuery/hooks/queries/useRounds";
import {
  useEvents,
  useEventSessionSettings,
} from "@/rtkQuery/hooks/queries/useEvents";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";

type ReportIncidentModalProps = {
  roundId: string;
  seasonId: string;
};

const ReportIncidentModal = ({
  roundId,
  seasonId,
}: ReportIncidentModalProps) => {
  const { openModal, closeModal } = useModal();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDivisionId, setSelectedDivisionId] = useState("");
  const [selectedRoundId, setSelectedRoundId] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedSessionType, setSelectedSessionType] = useState<
    "qualifying" | "race"
  >("race");

  // Mutations and queries
  const [createTicket] = useCreateTicket();
  const accountId = useSelector((state: RootState) => state?.account?.data?.id);
  const allProfiles = useSelector(selectAllProfiles);
  const { data: seasonDrivers } = useLeagueSeasonDrivers(seasonId);
  const { data: seasonTeams } = useLeagueSeasonTeams(seasonId);
  const seasonDivisions = useLeagueSeasonDivisions(seasonId);
  const roundsBySeason = useRoundsBySeason(seasonId);

  // Check if there are any teams in this season
  const hasTeams = useMemo(() => {
    return seasonTeams && seasonTeams.length > 0;
  }, [seasonTeams]);

  // Set profile select type based on whether teams exist
  const profileSelectType: "profile" | "driver" = hasTeams
    ? "profile"
    : "driver";

  // Get current user's profile IDs (account_id and profile_id are different)
  const myProfileIds = useMemo(() => {
    if (!accountId || !allProfiles) return [];
    return allProfiles
      .filter((profile) => profile?.account_id === accountId)
      .map((profile) => profile?.id)
      .filter(Boolean) as string[];
  }, [accountId, allProfiles]);

  // Filter season drivers to only those belonging to current user's profiles
  const mySeasonDrivers = useMemo(() => {
    if (!seasonDrivers || myProfileIds.length === 0) return [];
    const uniqueDriversByProfile = new Map<string, (typeof seasonDrivers)[number]>();

    seasonDrivers.forEach((driver) => {
      if (!myProfileIds.includes(driver.profile_id)) {
        return;
      }

      if (!uniqueDriversByProfile.has(driver.profile_id)) {
        uniqueDriversByProfile.set(driver.profile_id, driver);
      }
    });

    return [...uniqueDriversByProfile.values()];
  }, [seasonDrivers, myProfileIds]);

  const uniqueSeasonDrivers = useMemo(() => {
    if (!seasonDrivers) return [];

    const uniqueDriversByProfile = new Map<string, (typeof seasonDrivers)[number]>();

    seasonDrivers.forEach((driver) => {
      if (!uniqueDriversByProfile.has(driver.profile_id)) {
        uniqueDriversByProfile.set(driver.profile_id, driver);
      }
    });

    return [...uniqueDriversByProfile.values()];
  }, [seasonDrivers]);

  // Convert season divisions to select options (early to use in queries)
  const divisionOptions = useMemo(
    () =>
      (seasonDivisions.data ?? []).map((division) => ({
        label: division.division_name,
        value: division.id,
      })),
    [seasonDivisions.data],
  );

  // Convert my season drivers to select options (for reporting driver dropdown)
  const reportingDriverProfiles = useMemo(
    () => convertDriversToSelectOptions(mySeasonDrivers, seasonTeams),
    [mySeasonDrivers, seasonTeams],
  );

  // Convert all season drivers to select options (for offending driver dropdown)
  const profiles = useMemo(
    () => convertDriversToSelectOptions(uniqueSeasonDrivers, seasonTeams),
    [seasonTeams, uniqueSeasonDrivers],
  );

  // Sort rounds by their order within the season
  const rounds = useMemo(
    () => sortRounds(roundsBySeason.data ?? []),
    [roundsBySeason.data],
  );

  // Get the initial round based on the provided roundId
  const initialRound = useMemo(
    () => rounds.find((round) => round.id === roundId),
    [roundId, rounds],
  );

  // Get preliminary effective division for queries.
  // Prefer the selected division, then the round's division, then the first division.
  const preliminaryEffectiveDivisionId =
    selectedDivisionId || initialRound?.division_id || divisionOptions[0]?.value || "";

  // Now we can call the queries.
  const eventsByDivision = useEvents(preliminaryEffectiveDivisionId);

  // Determine the effective division id, prioritizing the selected division, then the initial round's division, and finally the first division option
  const effectiveDivisionId = useMemo(() => {
    if (
      selectedDivisionId &&
      divisionOptions.some((division) => division.value === selectedDivisionId)
    ) {
      return selectedDivisionId;
    }

    if (initialRound?.division_id) {
      return initialRound.division_id;
    }

    return divisionOptions[0]?.value ?? "";
  }, [divisionOptions, initialRound, selectedDivisionId]);

  // Get the rounds for the effective division
  const roundsForDivision = useMemo(
    () => rounds.filter((round) => round.division_id === effectiveDivisionId),
    [effectiveDivisionId, rounds],
  );

  // Convert the rounds for the effective division into select options
  const roundOptions = useMemo(
    () =>
      roundsForDivision.map((round) => ({
        label: round.round_name,
        value: round.id,
      })),
    [roundsForDivision],
  );

  // Determine the effective round id, prioritizing the selected round, then the initial round if it belongs to the effective division, and finally the first round for the effective division
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

  // Get events for the effective division and sort by date (oldest to newest)
  const eventsForDivision = useMemo(() => {
    const filtered = (eventsByDivision.data ?? []).filter(
      (event) => event.round_id === effectiveRoundId,
    );
    return sortEventsByDate(filtered);
  }, [eventsByDivision.data, effectiveRoundId]);

  // Convert events to select options
  const eventOptions = useMemo(
    () =>
      eventsForDivision.map((event) => ({
        label: event.event_name,
        value: event.id,
      })),
    [eventsForDivision],
  );

  // Determine the effective event id, using the first event if none is selected
  const effectiveEventId = useMemo(() => {
    if (
      selectedEventId &&
      eventsForDivision.some((event) => event.id === selectedEventId)
    ) {
      return selectedEventId;
    }
    return eventsForDivision[0]?.id ?? "";
  }, [eventsForDivision, selectedEventId]);

  // Fetch session settings for the effective event
  const eventSessionSettings = useEventSessionSettings(effectiveEventId);

  // Get available session types based on event session settings
  const sessionOptions = useMemo(() => {
    if (!eventSessionSettings.currentData) return [];

    const sessions = [];
    if (eventSessionSettings.currentData.has_qualifying) {
      sessions.push({ label: "Qualifying Session", value: "qualifying" });
    }
    if (eventSessionSettings.currentData.has_race) {
      sessions.push({ label: "Race Session", value: "race" });
    }
    return sessions;
  }, [eventSessionSettings.currentData]);

  // Derive the effective session — default to race if available, else first option
  const effectiveSessionType = useMemo(() => {
    if (sessionOptions.some((o) => o.value === selectedSessionType)) {
      return selectedSessionType;
    }
    const raceOption = sessionOptions.find((o) => o.value === "race");
    return raceOption?.value ?? sessionOptions[0]?.value ?? "";
  }, [sessionOptions, selectedSessionType]);

  // Form setup -- //
  const formMethods = useForm<CreateTicketSchema>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      offendingDriver: "",
      description: "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = formMethods;

  // -- Handlers -- //
  const handleOnCancel = () => {
    closeModal();
  };

  const handleOnSubmit = async (data: CreateTicketSchema) => {
    setIsLoading(true);
    try {
      await createTicket({
        divisionId: effectiveDivisionId,
        roundId,
        eventId: effectiveEventId,
        isRaceSession: effectiveSessionType === "race",
        offendingDriverId: data.offendingDriver,
        reportingDriverId: data.reportingDriver,
        seasonId,
        incidentDescription: data.description,
      }).unwrap();

      showToast({
        usage: "success",
        message: "Incident has been reported.",
      });
      closeModal();
    } catch {
      handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <FormModal
        question={"Report Incident"}
        helperMessage="Use this form to report an incident."
        onSubmit={handleSubmit(handleOnSubmit)}
        buttons={{
          onCancel: {
            label: "Cancel",
            action: handleOnCancel,
          },
          onContinue: {
            label: "Report",
            loading: isLoading,
            loadingText: "Loading...",
          },
        }}
      >
        <FilterBar
          divisions={divisionOptions}
          rounds={roundOptions}
          events={eventOptions}
          sessions={sessionOptions}
          selectedDivision={effectiveDivisionId}
          selectedRound={effectiveRoundId}
          selectedEvent={selectedEventId}
          selectedSession={effectiveSessionType}
          onDivisionChange={setSelectedDivisionId}
          onRoundChange={setSelectedRoundId}
          onEventChange={setSelectedEventId}
          onSessionChange={(session) =>
            setSelectedSessionType(session as "qualifying" | "race")
          }
          displayAsMobile={true}
        />
        {sessionOptions.length > 0 ? (
          <>
            <ProfileSelectInput
              name="reportingDriver"
              fieldLabel="Reporting Driver"
              type={profileSelectType}
              profiles={reportingDriverProfiles}
              placeholder="Select driver..."
              hasError={!!errors.reportingDriver}
              errorMessage={errors.reportingDriver?.message}
            />

            <ProfileSelectInput
              name="offendingDriver"
              fieldLabel="Offending Driver"
              type={profileSelectType}
              profiles={profiles}
              placeholder="Select driver..."
              hasError={!!errors.offendingDriver}
              errorMessage={errors.offendingDriver?.message}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  hasError={!!errors.description}
                  errorMessage={errors.description?.message}
                  label="Incident Description"
                  placeholder="Describe the incident with all the details..."
                  maxCharacters={2000}
                  showCount
                />
              )}
            />
          </>
        ) : (
          <EmptyMessage hideIcon title="No Sessions Available" subtitle="Incident reporting is only available for active sessions." />
        )}
      </FormModal>
    </FormProvider>
  );
};

export default ReportIncidentModal;
