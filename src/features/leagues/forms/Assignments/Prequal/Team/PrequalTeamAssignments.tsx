import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormProvider,
  type Resolver,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import SheetForm from "@/components/Sheets/SheetForm/SheetForm";
import AddItem from "@/components/AddItem/AddItem";
import Button from "@/components/Button/Button";
import ProfileSelectInput from "@/components/Inputs/ProfileSelectInput/ProfileSelectInput";
import FilterBar from "@/components/Tabs/FilterBar/FilterBar";
import SegmentedTab from "@/components/Tabs/SegmentedTabs/SegmentedTab";
import SelectInput from "@/components/Inputs/SelectInput/SelectInput";
import TextInput from "@/components/Inputs/TextInput/TextInput";
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
import type { LeagueSeasonDriverTable } from "@/types/league.types";
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
} from "../../TeamAssignments/TeamAssignments.styles";
import {
  TEAM_NAME_MAX_LENGTH,
  createTeamAssignmentsFormSchema,
  teamAssignmentsFormSchema,
  type TeamAssignmentsFormValues,
} from "./prequalTeamAssignments.schema";
import {
  ASSIGNMENT_TABS,
  getTeamKey,
  TEAM_COLUMN_STYLE,
} from "../../TeamAssignments/util/TeamAssignments.util";
import { normalizeTeamName, createEmptyTeamRow } from "./util/prequalTeamAssignments.util";
import DriversAssigned from "@/features/leagues/modals/errors/DriversAssigned/DriversAssigned";
import CannotSave from "@/features/leagues/modals/errors/CannotSave/CannotSave";
import NoTeams from "@/features/leagues/modals/errors/NoTeams/NoTeams";
import NoDrivers from "@/features/leagues/modals/errors/NoDrivers/NoDrivers";
import PrequalDriversTable from "../Driver/components/PrequalDriversTable";
import { usePrequalTeamAssignments } from "./hooks/usePrequalTeamAssignments";
import LinkedDivisionTeamsTable from "./components/LinkedDivisionTeamsTable";
import TeamAssigned from "@/features/leagues/modals/errors/TeamAssigned/TeamAssigned";

type PrequalTeamAssignmentsProps = {
  seasonData: LeagueSeasonTable;
  onDirtyChange?: (isDirty: boolean) => void;
};

const isValidLinkedDivisionTeamRow = (
  team?: TeamAssignmentsFormValues["teams"][number],
) => {
  const teamName = normalizeTeamName(team?.teamName);
  return !!teamName && !!(team?.teamId ?? team?.localId);
};

