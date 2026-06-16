import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form";
import AddItem from "@/components/AddItem/AddItem";
import Button from "@/components/Button/Button";
import ProfileSelectInput from "@/components/Inputs/ProfileSelectInput/ProfileSelectInput";
import SheetForm from "@/components/Sheets/SheetForm/SheetForm";
import FilterBar from "@/components/Tabs/FilterBar/FilterBar";
import {
  ColumnText,
  DriverCell,
  DriverColumn,
  ExtraCell,
  ExtraColumn,
  PCell,
  PComlumn,
  PointsCell,
  PointsColumn,
  PText,
  ResultHeader,
  TableBody,
  TableRow,
  TableWrapper,
  TimeCell,
  TimeColumn,
} from "@/components/Tables/InputTable/InputTable.styles";
import RemoveIcon from "@assets/Icon/Remove.svg?react";
import { sortEvents, sortRounds } from "@/features/leagues/forms/Schedule/Schedule.util";
import NoDrivers from "@/features/leagues/modals/errors/NoDrivers/NoDrivers";
import TextInput from "@/components/Inputs/TextInput/TextInput";
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import { useEventSessionSettings, useEvents } from "@/rtkQuery/hooks/queries/useEvents";
import { useLeagueSeasonDivisions, useLeagueSeasonDivisionDrivers } from "@/rtkQuery/hooks/queries/useLeagueSeasonDivisions";
import { useGetResultBySessionId } from "@/rtkQuery/hooks/queries/useResults";
import { useCreateResult, useDeleteResult, useUpdateResult } from "@/rtkQuery/hooks/mutations/useResultMutation";
import { useRounds } from "@/rtkQuery/hooks/queries/useRounds";
import type { LeagueSeasonTable } from "@/types/league.types";
import type { CreateResultsPayload, SessionType } from "@/types/results.types";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { withMinDelay } from "@/utils/withMinDelay";
import { SESSION_TYPE_LABEL, type ResultsFormValues, type ResultFormRow, RESULT_TABLE_STYLE } from "./Results.util";
import RaceTimeInput from "@/components/Inputs/RaceTimeInput/RaceTimeInput";

type ResultsProps = {
  seasonData: LeagueSeasonTable;
  onDirtyChange?: (isDirty: boolean) => void;
};


