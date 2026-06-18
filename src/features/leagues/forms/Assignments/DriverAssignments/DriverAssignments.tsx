import { useState } from "react";
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
} from "./DriverAssignments.styles";
import {
  DRIVER_TABLE_STYLE,
  type DriverAssignmentRow,
} from "./util/DriverAssignments.util";
import NoDrivers from "@/features/leagues/modals/errors/NoDrivers/NoDrivers";
import { useDriverAssignments } from "./hooks/useDriverAssignments";
import DriversAssigned from "@/features/leagues/modals/errors/DriversAssigned/DriversAssigned";


type DriverAssignmentsFormValues = {
  assignments: DriverAssignmentRow[];
};

type DriverAssignmentsProps = {
  seasonData: LeagueSeasonTable;
  onDirtyChange?: (isDirty: boolean) => void;
}

const DriverAssignments = ({ seasonData, onDirtyChange }: DriverAssignmentsProps) => {
  const { openModal } = useModal();
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const seasonDivisions = useGetLeagueSeasonDivisionsQuery(seasonData.id);
  const leagueParticipants = useGetLeagueParticipantsQuery(seasonData.league_id);
  const seasonDriversBySeason = useGetLeagueSeasonDriversBySeasonIdQuery(seasonData.id);
  const [createLeagueSeasonDriver] = useCreateLeagueSeasonDriverMutation();
  const [removeLeagueSeasonDriver] = useRemoveLeagueSeasonDriverMutation();


  // -- Form setup -- //

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

  const {
    setSelectedDivisionId,
    effectiveDivisionId,
    divisionOptions,
    participantMap,
    persistedAssignments,
    persistedMap,
    getDriverOptionsForRow,
    findNextAvailableDriver,
  } = useDriverAssignments({
    reset,
    watchedAssignments,
    isDirty,
    onDirtyChange,
    seasonDivisions,
    leagueParticipants,
    seasonDriversBySeason,
  });

  // Appends the next available driver, or opens the NoDrivers modal if none remain.
  const appendNextDriver = () => {
    const nextDriverId = findNextAvailableDriver();

    if (!nextDriverId) {
      openModal(<NoDrivers />);
      return;
    }

    append({ driver: nextDriverId });
  };

  // -- Handlers -- //
  const handleSave = async () => {
    if (!effectiveDivisionId) {
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
    ]
      .map((profileId) => {
        const participant = participantMap.get(profileId);

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
        Promise.all([
          ...Array.from(assignmentIdsToRemove).map((assignmentId) =>
            removeLeagueSeasonDriver({ driverId: assignmentId }).unwrap(),
          ),
          ...driversToCreate.map((driver) =>
            createLeagueSeasonDriver({
              seasonId: seasonData.id,
              divisionId: effectiveDivisionId,
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
    } catch (error) {
      const code = (error as { data?: { code?: string } })?.data?.code;
      if (code === "DRIVER_IN_EVENT") {
        return openModal(<DriversAssigned driverInEvent />);
      } else {
        handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
      }
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
      selectedDivision={effectiveDivisionId}
      onDivisionChange={setSelectedDivisionId}
    />
  ) : undefined;

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