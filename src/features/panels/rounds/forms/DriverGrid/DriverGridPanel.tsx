import AddItem from "@/components/AddItem/AddItem";
import Button from "@/components/Button/Button";
import PanelLayout from "@/components/Panels/components/PanelLayout/PanelLayout";
import ProfileIcon from "@assets/Icon/Profile.svg?react";
import ProfileSelectInput from "@/components/Inputs/ProfileSelectInput/ProfileSelectInput";
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form";
import { usePanel } from "@/providers/panel/usePanel";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import { useEvent, useEventDrivers } from "@/rtkQuery/hooks/queries/useEvents";
import { useCreateEventDriver, useDeleteEventDriver } from "@/rtkQuery/hooks/mutations/useEventMutaion";
import { useLeagueSeasonDivisionDrivers, useLeagueSeasonDivisionTeams } from "@/rtkQuery/hooks/queries/useLeagueSeasonDivisions";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { withMinDelay } from "@/utils/withMinDelay";
import RemoveIcon from "@assets/Icon/Remove.svg?react";
import NoDrivers from "@/features/leagues/modals/errors/NoDrivers/NoDrivers";
import UnsavedChanges from "@/features/leagues/modals/errors/UnsavedChanges/UnsavedChanges";
import {
  ColumnText,
  ExtraCell,
  NumberCell,
  NumberColumn,
  NumberText,
  ParticipantCell,
  ParticipantColumn,
  ParticipantHeader,
  TableBody,
  TableRow,
  TableWrapper,
} from "./DriverGridPanel.styles";
import { DRIVER_TABLE_STYLE } from "@/features/leagues/forms/Assignments/DriverAssignments/util/DriverAssignments.util";
import { type DriverGridFormValues, type DriverGridRow, toSeasonDriverOption } from "./DriverGridPanel.util";

type DriverGridPanelProps = {
  eventId: string;
}


