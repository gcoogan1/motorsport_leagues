import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import SheetForm from "@/components/Sheets/SheetForm/SheetForm";
import AddItem from "@/components/AddItem/AddItem";
import Button from "@/components/Button/Button";
import ProfileSelectInput from "@/components/Inputs/ProfileSelectInput/ProfileSelectInput";
import FilterBar from "@/components/Tabs/FilterBar/FilterBar";
import RemoveIcon from "@assets/Icon/Remove.svg?react";
import DeleteIcon from "@assets/Icon/Delete.svg?react";
import {
  useCreateLeagueSeasonDriverMutation,
  useRemoveLeagueSeasonDriverMutation,
  useCreateLeagueSeasonTeamMutation,
  useRemoveLeagueSeasonTeamMutation,
  useUpdateLeagueSeasonDriverTeamMutation,
  useUpdateLeagueSeasonTeamMutation,
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
} from "./TeamAssignments.styles";
import SegmentedTab from "@/components/Tabs/SegmentedTabs/SegmentedTab";
import SelectInput from "@/components/Inputs/SelectInput/SelectInput";
import TextInput from "@/components/Inputs/TextInput/TextInput";
import {
  TEAM_NAME_MAX_LENGTH,
  teamAssignmentsFormSchema,
  type TeamAssignmentsFormValues,
} from "./teamAssignments.schema";
import {
  ASSIGNMENT_TABS,
  createEmptyTeamRow,
  getTeamKey,
  TEAM_COLUMN_STYLE,
} from "./util/TeamAssignments.util";
import DriversAssigned from "@/features/leagues/modals/errors/DriversAssigned/DriversAssigned";
import CannotSave from "@/features/leagues/modals/errors/CannotSave/CannotSave";
import NoTeams from "@/features/leagues/modals/errors/NoTeams/NoTeams";
import NoDrivers from "@/features/leagues/modals/errors/NoDrivers/NoDrivers";
import TeamAssigned from "@/features/leagues/modals/errors/TeamAssigned/TeamAssigned";
import { useTeamAssignments } from "./hooks/useTeamAssignments";


type TeamAssignmentsProps = {
  seasonData: LeagueSeasonTable;
  onDirtyChange?: (isDirty: boolean) => void;
};

const DELETED_DRIVER_TOKEN_PREFIX = "__deleted_driver__:";

const isDeletedDriverToken = (driverId?: string) =>
  !!driverId &&
  driverId.startsWith(DELETED_DRIVER_TOKEN_PREFIX);

const getDeletedDriverRecordId = (driverId?: string) => {
  if (!driverId || !isDeletedDriverToken(driverId)) {
    return "";
  }

  return driverId.slice(DELETED_DRIVER_TOKEN_PREFIX.length);
};