const PrequalTeamAssignments = ({
  seasonData,
  onDirtyChange,
}: PrequalTeamAssignmentsProps) => {
  const { openModal } = useModal();
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(ASSIGNMENT_TABS[0].label);

  const [createLeagueSeasonDriver] = useCreateLeagueSeasonDriverMutation();
  const [removeLeagueSeasonDriver] = useRemoveLeagueSeasonDriverMutation();
  const [updateLeagueSeasonDriverTeam] = useUpdateLeagueSeasonDriverTeamMutation();
  const [createLeagueSeasonTeam] = useCreateLeagueSeasonTeamMutation();
  const [updateLeagueSeasonTeam] = useUpdateLeagueSeasonTeamMutation();
  const [removeLeagueSeasonTeam] = useRemoveLeagueSeasonTeamMutation();

  const schemaStateRef = useState(() => ({
    isLinkedDivision: false,
    availableLinkedTeamNames: new Set<string>(),
    blockedLinkedTeamNames: new Set<string>(),
  }))[0];

  const resolver: Resolver<TeamAssignmentsFormValues> = async (values, context, options) => {
    const schema = schemaStateRef.isLinkedDivision
      ? createTeamAssignmentsFormSchema({
          isLinkedDivision: true,
          availableLinkedTeamNames: schemaStateRef.availableLinkedTeamNames,
          blockedLinkedTeamNames: schemaStateRef.blockedLinkedTeamNames,
        })
      : teamAssignmentsFormSchema;

    return zodResolver(schema)(values, context, options);
  };

  const formMethods = useForm<TeamAssignmentsFormValues>({
    resolver,
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      teams: [],
      assignments: [],
    },
  });

  const {
    control,
    clearErrors,
    reset,
    getValues,
    trigger,
    formState: { errors, isDirty },
  } = formMethods;


  const {
    fields: teamFields,
    append: appendTeam,
    remove: removeTeamRow,
    replace: replaceTeams,
  } = useFieldArray({ control, name: "teams" });

  const {
    fields: assignmentFields,
    append: appendAssignment,
    remove: removeAssignment,
  } = useFieldArray({ control, name: "assignments" });

  const watchedTeamsValue = useWatch({ control, name: "teams" });
  const watchedAssignmentsValue = useWatch({ control, name: "assignments" });
  const watchedTeams = useMemo(
    () => watchedTeamsValue ?? [],
    [watchedTeamsValue],
  );

  const watchedAssignments = useMemo(
    () => watchedAssignmentsValue ?? [],
    [watchedAssignmentsValue],
  );

  const {
    activeDivisionId,
    divisionOptions,
    setSelectedDivisionId,
    isPreQualDivision,
    isLinkedDivision,
    persistedTeams,
    teamOptions,
    preQualTeams,
    preQualTeamByName,
    teamNamesAssignedToOtherDivisions,
    currentDivisionDrivers,
    persistedAssignmentMap,
    participantDetailsByProfileId,
    preQualDriversByTeamId,
    preQualDriverDetailsByProfileId,
    readOnlyDivisionDrivers,
    getDriverOptionsForRow,
    getPreQualTeamOptionsForRow,
    findNextAvailableDriver,
    findNextAvailableTeam,
    refetchAfterSave,
  } = usePrequalTeamAssignments({
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

  schemaStateRef.isLinkedDivision = isLinkedDivision;
  schemaStateRef.availableLinkedTeamNames = new Set(
    preQualTeams.map((team) => normalizeTeamName(team.team_name)),
  );
  schemaStateRef.blockedLinkedTeamNames = teamNamesAssignedToOtherDivisions;

  useEffect(() => {
    if (!isLinkedDivision) {
      return;
    }

    const currentTeams = watchedTeamsValue ?? [];

    if (currentTeams.length === 0) {
      return;
    }

    const validTeams = currentTeams.filter(isValidLinkedDivisionTeamRow);

    if (validTeams.length === currentTeams.length) {
      return;
    }

    // Linked divisions should only contain rows that point at a real pre-qual team.
    // Drop placeholder field-array rows before they affect the table or inherited drivers.
    replaceTeams(validTeams);
  }, [isLinkedDivision, replaceTeams, watchedTeamsValue]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const appendNextDriver = () => {
    if (teamOptions.length === 0) {
      openModal(<NoTeams />);
      return;
    }

    const nextDriver = findNextAvailableDriver();

    if (!nextDriver) {
      openModal(<NoDrivers />);
      return;
    }

    appendAssignment(
      { driver: nextDriver.value, teamKey: teamOptions[0]?.value ?? "" },
      { shouldFocus: false },
    );
  };

  const appendNextTeam = () => {
    if (isPreQualDivision) {
      // Division 0 creates its own teams directly.
      appendTeam(createEmptyTeamRow(), { shouldFocus: false });
      return;
    }

    // // Linked divisions only select from unused pre-qual teams.
    // const currentTeams = getValues("teams") ?? [];
    // const emptyRowIndex = currentTeams.findIndex(
    //   (team) => !(team?.teamName?.trim() ?? ""),
    // );
    const nextTeam = findNextAvailableTeam();


    if (!nextTeam) {
      openModal(<NoTeams isPreQual />);
      return;
    }

    // if (emptyRowIndex >= 0) {
    //   // Reuse a blank row before appending another select row.
    //   setValue(`teams.${emptyRowIndex}.teamName`, nextTeam.team_name, {
    //     shouldDirty: true,
    //     shouldTouch: true,
    //     shouldValidate: true,
    //   });
    //   return;
    // }

    appendTeam(
      { localId: nextTeam.id, teamName: nextTeam.team_name },
      { shouldFocus: false },
    );
  };

  const handleSave = async () => {
    if (!activeDivisionId) return;

    // Validate first so the active tab can jump to the slice that needs attention.
    const isValid = await trigger();

    if (!isValid) {
      const teamErrors = formMethods.formState.errors.teams;
      const hasTeamErrors = Array.isArray(teamErrors)
        ? teamErrors.some((team) => !!team?.teamName)
        : false;
      setActiveTab(hasTeamErrors ? "Teams" : "Drivers");
      openModal(<CannotSave />);
      return;
    }

    const currentTeams = (getValues("teams") ?? [])
      .map((team) => ({ ...team, teamName: team?.teamName?.trim() ?? "" }))
      .filter((team) => team.teamName);

    const removedTeamIds = persistedTeams
      .filter(
        (persistedTeam) =>
          persistedTeam.teamId &&
          !currentTeams.some((t) => t.teamId === persistedTeam.teamId),
      )
      .map((team) => team.teamId as string);

    const changedTeams = currentTeams.filter(
      (team) =>
        team.teamId &&
        persistedTeams.some(
          (p) => p.teamId === team.teamId && p.teamName !== team.teamName,
        ),
    );

    const newTeams = currentTeams.filter((team) => !team.teamId);

    const currentAssignments = (getValues("assignments") ?? []).filter(
      (a) => a.driver && a.teamKey,
    );

    if (
      isLinkedDivision &&
      currentTeams.some(
        (team) =>
          !preQualTeamByName.has(normalizeTeamName(team.teamName)) ||
          teamNamesAssignedToOtherDivisions.has(normalizeTeamName(team.teamName)),
      )
    ) {
      setActiveTab("Teams");
      openModal(<CannotSave />);
      return;
    }

    try {
      setIsSaving(true);

      await withMinDelay(
        (async () => {
          // All writes share one timestamp so ordering stays consistent in the UI.
          const assignmentTimestamp = new Date().toISOString();

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

          const resolvedTeamIds = new Map<string, string>();
          currentTeams.forEach((team) => {
            resolvedTeamIds.set(getTeamKey(team), team.teamId ?? "");
          });
          createdTeams.forEach((result, index) => {
            if (result.success) {
              resolvedTeamIds.set(newTeams[index].localId, result.data.id);
            }
          });

          const desiredDriverTeams = new Map<string, string>();

          if (isLinkedDivision) {
            // Linked divisions inherit their drivers from the selected pre-qual teams.
            currentTeams.forEach((team) => {
              const resolvedTeamId = resolvedTeamIds.get(getTeamKey(team));
              const preQualTeam = preQualTeamByName.get(normalizeTeamName(team.teamName));
              if (!resolvedTeamId || !preQualTeam) return;
              (preQualDriversByTeamId.get(preQualTeam.id) ?? []).forEach((driver: LeagueSeasonDriverTable) => {
                desiredDriverTeams.set(driver.profile_id, resolvedTeamId);
              });
            });
          } else {
            // The pre-qual division assigns drivers directly to teams created here.
            currentAssignments.forEach((assignment) => {
              const resolvedTeamId = resolvedTeamIds.get(assignment.teamKey);
              if (resolvedTeamId) {
                desiredDriverTeams.set(assignment.driver, resolvedTeamId);
              }
            });
          }

          for (const driverRecord of currentDivisionDrivers) {
            // Update or remove existing driver-team relationships.
            const currentTeamId = driverRecord.team_id ?? "";
            const desiredTeamId = desiredDriverTeams.get(driverRecord.profile_id) ?? "";
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

          if (isLinkedDivision) {
            // Create missing division driver rows from pre-qual source records.
            for (const [profileId, resolvedTeamId] of desiredDriverTeams.entries()) {
              if (persistedAssignmentMap.has(profileId)) continue;

              const preQualDriver = preQualDriverDetailsByProfileId.get(profileId);
              const participant = participantDetailsByProfileId.get(profileId);
              if (!resolvedTeamId || (!preQualDriver && !participant)) continue;

              await createLeagueSeasonDriver({
                seasonId: seasonData.id,
                divisionId: activeDivisionId,
                profileId,
                displayName:
                  preQualDriver?.display_name ?? participant?.username ?? "Unknown Driver",
                gameType: preQualDriver?.game_type ?? participant?.game_type ?? "gt7",
                avatarType:
                  preQualDriver?.avatar_type ?? participant?.avatar_type ?? "preset",
                avatarValue:
                  preQualDriver?.avatar_value ?? participant?.avatar_value ?? "profile1",
                teamId: resolvedTeamId,
                addedToTeam: assignmentTimestamp,
              }).unwrap();
            }
          } else {
            // Create missing pre-qual driver rows from participant profile data.
            for (const assignment of currentAssignments) {
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
          }

          await Promise.all(
            removedTeamIds.map((teamId) => removeLeagueSeasonTeam({ teamId }).unwrap()),
          );
        })(),
        1000,
      );

      await refetchAfterSave();
      showToast({ usage: "success", message: "Team assignments updated." });
    } catch {
      handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveTeam = (index: number) => {
    const team = watchedTeams[index];
    if (!team) return;

    // Linked divisions can drop a referenced pre-qual team immediately.
    if (isLinkedDivision) {
      removeTeamRow(index);
      return;
    }

    const hasAssignedDrivers = watchedAssignments.some(
      (a) => a?.teamKey === getTeamKey(team),
    );

    const isAssignedToDifferentDivision = team.teamName && teamNamesAssignedToOtherDivisions.has(normalizeTeamName(team.teamName));

    if (isAssignedToDifferentDivision) {
      openModal(<TeamAssigned />);
      return;
    }

    if (hasAssignedDrivers) {
      openModal(<DriversAssigned />);
      return;
    }

    removeTeamRow(index);
  };

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

  const assignmentTabs = (
    <SegmentedTab
      tabs={ASSIGNMENT_TABS}
      activeTab={activeTab}
      onChange={handleTabChange}
    />
  );

  const driverListChildren =
    activeTab === "Drivers" ? (
      isLinkedDivision ? (
        // Linked divisions inherit drivers from pre-qual team membership — read-only.
        <PrequalDriversTable drivers={readOnlyDivisionDrivers} />
      ) : (
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
      )
    ) : isLinkedDivision ? (
      <LinkedDivisionTeamsTable
        teamFields={teamFields}
        teamErrors={errors.teams}
        getOptionsForRow={getPreQualTeamOptionsForRow}
        onRemoveTeam={handleRemoveTeam}
        onAddTeam={appendNextTeam}
        showEmptyState={preQualTeams.length === 0}
      />
    ) : (
      <>
        {/* The pre-qual division owns team creation and direct team editing. */}
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
        id={"team-assignments-form"}
        seasonName={seasonData.season_name}
        header={"Team Assignments"}
        filters={divisionFilter}
        listChildren={driverListChildren}
        tabs={assignmentTabs}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </FormProvider>
  );
};

export default PrequalTeamAssignments;