const DriverGridPanel = ({ eventId }: DriverGridPanelProps) => {
  const { closePanel, setOutsidePanelCloseHandler } = usePanel();
  const { openModal } = useModal();
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const event = useEvent(eventId);
  const seasonDrivers = useLeagueSeasonDivisionDrivers(event.data?.division_id);
  const seasonTeams = useLeagueSeasonDivisionTeams(event.data?.division_id);
  const eventDrivers = useEventDrivers(eventId);
  const [createEventDriver] = useCreateEventDriver();
  const [deleteEventDriver] = useDeleteEventDriver();

  // Merge drivers with team names
  const driversWithTeams = useMemo(() => {
    const teamMap = new Map((seasonTeams.data ?? []).map((team) => [team.id, team.team_name]));
    return (seasonDrivers.data ?? []).map((driver) => ({
      ...driver,
      team_name: driver.team_id ? teamMap.get(driver.team_id) : undefined,
    }));
  }, [seasonDrivers.data, seasonTeams.data]);

  const formMethods = useForm<DriverGridFormValues>({
    defaultValues: {
      assignments: [],
    },
  });
  const numberOfDrivers = useMemo(
    () => (eventDrivers.data ?? []).length,
    [eventDrivers.data],
  );

  // -- Form Methods -- //

  const { control, getValues, reset } = formMethods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "assignments",
  });


  // -- Memoized Values -- //
  const watchedAssignmentsValue = useWatch({ control, name: "assignments" });
  const watchedAssignments = useMemo(
    () => watchedAssignmentsValue ?? [],
    [watchedAssignmentsValue],
  );

  const persistedAssignments = useMemo<DriverGridRow[]>(
    () =>
      (eventDrivers.data ?? []).map((assignment) => ({
        assignmentId: assignment.id,
        driver: assignment.season_driver_id,
      })),
    [eventDrivers.data],
  );

  const persistedAssignmentsSnapshot = useMemo(
    () => JSON.stringify(persistedAssignments),
    [persistedAssignments],
  );
  const persistedAssignmentsRef = useRef<DriverGridRow[]>(persistedAssignments);

  const currentAssignmentsSnapshot = useMemo(
    () => JSON.stringify(watchedAssignments ?? []),
    [watchedAssignments],
  );

  const hasUnsavedChanges = persistedAssignmentsSnapshot !== currentAssignmentsSnapshot;

  const persistedMap = useMemo(
    () =>
      new Map(
        persistedAssignments
          .filter((assignment): assignment is DriverGridRow & { assignmentId: string } => Boolean(assignment.assignmentId))
          .map((assignment) => [assignment.assignmentId, assignment.driver]),
      ),
    [persistedAssignments],
  );

  const seasonDriverOptions = useMemo(
    () => driversWithTeams.map(toSeasonDriverOption),
    [driversWithTeams],
  );

  const seasonDriverOptionsById = useMemo(
    () => new Map(seasonDriverOptions.map((option) => [option.value, option])),
    [seasonDriverOptions],
  );

  useEffect(() => {
    persistedAssignmentsRef.current = persistedAssignments;
  }, [persistedAssignments]);

  useEffect(() => {
    reset(
      { assignments: persistedAssignmentsRef.current },
      { keepDirty: false, keepTouched: false },
    );
  }, [persistedAssignmentsSnapshot, reset]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);


  // -- Helper Functions -- //

  const getSelectedSet = (excludeIndex?: number) =>
    new Set(
      watchedAssignments
        .map((assignment, index) => (index === excludeIndex ? "" : assignment?.driver))
        .filter(Boolean),
    );

  const getDriverOptionsForRow = (rowIndex: number) => {
    const selected = getSelectedSet(rowIndex);
    const current = watchedAssignments[rowIndex]?.driver;

    const filtered = seasonDriverOptions.filter(
      (option) => option.value === current || !selected.has(option.value),
    );

    const currentOption = current ? seasonDriverOptionsById.get(current) : undefined;

    if (currentOption && !filtered.some((option) => option.value === currentOption.value)) {
      return [currentOption, ...filtered];
    }

    return filtered;
  };

  const findNextAvailableDriver = (): string | null => {
    const selected = getSelectedSet();
    const next = seasonDriverOptions.find((option) => !selected.has(option.value));

    return next?.value ?? null;
  };

  // -- Handlers -- //

  const appendNextDriver = () => {
    const nextDriverId = findNextAvailableDriver();

    if (!nextDriverId) {
      openModal(<NoDrivers driverGrid />);
      return;
    }

    append({ driver: nextDriverId });
  };

  const handleSave = async () => {
    const currentAssignments = (getValues("assignments") ?? []).filter(
      (assignment) => assignment.driver,
    );

    const removedPersistedIds = persistedAssignments
      .filter(
        (persistedAssignment) =>
          persistedAssignment.assignmentId &&
          !currentAssignments.some(
            (currentAssignment) => currentAssignment.assignmentId === persistedAssignment.assignmentId,
          ),
      )
      .map((assignment) => assignment.assignmentId as string);

    const changedPersistedAssignments = currentAssignments.filter(
      (assignment) =>
        assignment.assignmentId &&
        persistedMap.get(assignment.assignmentId) !== assignment.driver,
    );

    const assignmentIdsToRemove = new Set<string>([
      ...removedPersistedIds,
      ...changedPersistedAssignments.map((assignment) => assignment.assignmentId as string),
    ]);

    const driversToCreate = [
      ...currentAssignments
        .filter((assignment) => !assignment.assignmentId)
        .map((assignment) => assignment.driver),
      ...changedPersistedAssignments.map((assignment) => assignment.driver),
    ];

    try {
      setIsSaving(true);

      await withMinDelay(
        Promise.all([
          ...Array.from(assignmentIdsToRemove).map((assignmentId) =>
            deleteEventDriver({ eventDriverId: assignmentId, eventId }).unwrap(),
          ),
          ...driversToCreate.map((seasonDriverId) =>
            createEventDriver({ eventId, seasonDriverId }).unwrap(),
          ),
        ]),
        1000,
      );

      await eventDrivers.refetch();
      closePanel();
      showToast({
        usage: "success",
        message: "Event drivers updated.",
      });
    } catch {
      handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAttemptClose = useCallback(() => {
    if (!hasUnsavedChanges) {
      closePanel();
      return;
    }

    openModal(
      <UnsavedChanges
        onDiscard={() => {
          reset(
            { assignments: persistedAssignmentsRef.current },
            { keepDirty: false, keepTouched: false },
          );
          closePanel();
        }}
      />,
    );
  }, [closePanel, hasUnsavedChanges, openModal, reset]);

  useEffect(() => {
    setOutsidePanelCloseHandler(handleAttemptClose);

    return () => {
      setOutsidePanelCloseHandler(null);
    };
  }, [handleAttemptClose, setOutsidePanelCloseHandler]);

  return (
    <FormProvider {...formMethods}>
      <PanelLayout
        panelTitle={`${numberOfDrivers} Drivers`}
        panelTitleIcon={<ProfileIcon />}
        onClose={handleAttemptClose}
        actions={{
          primary: {
            label: "Save",
            action: handleSave,
            loading: isSaving,
            loadingText: "Saving...",
            color: "primary"
          },
        }}
      >
        {fields.length > 0 && (
          <TableWrapper style={DRIVER_TABLE_STYLE}>
            <ParticipantHeader>
              <TableRow>
                <NumberColumn>
                  <ColumnText>#</ColumnText>
                </NumberColumn>
                <ParticipantColumn>
                  <ColumnText>Driver</ColumnText>
                </ParticipantColumn>
              </TableRow>
            </ParticipantHeader>
            <TableBody>
              {fields.map((field, index) => (
                <TableRow key={field.id}>
                  <NumberCell>
                    <NumberText>{index + 1}</NumberText>
                  </NumberCell>
                  <ParticipantCell>
                    <ProfileSelectInput
                      name={`assignments.${index}.driver`}
                      type="driver"
                      profiles={getDriverOptionsForRow(index)}
                      placeholder="Select driver..."
                    />
                  </ParticipantCell>
                  <ExtraCell>
                    <Button
                      size="small"
                      color="base"
                      rounded
                      variant="ghost"
                      ariaLabel="remove row"
                      icon={{ left: <RemoveIcon /> }}
                      onClick={() => remove(index)}
                    />
                  </ExtraCell>
                </TableRow>
              ))}
            </TableBody>
          </TableWrapper>
        )}

        <AddItem label="Add Driver" onClick={appendNextDriver} />
      </PanelLayout>
    </FormProvider>
  )
}

export default DriverGridPanel