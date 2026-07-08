import { useMemo, useState } from "react";
import {
  Controller,
  FormProvider,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import FormModal from "@/components/Forms/FormModal/FormModal";
import { useCreateTicket } from "@/rtkQuery/hooks/mutations/useReportsMutation";
import FilterBar from "@/components/Tabs/FilterBar/FilterBar";
import ProfileSelectInput from "@/components/Inputs/ProfileSelectInput/ProfileSelectInput";
import RichTextEditor from "@/components/Inputs/RichTextEditor/RichTextEditor";
import { useLeagueSeasonDrivers } from "@/rtkQuery/hooks/queries/useLeagueSeasons";
import { convertDriversToSelectOptions } from "@/utils/convertDriversToSelectOptions";
import {
  createTicketSchema,
  type CreateTicketSchema,
} from "./ReportIncident.schema";
import { sortRounds, sortEventsByDate } from "../../Schedule/Schedule.util";
import { useLeagueSeasonDivisions } from "@/rtkQuery/hooks/queries/useLeagueSeasonDivisions";
import { useRoundsBySeason } from "@/rtkQuery/hooks/queries/useRounds";
import { useEvents, useEventSessionSettings } from "@/rtkQuery/hooks/queries/useEvents";

type ReportIncidentModalProps = {
  roundId: string;
  seasonId: string;
};

const ReportIncidentModal = ({
  roundId,
  seasonId,
}: ReportIncidentModalProps) => {
  const { closeModal } = useModal();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDivisionId, setSelectedDivisionId] = useState("");
  const [selectedRoundId, setSelectedRoundId] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedSessionType, setSelectedSessionType] = useState<"qualifying" | "race" | "">("");

  // Mutations and queries
  const [createTicket] = useCreateTicket();
  const { data: seasonDrivers } = useLeagueSeasonDrivers(seasonId);
  const seasonDivisions = useLeagueSeasonDivisions(seasonId);
  const roundsBySeason = useRoundsBySeason(seasonId);

  // Convert season divisions to select options (early to use in queries)
  const divisionOptions = useMemo(
    () =>
      (seasonDivisions.data ?? []).map((division) => ({
        label: division.division_name,
        value: division.id,
      })),
    [seasonDivisions.data],
  );

  // Get preliminary effective division for queries
  const preliminaryEffectiveDivisionId = selectedDivisionId || divisionOptions[0]?.value || "";

  // Now we can call the queries
  const eventsByDivision = useEvents(preliminaryEffectiveDivisionId);
  
  // Get preliminary effective event id for queries (based on all events by division)
  const preliminaryEffectiveEventId = useMemo(() => {
    if (selectedEventId) return selectedEventId;
    return (eventsByDivision.data ?? [])[0]?.id ?? "";
  }, [eventsByDivision.data, selectedEventId]);

  const eventSessionSettings = useEventSessionSettings(preliminaryEffectiveEventId);

  // Convert season drivers to select options
  const profiles = useMemo(
    () => convertDriversToSelectOptions(seasonDrivers || []),
    [seasonDrivers],
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
  const eventsForDivision = useMemo(
    () => {
      const filtered = (eventsByDivision.data ?? []).filter((event) => event.round_id === effectiveRoundId);
      return sortEventsByDate(filtered);
    },
    [eventsByDivision.data, effectiveRoundId],
  );

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

  // Get available session types based on event session settings
  const sessionOptions = useMemo(() => {
    if (!eventSessionSettings.data) return [];
    
    const sessions = [];
    if (eventSessionSettings.data.has_qualifying) {
      sessions.push({ label: "Qualifying", value: "qualifying" });
    }
    if (eventSessionSettings.data.has_race) {
      sessions.push({ label: "Race", value: "race" });
    }
    return sessions;
  }, [eventSessionSettings.data]);

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
        isRaceSession: selectedSessionType === "race",
        driverId: data.offendingDriver,
        seasonId,
        incidentDescription: data.description,
      }).unwrap();
      
      showToast({
        usage: "success",
        message: "Incident report submitted successfully.",
      });
      closeModal();
    } catch {
      showToast({
        usage: "error",
        message: "Failed to submit incident report. Please try again.",
      });
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
          selectedSession={selectedSessionType}
          onDivisionChange={setSelectedDivisionId}
          onRoundChange={setSelectedRoundId}
          onEventChange={setSelectedEventId}
          onSessionChange={(session) => setSelectedSessionType(session as "qualifying" | "race" | "")}
        />
        <ProfileSelectInput
          name="offendingDriver"
          fieldLabel="Offending Driver"
          type={"profile"}
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
      </FormModal>
    </FormProvider>
  );
};

export default ReportIncidentModal;