const Results = ({ seasonData, onDirtyChange }: ResultsProps) => {
  const { openModal } = useModal();
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [selectedDivisionId, setSelectedDivisionId] = useState("");
  const [selectedRoundId, setSelectedRoundId] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedSessionType, setSelectedSessionType] = useState<SessionType | "">("");
  const loadedSessionKey = useRef("");

  const seasonDivisions = useLeagueSeasonDivisions(seasonData.id);

  // -- Division Options -- //
  const divisionOptions = useMemo(
    () =>
      (seasonDivisions.data ?? []).map((division) => ({
        label: division.division_name,
        value: division.id,
      })),
    [seasonDivisions.data],
  );

  const effectiveDivisionId = useMemo(() => {
    if (!selectedDivisionId) {
      return divisionOptions[0]?.value ?? "";
    }

    return divisionOptions.some((option) => option.value === selectedDivisionId)
      ? selectedDivisionId
      : (divisionOptions[0]?.value ?? "");
  }, [divisionOptions, selectedDivisionId]);

  const roundsByDivision = useRounds(effectiveDivisionId);
  const eventsByDivision = useEvents(effectiveDivisionId);
  const seasonDriversByDivision = useLeagueSeasonDivisionDrivers(effectiveDivisionId);

  // -- Rounds for the Selected Division -- //
  const rounds = useMemo(
    () => sortRounds(roundsByDivision.currentData ?? []),
    [roundsByDivision.currentData],
  );

  const roundOptions = useMemo(
    () => rounds.map((round) => ({ label: round.round_name, value: round.id })),
    [rounds],
  );

  const effectiveRoundId = useMemo(() => {
    if (!selectedRoundId) {
      return roundOptions[0]?.value ?? "";
    }

    return roundOptions.some((option) => option.value === selectedRoundId)
      ? selectedRoundId
      : (roundOptions[0]?.value ?? "");
  }, [roundOptions, selectedRoundId]);

  // -- Events for the Selected Round -- //
  const eventsForRound = useMemo(
    () =>
      sortEvents(eventsByDivision.currentData ?? []).filter(
        (event) => event.round_id === effectiveRoundId,
      ),
    [effectiveRoundId, eventsByDivision.currentData],
  );

  const eventOptions = useMemo(
    () => eventsForRound.map((event) => ({ label: event.event_name, value: event.id })),
    [eventsForRound],
  );

  const effectiveEventId = useMemo(() => {
    if (!selectedEventId) {
      return eventOptions[0]?.value ?? "";
    }

    return eventOptions.some((option) => option.value === selectedEventId)
      ? selectedEventId
      : (eventOptions[0]?.value ?? "");
  }, [eventOptions, selectedEventId]);

  // -- Event Session Settings For the Selected Event -- //
  const eventSessionSettings = useEventSessionSettings(effectiveEventId);

  const sessionOptions = useMemo(() => {
    const sessionSettings = eventSessionSettings.currentData;

    if (!sessionSettings) {
      return [] as Array<{ label: string; value: SessionType }>;
    }

    const options: Array<{ label: string; value: SessionType }> = [];

    if (sessionSettings.has_qualifying) {
      options.push({
        label: SESSION_TYPE_LABEL.qualifying,
        value: "qualifying",
      });
    }

    if (sessionSettings.has_race) {
      options.push({
        label: SESSION_TYPE_LABEL.race,
        value: "race",
      });
    }

    return options;
  }, [eventSessionSettings.currentData]);

  const effectiveSessionType = useMemo<SessionType | undefined>(() => {
    if (!selectedSessionType) {
      return sessionOptions[0]?.value;
    }

    return sessionOptions.some((option) => option.value === selectedSessionType)
      ? selectedSessionType
      : sessionOptions[0]?.value;
  }, [selectedSessionType, sessionOptions]);

  const effectiveSessionId = useMemo(
    () => eventSessionSettings.currentData?.id ?? "",
    [eventSessionSettings.currentData?.id],
  );

  // -- Determine Visibility of Points Column -- //
  const pointsVisible = effectiveSessionType === "race";

  // -- Results for the Selected Session -- //
  const resultsBySession = useGetResultBySessionId(effectiveSessionId);
  const [createResult] = useCreateResult();
  const [updateResult] = useUpdateResult();
  const [deleteResult] = useDeleteResult();

  // -- Form Methods -- //

  const formMethods = useForm<ResultsFormValues>({
    defaultValues: {
      results: [],
      fastestLap: [],
    },
  });

  const {
    control,
    getValues,
    reset,
    formState: { isDirty },
  } = formMethods;

  const {
    fields: resultFields,
    append: appendResult,
    remove: removeResult,
  } = useFieldArray({
    control,
    name: "results",
  });

  const {
    fields: fastestLapFields,
    append: appendFastestLap,
    remove: removeFastestLap,
  } = useFieldArray({
    control,
    name: "fastestLap",
  });

  // -- Watched Form Values -- //
  const watchedResults = useWatch({ control, name: "results" }) ?? [];
  const watchedFastestLap = useWatch({ control, name: "fastestLap" }) ?? [];

  // -- Reset Result Form -- //
  const resetResultForm = useCallback(() => {
    loadedSessionKey.current = "";
    reset({ results: [], fastestLap: [] }, { keepDirty: false, keepTouched: false });
  }, [reset]);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    setSelectedRoundId("");
    setSelectedEventId("");
    setSelectedSessionType("");
    resetResultForm();
  }, [effectiveDivisionId, resetResultForm]);

  useEffect(() => {
    setSelectedEventId("");
    setSelectedSessionType("");
    resetResultForm();
  }, [effectiveRoundId, resetResultForm]);

  useEffect(() => {
    setSelectedSessionType("");
    resetResultForm();
  }, [effectiveEventId, resetResultForm]);

  useEffect(() => {
    if (!effectiveSessionId || !effectiveSessionType) {
      resetResultForm();
      return;
    }

    const sessionKey = `${effectiveSessionId}:${effectiveSessionType}`;

    if (loadedSessionKey.current !== sessionKey) {
      reset({ results: [], fastestLap: [] }, { keepDirty: false, keepTouched: false });
    }
  }, [effectiveSessionId, effectiveSessionType, reset, resetResultForm]);

  useEffect(() => {
    if (!effectiveSessionId || !effectiveSessionType) {
      loadedSessionKey.current = "";
      reset({ results: [], fastestLap: [] }, { keepDirty: false, keepTouched: false });
      return;
    }

    if (!resultsBySession.currentData) {
      return;
    }

    const sessionKey = `${effectiveSessionId}:${effectiveSessionType}`;

    if (loadedSessionKey.current === sessionKey) {
      return;
    }

    const mappedRows = (resultsBySession.currentData ?? [])
      .filter((result) => result.session_type === effectiveSessionType)
      .filter((result) => !result.fastest_lap)
      .sort((left, right) => left.position - right.position)
      .map((result) => ({
        resultId: result.id,
        driverId: result.driver_id,
        time: result.time || "0:00.000",
        points: String(result.points ?? 0),
      }));

    const mappedFastestLap = (resultsBySession.currentData ?? [])
      .filter((result) => result.session_type === effectiveSessionType)
      .filter((result) => result.fastest_lap)
      .slice(0, 1)
      .map((result) => ({
        resultId: result.id,
        driverId: result.driver_id,
        time: result.time || "0:00.000",
        points: String(result.points ?? 0),
      }));

    reset(
      {
        results: mappedRows,
        fastestLap: mappedFastestLap,
      },
      { keepDirty: false, keepTouched: false },
    );
    loadedSessionKey.current = sessionKey;
  }, [effectiveSessionId, effectiveSessionType, reset, resultsBySession.currentData]);

  // -- Driver Options -- //
  const driverOptions = useMemo(
    () =>
      (seasonDriversByDivision.currentData ?? []).map((driver) => ({
        label: driver.display_name ?? "Unknown Driver",
        value: driver.id,
        secondaryInfo: driver.game_type,
        avatar: {
          avatarType: driver.avatar_type ?? "preset",
          avatarValue: driver.avatar_value ?? "black",
        },
      })),
    [seasonDriversByDivision.currentData],
  );

  const driverOptionById = useMemo(
    () => new Map(driverOptions.map((option) => [option.value, option])),
    [driverOptions],
  );

  const getSelectedDriverSet = (excludeIndex?: number) =>
    new Set(
      watchedResults
        .map((row, index) => (index === excludeIndex ? "" : (row?.driverId ?? "")))
        .filter(Boolean),
    );

  const getResultDriverOptionsForRow = (rowIndex: number) => {
    const selected = getSelectedDriverSet(rowIndex);
    const current = watchedResults[rowIndex]?.driverId;

    const filtered = driverOptions.filter(
      (option) => option.value === current || !selected.has(option.value),
    );

    const currentOption = current ? driverOptionById.get(current) : undefined;

    if (currentOption && !filtered.some((option) => option.value === currentOption.value)) {
      return [currentOption, ...filtered];
    }

    return filtered;
  };

  const getFastestLapDriverOptions = () => {
    const current = watchedFastestLap[0]?.driverId;
    const currentOption = current ? driverOptionById.get(current) : undefined;
    const selected = getSelectedDriverSet();

    if (currentOption && !selected.has(currentOption.value)) {
      return [currentOption, ...driverOptions];
    }

    return driverOptions;
  };

  const findNextAvailableDriver = (): string | null => {
    const selected = getSelectedDriverSet();
    const next = driverOptions.find((option) => !selected.has(option.value));
    return next?.value ?? null;
  };

  // -- Append Result Rows -- //
  const appendNextResult = () => {
    const nextDriverId = findNextAvailableDriver();

    if (!nextDriverId) {
      openModal(<NoDrivers />);
      return;
    }

    appendResult({
      driverId: nextDriverId,
      time: "0:00.000",
      points: "0",
    });
  };

  const appendFastestLapRow = () => {
    if (fastestLapFields.length > 0) {
      return;
    }

    appendFastestLap({
      driverId: watchedResults[0]?.driverId ?? driverOptions[0]?.value ?? "",
      time: "0:00.000",
      points: "0",
    });
  };

  // -- Ensure Session Selected -- //
  const ensureSessionSelected = () => {
    const hasSessionOptions = sessionOptions.length > 0;
    const hasSelectedSession = Boolean(effectiveSessionId && effectiveSessionType);

    if (hasSessionOptions && hasSelectedSession) {
      return true;
    }

    showToast({
      usage: "error",
      message: "Select a session before adding results.",
    });

    return false;
  };

  // -- Build Payload for Result Row -- //
  const buildPayload = (
    row: ResultFormRow,
    position: number,
    fastestLap: boolean,
  ): CreateResultsPayload | null => {
    if (!effectiveDivisionId || !effectiveRoundId || !effectiveEventId || !effectiveSessionId || !effectiveSessionType) {
      return null;
    }

    if (!row.driverId) {
      return null;
    }

    return {
      division_id: effectiveDivisionId,
      round_id: effectiveRoundId,
      event_id: effectiveEventId,
      event_name: eventsForRound.find((event) => event.id === effectiveEventId)?.event_name ?? "",
      session_id: effectiveSessionId,
      session_type: effectiveSessionType,
      position,
      time: row.time || "0:00.000",
      points: pointsVisible ? Number(row.points || 0) : 0,
      driver_id: row.driverId,
      fastest_lap: fastestLap,
    };
  };

  // -- Handlers -- //

  const handleSave = async () => {
    if (!ensureSessionSelected()) {
      return;
    }

    if (!effectiveDivisionId || !effectiveRoundId || !effectiveEventId || !effectiveSessionId || !effectiveSessionType) {
      return;
    }

    const currentResults = (getValues("results") ?? []).filter((row) => row.driverId);
    const currentFastestLap = (getValues("fastestLap") ?? []).slice(0, 1).filter((row) => row.driverId);
    const persisted = (resultsBySession.currentData ?? []).filter(
      (result) => result.session_type === effectiveSessionType,
    );

    const persistedById = new Map(persisted.map((result) => [result.id, result]));
    const currentResultIds = new Set(
      [
        ...currentResults.map((row) => row.resultId).filter(Boolean),
        ...currentFastestLap.map((row) => row.resultId).filter(Boolean),
      ] as string[],
    );

    const idsToDelete = persisted
      .filter((result) => !currentResultIds.has(result.id))
      .map((result) => result.id);

    const creates: CreateResultsPayload[] = [];
    const updates: Array<{ id: string; payload: Partial<CreateResultsPayload> }> = [];

    currentResults.forEach((row, index) => {
      const payload = buildPayload(row, index + 1, false);

      if (!payload) {
        return;
      }

      if (!row.resultId) {
        creates.push(payload);
        return;
      }

      const persistedResult = persistedById.get(row.resultId);

      if (!persistedResult) {
        creates.push(payload);
        return;
      }

      const hasChanged =
        persistedResult.driver_id !== payload.driver_id ||
        persistedResult.time !== payload.time ||
        persistedResult.points !== payload.points ||
        persistedResult.position !== payload.position ||
        persistedResult.fastest_lap !== payload.fastest_lap ||
        persistedResult.session_id !== payload.session_id ||
        persistedResult.session_type !== payload.session_type;

      if (hasChanged) {
        updates.push({ id: row.resultId, payload });
      }
    });

    currentFastestLap.forEach((row) => {
      const payload = buildPayload(row, 0, true);

      if (!payload) {
        return;
      }

      if (!row.resultId) {
        creates.push(payload);
        return;
      }

      const persistedResult = persistedById.get(row.resultId);

      if (!persistedResult) {
        creates.push(payload);
        return;
      }

      const hasChanged =
        persistedResult.driver_id !== payload.driver_id ||
        persistedResult.time !== payload.time ||
        persistedResult.points !== payload.points ||
        persistedResult.position !== payload.position ||
        persistedResult.fastest_lap !== payload.fastest_lap ||
        persistedResult.session_id !== payload.session_id ||
        persistedResult.session_type !== payload.session_type;

      if (hasChanged) {
        updates.push({ id: row.resultId, payload });
      }
    });

    try {
      setIsSaving(true);

      await withMinDelay(
        Promise.all([
          ...idsToDelete.map((id) => deleteResult(id).unwrap()),
          ...creates.map((payload) => createResult(payload).unwrap()),
          ...updates.map((update) => updateResult(update).unwrap()),
        ]),
        1000,
      );

      await resultsBySession.refetch();
      showToast({
        usage: "success",
        message: "Results updated.",
      });
    } catch {
      handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
    } finally {
      setIsSaving(false);
    }
  };

  // -- UI Components -- //

  const filters =
    divisionOptions.length > 0 ||
    roundOptions.length > 0 ||
    eventOptions.length > 0 ||
    sessionOptions.length > 0 ? (
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
          resetResultForm();
          setSelectedDivisionId(value);
          setSelectedRoundId("");
          setSelectedEventId("");
          setSelectedSessionType("");
        }}
        onRoundChange={(value) => {
          resetResultForm();
          setSelectedRoundId(value);
          setSelectedEventId("");
          setSelectedSessionType("");
        }}
        onEventChange={(value) => {
          resetResultForm();
          setSelectedEventId(value);
          setSelectedSessionType("");
        }}
        onSessionChange={(value) => {
          resetResultForm();
          setSelectedSessionType(value as SessionType);
        }}
      />
    ) : undefined;

  const canEditRows = Boolean(effectiveDivisionId && effectiveRoundId && effectiveEventId && effectiveSessionId);
  const hasSessionForResults = Boolean(sessionOptions.length > 0 && effectiveSessionId);
  const allDriversAdded =
    hasSessionForResults &&
    driverOptions.length > 0 &&
    watchedResults.length >= driverOptions.length;

  const listChildren = hasSessionForResults ? (
    <>
      {resultFields.length > 0 && (
        <TableWrapper style={RESULT_TABLE_STYLE}>
          <ResultHeader>
            <TableRow>
              <PComlumn $hasPoints={pointsVisible}>
                <ColumnText>P</ColumnText>
              </PComlumn>
              <DriverColumn $hasPoints={pointsVisible}>
                <ColumnText>Driver</ColumnText>
              </DriverColumn>
              <TimeColumn $hasPoints={pointsVisible}>
                <ColumnText>Time</ColumnText>
              </TimeColumn>
              {pointsVisible && (
                <PointsColumn $hasPoints={pointsVisible}>
                  <ColumnText>Pts</ColumnText>
                </PointsColumn>
              )}
              <ExtraColumn />
            </TableRow>
          </ResultHeader>
          <TableBody>
            {resultFields.map((field, index) => (
              <TableRow key={field.id}>
                <PCell $hasPoints={pointsVisible}>
                  <PText>{index + 1}</PText>
                </PCell>
                <DriverCell $hasPoints={pointsVisible}>
                  <ProfileSelectInput
                    name={`results.${index}.driverId`}
                    type="driver"
                    profiles={getResultDriverOptionsForRow(index)}
                    placeholder="Select driver..."
                    shortenText={pointsVisible}
                  />
                </DriverCell>
                <TimeCell>
                  <RaceTimeInput
                    name={`results.${index}.time`}
                    placeholder="00:00.000"
                  />
                </TimeCell>
                {pointsVisible && (
                  <PointsCell $hasPoints={pointsVisible}>
                    <TextInput
                      type="number"
                      name={`results.${index}.points`}
                      placeholder="0"
                    />
                  </PointsCell>
                )}
                <ExtraCell>
                  <Button
                    size="small"
                    color="base"
                    rounded
                    variant="ghost"
                    ariaLabel="remove row"
                    icon={{ left: <RemoveIcon /> }}
                    onClick={() => removeResult(index)}
                  />
                </ExtraCell>
              </TableRow>
            ))}
          </TableBody>
        </TableWrapper>
      )}

      {!allDriversAdded && (
        <AddItem
          label="Add Position"
          onClick={() => {
            if (!canEditRows || !ensureSessionSelected()) {
              return;
            }

            appendNextResult();
          }}
        />
      )}

      {fastestLapFields.length > 0 && (
        <TableWrapper style={RESULT_TABLE_STYLE}>
          <ResultHeader>
            <TableRow>
              <PComlumn $hasPoints={pointsVisible}>
                <ColumnText>P</ColumnText>
              </PComlumn>
              <DriverColumn $hasPoints={pointsVisible}>
                <ColumnText>Driver</ColumnText>
              </DriverColumn>
              <TimeColumn>
                <ColumnText>Time</ColumnText>
              </TimeColumn>
              {pointsVisible && (
                <PointsColumn>
                  <ColumnText>Pts</ColumnText>
                </PointsColumn>
              )}
              <ExtraColumn />
            </TableRow>
          </ResultHeader>
          <TableBody>
            {fastestLapFields.map((field, index) => (
              <TableRow key={field.id}>
                <PCell $hasPoints={pointsVisible}>
                  <PText>FL</PText>
                </PCell>
                <DriverCell $hasPoints={pointsVisible}>
                  <ProfileSelectInput
                    name={`fastestLap.${index}.driverId`}
                    type="driver"
                    profiles={getFastestLapDriverOptions()}
                    placeholder="Select driver..."
                    shortenText={pointsVisible}
                  />
                </DriverCell>
                <TimeCell $hasPoints={pointsVisible}>
                  <RaceTimeInput
                    name={`fastestLap.${index}.time`}
                    placeholder="00:00.000"
                  />
                </TimeCell>
                {pointsVisible && (
                  <PointsCell $hasPoints={pointsVisible}>
                    <TextInput
                      type="number"
                      name={`fastestLap.${index}.points`}
                      placeholder="0"
                    />
                  </PointsCell>
                )}
                <ExtraCell>
                  <Button
                    size="small"
                    color="base"
                    rounded
                    variant="ghost"
                    ariaLabel="remove fastest lap"
                    icon={{ left: <RemoveIcon /> }}
                    onClick={() => removeFastestLap(index)}
                  />
                </ExtraCell>
              </TableRow>
            ))}
          </TableBody>
        </TableWrapper>
      )}

      {fastestLapFields.length === 0 && (
        <AddItem
          label="Add Fastest Lap"
          onClick={() => {
            if (!canEditRows || !ensureSessionSelected()) {
              return;
            }

            appendFastestLapRow();
          }}
        />
      )}
    </>
  ) : (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <EmptyMessage
        title="No Session"
        subtitle="Create an Event in a Round to enter results for."
      />
    </div>
  );

  return (
    <FormProvider {...formMethods}>
      <SheetForm
        id={"results-form"}
        seasonName={seasonData.season_name}
        header={"Enter Results"}
        filters={filters}
        listChildren={listChildren}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </FormProvider>
  );
};

export default Results;
