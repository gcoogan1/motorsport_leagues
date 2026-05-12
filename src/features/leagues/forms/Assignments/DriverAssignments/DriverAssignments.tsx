import { useEffect, useMemo, useState } from "react";
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form";
import SheetForm from "@/components/Sheets/SheetForm/SheetForm"
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
import type {
  LeagueParticipantProfile,
  LeagueSeasonDriverTable,
  LeagueSeasonTable,
} from "@/types/league.types";
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

type DriverAssignmentRow = {
  assignmentId?: string;
  driver: string;
};

type DriverAssignmentsFormValues = {
  assignments: DriverAssignmentRow[];
};

type DriverAssignmentsProps = {
  seasonData: LeagueSeasonTable;
}

const DriverAssignments = ({ seasonData }: DriverAssignmentsProps) => {
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
  const { control } = formMethods;
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "assignments",
  });
  const watchedAssignments = useWatch({ control, name: "assignments" }) ?? [];

  // -- Division -- //
  const divisionOptions = useMemo(
    () =>
      seasonDivisions.data
        ? seasonDivisions.data.map((division) => ({
            label: division.division_name,
            value: division.id,
          }))
        : [],
    [seasonDivisions.data],
  );

  useEffect(() => {
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
    if (!selectedDivisionId) {
      return;
    }

    replace([]);
    setHydratedDivisionKey("");
  }, [selectedDivisionId, replace]);

  // -- Drivers -- //
  const driverParticipants = useMemo(
    () =>
      (leagueParticipants.data ?? []).filter((participant: LeagueParticipantProfile) =>
        participant.roles.includes("driver"),
      ),
    [leagueParticipants.data],
  );

  const participantOptionsByProfileId = useMemo(
    () =>
      new Map(
        (leagueParticipants.data ?? []).map((participant: LeagueParticipantProfile) => [
          participant.profile_id,
          {
            label: participant.username,
            value: participant.profile_id,
            secondaryInfo: participant.game_type,
            avatar: {
              avatarType: participant.avatar_type,
              avatarValue: participant.avatar_value,
            },
          },
        ]),
      ),
    [leagueParticipants.data],
  );

  const driverOptions = useMemo(
    () =>
      driverParticipants.map((participant) => ({
        label: participant.username,
        value: participant.profile_id,
        secondaryInfo: participant.game_type,
        avatar: {
          avatarType: participant.avatar_type,
          avatarValue: participant.avatar_value,
        },
      })),
    [driverParticipants],
  );

  // -- Assignments -- //


  const persistedAssignments = useMemo(
    () =>
      (seasonDriversBySeason.data ?? [])
        .filter((assignment: LeagueSeasonDriverTable) => assignment.division_id === selectedDivisionId)
        .map((assignment: LeagueSeasonDriverTable) => ({
        assignmentId: assignment.id,
        driver: assignment.profile_id,
        })),
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

    replace(persistedAssignments);
    setHydratedDivisionKey(persistedAssignmentsKey);
  }, [hydratedDivisionKey, persistedAssignments, persistedAssignmentsKey, replace]);

  const persistedAssignmentMap = useMemo(
    () =>
      new Map(
        persistedAssignments
          .filter((assignment) => assignment.assignmentId)
          .map((assignment) => [assignment.assignmentId as string, assignment.driver]),
      ),
    [persistedAssignments],
  );

  // Drivers that are assigned to other divisions in the same season should not be available for selection in the current division, to prevent duplicate assignments across divisions.
  const driversAssignedToOtherDivisions = useMemo(
    () =>
      new Set(
        (seasonDriversBySeason.data ?? [])
          .filter((assignment: LeagueSeasonDriverTable) => assignment.division_id !== selectedDivisionId)
          .map((assignment: LeagueSeasonDriverTable) => assignment.profile_id),
      ),
    [seasonDriversBySeason.data, selectedDivisionId],
  );

  // Returns the available driver options for a given row index, 
  // excluding drivers that are already assigned in other rows or other divisions, 
  // while ensuring the currently selected driver for that row is included in the options.
  const getDriverOptionsForRow = (rowIndex: number) => {
    const selectedDriverIds = new Set(
      watchedAssignments
        .map((assignment, index) => (index === rowIndex ? "" : assignment?.driver ?? ""))
        .filter(Boolean),
    );
    const currentValue = watchedAssignments[rowIndex]?.driver;

    const filteredOptions = driverOptions.filter(
      (option) =>
        option.value === currentValue ||
        (!selectedDriverIds.has(option.value) && !driversAssignedToOtherDivisions.has(option.value)),
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

  // Appends the next available driver to the assignments list.  
  const appendNextDriver = () => {
    const selectedDriverIds = new Set(
      watchedAssignments.map((assignment) => assignment?.driver ?? "").filter(Boolean),
    );
    const nextDriver = driverOptions.find(
      (option) =>
        !selectedDriverIds.has(option.value) && !driversAssignedToOtherDivisions.has(option.value),
    );

    if (!nextDriver) {
      return;
    }

    append({ driver: nextDriver.value });
  };

  // -- Handlers -- //
  const handleSave = async () => {
    if (!selectedDivisionId) {
      return;
    }

    const currentAssignments = (formMethods.getValues("assignments") ?? []).filter(
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
        persistedAssignmentMap.get(assignment.assignmentId) !== assignment.driver,
    );

    const assignmentIdsToRemove = new Set<string>([
      ...removedPersistedIds,
      ...changedPersistedAssignments.map((assignment) => assignment.assignmentId as string),
    ]);

    const profileIdsToCreate = [
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
            removeLeagueSeasonDriver({ driverId: assignmentId }).unwrap(),
          ),
          ...profileIdsToCreate.map((profileId) =>
            createLeagueSeasonDriver({
              seasonId: seasonData.id,
              divisionId: selectedDivisionId,
              profileId,
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

  // -- Components -- //
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

  const listChildren = (
    <>
      {fields.length > 0 && (
        <TableWrapper style={{ width: "min(100%, 360px)", marginInline: "auto" }}>
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
      <AddItem
        label="Add Driver"
        onClick={appendNextDriver}
      />
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
  )
}

export default DriverAssignments