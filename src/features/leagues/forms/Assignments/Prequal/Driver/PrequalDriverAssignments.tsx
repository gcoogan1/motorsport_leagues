import { useEffect, useMemo, useState } from "react";
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form";
import SheetForm from "@/components/Sheets/SheetForm/SheetForm";
import AddItem from "@/components/AddItem/AddItem";
import Button from "@/components/Button/Button";
import ProfileSelectInput from "@/components/Inputs/ProfileSelectInput/ProfileSelectInput";
import FilterBar from "@/components/Tabs/FilterBar/FilterBar";
import RemoveIcon from "@assets/Icon/Remove.svg?react";
import {
  useCreateLeagueSeasonDriverMutation,
  useGetLeagueParticipantsQuery,
  useGetLeagueSeasonDivisionsQuery,
  useGetLeagueSeasonDriversBySeasonIdQuery,
  useRemoveLeagueSeasonDriverMutation,
} from "@/rtkQuery/API/leagueApi";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import type { LeagueSeasonTable } from "@/types/league.types";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { withMinDelay } from "@/utils/withMinDelay";
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
} from "@/components/Tables/InputTable/InputTable.styles";
import {
  buildDivisionOptions,
  buildDriverOptions,
  buildDriverParticipants,
  buildParticipantOptionsByProfileId,
  buildPersistedAssignmentMap,
  buildPersistedAssignments,
  DRIVER_TABLE_STYLE,
  type DriverAssignmentRow,
} from "../../DriverAssignments/DriverAssignments.util";
import {
  buildDriversAssignedToOtherDivisions,
  buildPreQualAssignedDriverIds,
  getPreQualDivisionId,
  isPreQualRestrictedDivision,
} from "./prequalDriverAssignments.util";
import NoDrivers from "@/features/leagues/modals/errors/NoDrivers/NoDrivers";

type DriverAssignmentsFormValues = {
  assignments: DriverAssignmentRow[];
};

type PrequalDriverAssignmentsProps = {
  seasonData: LeagueSeasonTable;
  onDirtyChange?: (isDirty: boolean) => void;
};

