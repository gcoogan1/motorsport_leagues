import { useState } from "react";
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form";
import SheetForm from "@/components/Sheets/SheetForm/SheetForm";
import AddItem from "@/components/AddItem/AddItem";
import Button from "@/components/Button/Button";
import ProfileSelectInput from "@/components/Inputs/ProfileSelectInput/ProfileSelectInput";
import FilterBar from "@/components/Tabs/FilterBar/FilterBar";
import RemoveIcon from "@assets/Icon/Remove.svg?react";
import {
  useCreateLeagueSeasonDriverMutation,
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
import { DRIVER_TABLE_STYLE, type DriverAssignmentRow } from "../../DriverAssignments/util/DriverAssignments.util";
import NoDrivers from "@/features/leagues/modals/errors/NoDrivers/NoDrivers";
import DriversAssigned from "@/features/leagues/modals/errors/DriversAssigned/DriversAssigned";
import { usePrequalDriverAssignments } from "./hooks/usePrequalDriverAssignments";

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
  const [isSaving, setIsSaving] = useState(false);

  // -- Mutations -- //

  const [createLeagueSeasonDriver] = useCreateLeagueSeasonDriverMutation();
  const [removeLeagueSeasonDriver] = useRemoveLeagueSeasonDriverMutation();

  // -- Form setup -- //

  const formMethods = useForm<DriverAssignmentsFormValues>({
    defaultValues: { assignments: [] },
  });

  const {
    control,
    reset,
    getValues,
    formState: { isDirty },
  } = formMethods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "assignments",
  });

  const watchedAssignments = useWatch({ control, name: "assignments" }) ?? [];

  // -- Derived state, effects, and helpers --

  const {
    activeDivisionId,
    divisionOptions,
    setSelectedDivisionId,
    preQualDivisionId,
    isRestrictedDivision,
    persistedAssignments,
    persistedAssignmentMap,
    participantDetailsByProfileId,
    preQualAssignedDriverIds,
    driversAssignedToLinkedDivisions,
    getDriverOptionsForRow,
    findNextAvailableDriver,
    refetchAfterSave,
  } = usePrequalDriverAssignments({
    seasonData,
    reset,
    getValues,
    watchedAssignments,
    isDirty,
    onDirtyChange,
  });

  // -- Handlers -- //

  // Prevents removing a driver from the pre-qual source pool while any restricted
  // division still references that profile.
  const handleRemoveDriver = (index: number) => {
    const driver = watchedAssignments[index];

    if (!driver?.driver) return;

    if (
      activeDivisionId === preQualDivisionId &&
      driversAssignedToLinkedDivisions.has(driver.driver)
    ) {
      openModal(<DriversAssigned isPreQual />);
      return;
    }

    remove(index);
  };

  // Appends the next available driver for this division.
  // For restricted divisions, only drivers in the pre-qual pool are eligible.
  const appendNextDriver = () => {
    const nextDriverId = findNextAvailableDriver();

    if (!nextDriverId) {
      openModal(isRestrictedDivision ? <NoDrivers preQual /> : <NoDrivers />);
      return;
    }

    append({ driver: nextDriverId });
  };

  // Validates current assignments, diffs against persisted state, then removes stale
  // records and creates new ones. Replacing a changed row is modeled as remove + create.
  const handleSave = async () => {
    if (!activeDivisionId) return;

    const currentAssignments = (getValues("assignments") ?? []).filter(
      (a) => a.driver,
    );

    // Guard against saving restricted-division rows that slipped outside the pre-qual pool.
    if (
      isRestrictedDivision &&
      currentAssignments.some((a) => !preQualAssignedDriverIds.has(a.driver))
    ) {
      openModal(<NoDrivers preQual />);
      return;
    }

    const removedIds = persistedAssignments
      .filter(
        (pa) =>
          pa.assignmentId &&
          !currentAssignments.some((ca) => ca.assignmentId === pa.assignmentId),
      )
      .map((a) => a.assignmentId as string);

    const changedAssignments = currentAssignments.filter(
      (a) =>
        a.assignmentId &&
        persistedAssignmentMap.get(a.assignmentId) !== a.driver,
    );

    const idsToRemove = new Set<string>([
      ...removedIds,
      ...changedAssignments.map((a) => a.assignmentId as string),
    ]);

    // Gather profile metadata for each new/changed driver row.
    const driversToCreate = [
      ...currentAssignments.filter((a) => !a.assignmentId).map((a) => a.driver),
      ...changedAssignments.map((a) => a.driver),
    ]
      .map((profileId) => {
        const p = participantDetailsByProfileId.get(profileId);
        if (!p) return null;
        return {
          profileId,
          displayName: p.username,
          gameType: p.game_type,
          avatarType: p.avatar_type,
          avatarValue: p.avatar_value,
        };
      })
      .filter((d) => d !== null);

    try {
      setIsSaving(true);

      // Replacing a saved row is remove old record + create new record in one pass.
      await withMinDelay(
        Promise.all([
          ...Array.from(idsToRemove).map((id) =>
            removeLeagueSeasonDriver({ driverId: id }).unwrap(),
          ),
          ...driversToCreate.map((driver) =>
            createLeagueSeasonDriver({
              seasonId: seasonData.id,
              divisionId: activeDivisionId,
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

      await refetchAfterSave();
      showToast({ usage: "success", message: "Driver assignments updated." });
    } catch (error) {
      const code = (error as { data?: { code?: string } })?.data?.code;
      if (code === "DRIVER_IN_EVENT") {
        showToast({
          usage: "error",
          message: "This driver has been added to an event and cannot be removed or reassigned.",
        });
      } else {
        handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // -- Render -- //

  const divisionFilter =
    divisionOptions.length > 1 ? (
      <FilterBar
        divisions={divisionOptions}
        rounds={[]}
        events={[]}
        sessions={[]}
        selectedDivision={activeDivisionId}
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
                    onClick={() => handleRemoveDriver(index)}
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
        id="driver-assignments-form"
        seasonName={seasonData.season_name}
        header="Driver Assignments"
        filters={divisionFilter}
        listChildren={listChildren}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </FormProvider>
  );
};

export default PrequalDriverAssignments;