const TeamAssignments = ({ seasonData, onDirtyChange }: TeamAssignmentsProps) => {
  const { openModal } = useModal();
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // -- Mutations -- //

  const [createLeagueSeasonDriver] = useCreateLeagueSeasonDriverMutation();
  const [removeLeagueSeasonDriver] = useRemoveLeagueSeasonDriverMutation();
  const [updateLeagueSeasonDriverTeam] = useUpdateLeagueSeasonDriverTeamMutation();
  const [createLeagueSeasonTeam] = useCreateLeagueSeasonTeamMutation();
  const [updateLeagueSeasonTeam] = useUpdateLeagueSeasonTeamMutation();
  const [removeLeagueSeasonTeam] = useRemoveLeagueSeasonTeamMutation();

  // -- Form setup -- //

  const formMethods = useForm<TeamAssignmentsFormValues>({
    resolver: zodResolver(teamAssignmentsFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: { teams: [], assignments: [] },
  });

  const {
    control,
    clearErrors,
    getValues,
    reset,
    formState: { errors, isDirty },
  } = formMethods;

  const { fields: teamFields, append: appendTeam, remove: removeTeamRow } = useFieldArray({
    control,
    name: "teams",
  });

  const {
    fields: assignmentFields,
    append: appendAssignment,
    remove: removeAssignment,
  } = useFieldArray({
    control,
    name: "assignments",
  });

  const watchedTeams = useWatch({ control, name: "teams" }) ?? [];
  const watchedAssignments = useWatch({ control, name: "assignments" }) ?? [];

  // -- Derived state, effects, and helpers -- //

  const {
    activeDivisionId,
    divisionOptions,
    setSelectedDivisionId,
    persistedTeams,
    teamOptions,
    currentDivisionDrivers,
    persistedAssignmentMap,
    participantDetailsByProfileId,
    getDriverOptionsForRow,
    findNextAvailableDriver,
    refetchAfterSave,
  } = useTeamAssignments({
    seasonData,
    reset,
    getValues,
    clearErrors,
    errors,
    watchedTeams,
    watchedAssignments,
    isDirty,
    onDirtyChange,
  });

  // activeTab drives the segmented tab display; also set in handleSave to surface errors.
  const [activeTab, setActiveTab] = useState<string>(ASSIGNMENT_TABS[0].label);

  // -- Handlers -- //

  // Appends the next available driver. Shows NoTeams if no teams exist,
  // or NoDrivers when every eligible driver is already placed.
  const appendNextDriver = () => {
    if (teamOptions.length === 0) {
      openModal(<NoTeams />);
      return;
    }

    const nextDriverId = findNextAvailableDriver();

    if (!nextDriverId) {
      openModal(<NoDrivers />);
      return;
    }

    appendAssignment(
      { driver: nextDriverId, teamKey: teamOptions[0]?.value ?? "" },
      { shouldFocus: false },
    );
  };

  // Appends a blank team row for the user to name.
  const appendNextTeam = () => {
    appendTeam(createEmptyTeamRow(), { shouldFocus: false });
  };

  // Blocks removing a team while any driver row still references it.
  const handleRemoveTeam = (index: number) => {
    const team = watchedTeams[index];

    if (!team) return;

    const hasAssignedDrivers = watchedAssignments.some(
      (a) => a?.teamKey === getTeamKey(team),
    );

    if (hasAssignedDrivers) {
      openModal(<DriversAssigned />);
      return;
    }

    removeTeamRow(index);
  };

  // Validates, then saves teams first and driver assignments second.
  // New teams are created sequentially so each id is available before the next.
  const handleSave = async () => {
    if (!activeDivisionId) return;

    const isValid = await formMethods.trigger();

    if (!isValid) {
      const teamErrors = formMethods.formState.errors.teams;
      const hasTeamErrors = Array.isArray(teamErrors)
        ? teamErrors.some((team) => !!team?.teamName)
        : false;

      setActiveTab(hasTeamErrors ? "Teams" : "Drivers");
      openModal(<CannotSave />);
      return;
    }

    const rawTeams = formMethods.getValues("teams") ?? [];

    const currentTeams = rawTeams
      .map((team) => ({ ...team, teamName: team?.teamName?.trim() ?? "" }))
      .filter((team) => team.teamName);

    const removedTeamIds = persistedTeams
      .filter(
        (pt) => pt.teamId && !currentTeams.some((ct) => ct.teamId === pt.teamId),
      )
      .map((t) => t.teamId as string);

    const changedTeams = currentTeams.filter(
      (team) =>
        team.teamId &&
        persistedTeams.some(
          (pt) => pt.teamId === team.teamId && pt.teamName !== team.teamName,
        ),
    );

    const newTeams = currentTeams.filter((team) => !team.teamId);

    const currentAssignments = (formMethods.getValues("assignments") ?? []).filter(
      (a) => a.driver && a.teamKey,
    );

    const activeProfileAssignments = currentAssignments.filter(
      (a) => !isDeletedDriverToken(a.driver),
    );

    try {
      setIsSaving(true);

      await withMinDelay(
        (async () => {
          const assignmentTimestamp = new Date().toISOString();

          // Teams must be created in order so each id is available before the next.
          const createdTeams = [];
          for (const team of newTeams) {
            const result = await createLeagueSeasonTeam({
              seasonId: seasonData.id,
              divisionId: activeDivisionId,
              teamName: team.teamName,
            }).unwrap();

            createdTeams.push(result);
          }

          await Promise.all(
            changedTeams.map((team) =>
              updateLeagueSeasonTeam({
                teamId: team.teamId as string,
                teamName: team.teamName,
              }).unwrap(),
            ),
          );

          // Build a map from form team key → real server team id.
          const resolvedTeamIds = new Map<string, string>();

          currentTeams.forEach((team) => {
            resolvedTeamIds.set(getTeamKey(team), team.teamId ?? "");
          });

          createdTeams.forEach((result, index) => {
            if (result.success) {
              resolvedTeamIds.set(newTeams[index].localId, result.data.id);
            }
          });

          // Desired team mapping from the current form state.
          const desiredDriverTeamsByProfileId = new Map<string, string>();
          const desiredDriverTeamsByRecordId = new Map<string, string>();

          currentAssignments.forEach((assignment) => {
            const resolvedTeamId = resolvedTeamIds.get(assignment.teamKey);
            if (!resolvedTeamId) {
              return;
            }

            if (isDeletedDriverToken(assignment.driver)) {
              const driverRecordId = getDeletedDriverRecordId(assignment.driver);
              if (driverRecordId) {
                desiredDriverTeamsByRecordId.set(driverRecordId, resolvedTeamId);
              }
              return;
            }

            desiredDriverTeamsByProfileId.set(assignment.driver, resolvedTeamId);
          });

          // Update or remove existing division driver records to match desired state.
          for (const driverRecord of currentDivisionDrivers) {
            const currentTeamId = driverRecord.team_id ?? "";
            const desiredTeamId = driverRecord.profile_id
              ? (desiredDriverTeamsByProfileId.get(driverRecord.profile_id) ?? "")
              : (desiredDriverTeamsByRecordId.get(driverRecord.id) ?? "");

            if (currentTeamId === desiredTeamId) continue;

            if (desiredTeamId) {
              await updateLeagueSeasonDriverTeam({
                driverId: driverRecord.id,
                teamId: desiredTeamId,
                addedToTeam: assignmentTimestamp,
              }).unwrap();
              continue;
            }

            if (currentTeamId) {
              await removeLeagueSeasonDriver({ driverId: driverRecord.id }).unwrap();
            }
          }

          // Create driver records for profiles not yet in this division.
          for (const assignment of activeProfileAssignments) {
            if (persistedAssignmentMap.has(assignment.driver)) continue;

            const resolvedTeamId = resolvedTeamIds.get(assignment.teamKey);
            const participant = participantDetailsByProfileId.get(assignment.driver);

            if (!resolvedTeamId || !participant) continue;

            await createLeagueSeasonDriver({
              seasonId: seasonData.id,
              divisionId: activeDivisionId,
              profileId: assignment.driver,
              displayName: participant.username,
              gameType: participant.game_type,
              avatarType: participant.avatar_type,
              avatarValue: participant.avatar_value,
              teamId: resolvedTeamId,
              addedToTeam: assignmentTimestamp,
            }).unwrap();
          }

          // Remove teams last so foreign-key constraints are not violated.
          await Promise.all(
            removedTeamIds.map((teamId) =>
              removeLeagueSeasonTeam({ teamId }).unwrap(),
            ),
          );
        })(),
        1000,
      );

      await refetchAfterSave();
      showToast({ usage: "success", message: "Team assignments updated." });
    } catch (error) {
      const code = (error as { data?: { code?: string } })?.data?.code;
      if (code === "DRIVER_IN_EVENT") {
        return openModal(<TeamAssigned teamInEvent={true} />);
      } else {
        handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // -- Render --

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

  const assignmentTabs = seasonData.is_team_championship ? (
    <SegmentedTab
      tabs={ASSIGNMENT_TABS}
      activeTab={activeTab}
      onChange={setActiveTab}
    />
  ) : null;

  const driverListChildren = (
    <>
      {assignmentFields.length > 0 && (
        <TableWrapper>
          <ParticipantHeader>
            <TableRow>
              <NumberColumn>
                <ColumnText>#</ColumnText>
              </NumberColumn>
              <ParticipantColumn>
                <ColumnText>Driver</ColumnText>
              </ParticipantColumn>
              <ParticipantColumn>
                <ColumnText>Team</ColumnText>
              </ParticipantColumn>
            </TableRow>
          </ParticipantHeader>
          <TableBody>
            {assignmentFields.map((field, index) => (
              <TableRow key={field.id}>
                <NumberCell $isError={!!errors.assignments?.[index]}>
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
                <ParticipantCell>
                  <SelectInput
                    name={`assignments.${index}.teamKey`}
                    options={teamOptions}
                    placeholder="Select team..."
                  />
                </ParticipantCell>
                <ExtraCell $isError={!!errors.assignments?.[index]}>
                  <Button
                    size="small"
                    color="base"
                    rounded
                    variant="ghost"
                    ariaLabel="remove row"
                    icon={{ left: <RemoveIcon /> }}
                    onClick={() => removeAssignment(index)}
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

  const teamListChildren = (
    <>
      {teamFields.length > 0 && (
        <TableWrapper>
          <ParticipantHeader>
            <TableRow>
              <NumberColumn>
                <ColumnText>#</ColumnText>
              </NumberColumn>
              <ParticipantColumn style={TEAM_COLUMN_STYLE}>
                <ColumnText>Team</ColumnText>
              </ParticipantColumn>
            </TableRow>
          </ParticipantHeader>
          <TableBody>
            {teamFields.map((field, index) => (
              <TableRow key={field.id}>
                <NumberCell $isError={!!errors.teams?.[index]}>
                  <NumberText>{index + 1}</NumberText>
                </NumberCell>
                <ParticipantCell style={TEAM_COLUMN_STYLE}>
                  <TextInput
                    name={`teams.${index}.teamName`}
                    maxLength={TEAM_NAME_MAX_LENGTH}
                    hasError={!!errors.teams?.[index]?.teamName}
                    errorMessage={errors.teams?.[index]?.teamName?.message}
                  />
                </ParticipantCell>
                <ExtraCell $isError={!!errors.teams?.[index]?.teamName}>
                  <Button
                    size="small"
                    color="base"
                    rounded
                    variant="ghost"
                    ariaLabel="remove row"
                    icon={{ left: <DeleteIcon /> }}
                    onClick={() => handleRemoveTeam(index)}
                  />
                </ExtraCell>
              </TableRow>
            ))}
          </TableBody>
        </TableWrapper>
      )}
      <AddItem label="Create Team" onClick={appendNextTeam} />
    </>
  );

  return (
    <FormProvider {...formMethods}>
      <SheetForm
        id="team-assignments-form"
        seasonName={seasonData.season_name}
        header="Team Assignments"
        filters={divisionFilter}
        listChildren={activeTab === "Drivers" ? driverListChildren : teamListChildren}
        tabs={assignmentTabs}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </FormProvider>
  );
};

export default TeamAssignments;