const PrequalDriverAssignments = ({
  seasonData,
  onDirtyChange,
}: PrequalDriverAssignmentsProps) => {
  const { openModal } = useModal();
  const { showToast } = useToast();
  const [selectedDivisionId, setSelectedDivisionId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [hydratedDivisionKey, setHydratedDivisionKey] = useState("");
  const seasonDivisions = useGetLeagueSeasonDivisionsQuery(seasonData.id);
  const leagueParticipants = useGetLeagueParticipantsQuery(seasonData.league_id);
  const seasonDriversBySeason = useGetLeagueSeasonDriversBySeasonIdQuery(seasonData.id);
  const [createLeagueSeasonDriver] = useCreateLeagueSeasonDriverMutation();
  const [removeLeagueSeasonDriver] = useRemoveLeagueSeasonDriverMutation();
  const formMethods = useForm<DriverAssignmentsFormValues>({
    defaultValues: {
      assignments: [],
    },
  });
  const {
    control,
    reset,
    formState: { isDirty },
  } = formMethods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "assignments",
  });
  const watchedAssignments = useWatch({ control, name: "assignments" }) ?? [];

  // Build the division filter from the season divisions.
  const divisionOptions = useMemo(
    () => buildDivisionOptions(seasonDivisions.data),
    [seasonDivisions.data],
  );

  // Division 0 is the pre-qual source list for the rest of the season.
  const preQualDivisionId = useMemo(
    () => getPreQualDivisionId(seasonData.includes_pre_qual, seasonDivisions.data),
    [seasonData.includes_pre_qual, seasonDivisions.data],
  );

  useEffect(() => {
    // Keep the selected division valid as the available division list changes.
    if (!divisionOptions.length) {
      setSelectedDivisionId("");
      return;
    }

    setSelectedDivisionId((currentValue) => {
      if (currentValue && divisionOptions.some((option) => option.value === currentValue)) {
        return currentValue;
      }

      return divisionOptions[0]?.value ?? "";
    });
  }, [divisionOptions]);

  useEffect(() => {
    // Clear local rows before hydrating the newly selected division.
    if (!selectedDivisionId) {
      return;
    }

    reset(
      { assignments: [] },
      { keepDirty: false, keepTouched: false },
    );
    setHydratedDivisionKey("");
  }, [reset, selectedDivisionId]);

  const driverParticipants = useMemo(
    () => buildDriverParticipants(leagueParticipants.data),
    [leagueParticipants.data],
  );

  const participantOptionsByProfileId = useMemo(
    () => buildParticipantOptionsByProfileId(leagueParticipants.data),
    [leagueParticipants.data],
  );

  const participantDetailsByProfileId = useMemo(
    () =>
      new Map(
        (leagueParticipants.data ?? []).map((participant) => [
          participant.profile_id,
          participant,
        ]),
      ),
    [leagueParticipants.data],
  );

  const driverOptions = useMemo(
    () => buildDriverOptions(driverParticipants),
    [driverParticipants],
  );

  // These are the saved driver rows for the selected division only.
  const persistedAssignments = useMemo(
    () => buildPersistedAssignments(seasonDriversBySeason.data, selectedDivisionId),
    [seasonDriversBySeason.data, selectedDivisionId],
  );

  const persistedAssignmentsKey = useMemo(
    () =>
      `${selectedDivisionId}:${persistedAssignments
        .map((assignment) => `${assignment.assignmentId ?? "new"}:${assignment.driver}`)
        .join("|")}`,
    [persistedAssignments, selectedDivisionId],
  );

  useEffect(() => {
    if (persistedAssignmentsKey === hydratedDivisionKey) {
      return;
    }

    // Hydrate the field array once per saved snapshot for the current division.
    reset(
      { assignments: persistedAssignments },
      { keepDirty: false, keepTouched: false },
    );
    setHydratedDivisionKey(persistedAssignmentsKey);
  }, [hydratedDivisionKey, persistedAssignments, persistedAssignmentsKey, reset]);

  useEffect(() => {
    // Bubble unsaved state to the parent sheet guard.
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    // Guard browser refresh/navigation when there are unsaved assignment edits.
    if (!isDirty) {
      return undefined;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  const persistedAssignmentMap = useMemo(
    () => buildPersistedAssignmentMap(persistedAssignments),
    [persistedAssignments],
  );

  const driversAssignedToOtherDivisions = useMemo(
    () =>
      buildDriversAssignedToOtherDivisions(
        seasonDriversBySeason.data,
        selectedDivisionId,
        preQualDivisionId,
      ),
    [preQualDivisionId, seasonDriversBySeason.data, selectedDivisionId],
  );

  const preQualAssignedDriverIds = useMemo(
    () => buildPreQualAssignedDriverIds(seasonDriversBySeason.data, preQualDivisionId),
    [preQualDivisionId, seasonDriversBySeason.data],
  );

  // Linked divisions may only use drivers that already exist in pre-qual.
  const isRestrictedDivision = isPreQualRestrictedDivision(
    selectedDivisionId,
    preQualDivisionId,
  );

  const getDriverOptionsForRow = (rowIndex: number) => {
    // Preserve the current value while blocking duplicates and invalid cross-division picks.
    const selectedDriverIds = new Set(
      watchedAssignments
        .map((assignment, index) => (index === rowIndex ? "" : assignment?.driver ?? ""))
        .filter(Boolean),
    );
    const currentValue = watchedAssignments[rowIndex]?.driver;

    const filteredOptions = driverOptions.filter(
      (option) =>
        option.value === currentValue ||
        (!selectedDriverIds.has(option.value) &&
          !driversAssignedToOtherDivisions.has(option.value) &&
          (!isRestrictedDivision || preQualAssignedDriverIds.has(option.value))),
    );

    const currentAssignedOption = currentValue
      ? participantOptionsByProfileId.get(currentValue)
      : undefined;

    if (
      currentAssignedOption &&
      !filteredOptions.some((option) => option.value === currentAssignedOption.value)
    ) {
      return [currentAssignedOption, ...filteredOptions];
    }

    return filteredOptions;
  };

  const appendNextDriver = () => {
    // Pick the next valid driver automatically to keep row creation fast.
    const selectedDriverIds = new Set(
      watchedAssignments.map((assignment) => assignment?.driver ?? "").filter(Boolean),
    );
    const nextDriver = driverOptions.find(
      (option) =>
        !selectedDriverIds.has(option.value) &&
        !driversAssignedToOtherDivisions.has(option.value) &&
        (!isRestrictedDivision || preQualAssignedDriverIds.has(option.value)),
    );

    if (!nextDriver) {
      if (isRestrictedDivision) {
        openModal(<NoDrivers preQual />);
        return;
      }

      openModal(<NoDrivers />);
      return;
    }

    append({ driver: nextDriver.value });
  };

  const handleSave = async () => {
    if (!selectedDivisionId) {
      return;
    }

    // Ignore empty rows before validating and diffing against persisted assignments.
    const currentAssignments = (formMethods.getValues("assignments") ?? []).filter(
      (assignment) => assignment.driver,
    );

    if (
      isRestrictedDivision &&
      currentAssignments.some((assignment) => !preQualAssignedDriverIds.has(assignment.driver))
    ) {
      openModal(<NoDrivers preQual />);
      return;
    }

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
        persistedAssignmentMap.get(assignment.assignmentId) !== assignment.driver,
    );

    const assignmentIdsToRemove = new Set<string>([
      ...removedPersistedIds,
      ...changedPersistedAssignments.map((assignment) => assignment.assignmentId as string),
    ]);

    // Recreated rows need profile metadata so new season-driver records remain display-ready.
    const driversToCreate = [
      ...currentAssignments
        .filter((assignment) => !assignment.assignmentId)
        .map((assignment) => assignment.driver),
      ...changedPersistedAssignments.map((assignment) => assignment.driver),
    ]
      .map((profileId) => {
        const participant = participantDetailsByProfileId.get(profileId);

        if (!participant) {
          return null;
        }

        return {
          profileId,
          displayName: participant.username,
          gameType: participant.game_type,
          avatarType: participant.avatar_type,
          avatarValue: participant.avatar_value,
        };
      })
      .filter((driver) => driver !== null);

    try {
      setIsSaving(true);

      await withMinDelay(
        // Replacing a saved driver assignment is modeled as remove old row, then create new row.
        Promise.all([
          ...Array.from(assignmentIdsToRemove).map((assignmentId) =>
            removeLeagueSeasonDriver({ driverId: assignmentId }).unwrap(),
          ),
          ...driversToCreate.map((driver) =>
            createLeagueSeasonDriver({
              seasonId: seasonData.id,
              divisionId: selectedDivisionId,
              profileId: driver.profileId,
              displayName: driver.displayName,
              gameType: driver.gameType,
              avatarType: driver.avatarType,
              avatarValue: driver.avatarValue,
            }).unwrap(),
          ),
        ]),
        1000,
      );

      await seasonDriversBySeason.refetch();
      showToast({
        usage: "success",
        message: "Driver assignments updated.",
      });
    } catch {
      handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
    } finally {
      setIsSaving(false);
    }
  };

  const divisionFilter = divisionOptions.length > 1 ? (
    <FilterBar
      divisions={divisionOptions}
      rounds={[]}
      events={[]}
      sessions={[]}
      selectedDivision={selectedDivisionId}
      onDivisionChange={setSelectedDivisionId}
    />
  ) : undefined;

  // Driver-only pre-qual seasons always render a single editable assignment table.
  const listChildren = (
    <>
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
    </>
  );

  return (
    <FormProvider {...formMethods}>
      <SheetForm
        id={"driver-assignments-form"}
        seasonName={seasonData.season_name}
        header={"Driver Assignments"}
        filters={divisionFilter}
        listChildren={listChildren}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </FormProvider>
  );
};

export default PrequalDriverAssignments;
