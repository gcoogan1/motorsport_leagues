import { useEffect, useMemo, useState } from "react";
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
import {
  useCreateLeagueSeasonDriverMutation,
  useGetLeagueParticipantsQuery,
  useGetLeagueSeasonDivisionsQuery,
  useGetLeagueSeasonDriversBySeasonIdQuery,
  useGetLeagueSeasonTeamsByDivisionQuery,
  useRemoveLeagueSeasonDriverMutation,
  useCreateLeagueSeasonTeamMutation,
  useRemoveLeagueSeasonTeamMutation,
  useUpdateLeagueSeasonDriverTeamMutation,
  useUpdateLeagueSeasonTeamMutation,
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
} from "./TeamAssignments.styles";
import SegmentedTab from "@/components/Tabs/SegmentedTabs/SegmentedTab";
import SelectInput from "@/components/Inputs/SelectInput/SelectInput";
import TextInput from "@/components/Inputs/TextInput/TextInput";
import {
  TEAM_DELETE_BLOCKED_MESSAGE,
  TEAM_NAME_MAX_LENGTH,
  teamAssignmentsFormSchema,
  type TeamAssignmentsFormValues,
} from "./teamAssignments.schema";
import {
  ASSIGNMENT_TABS,
  buildCurrentDivisionDrivers,
  buildDivisionOptions,
  buildDriverOptions,
  buildDriverParticipants,
  buildDriversAssignedToOtherDivisions,
  buildParticipantOptionsByProfileId,
  buildPersistedAssignments,
  buildPersistedTeams,
  buildTeamOptions,
  createEmptyTeamRow,
  getTeamKey,
  TEAM_COLUMN_STYLE,
} from "./TeamAssignments.util";
import DriversAssigned from "@/features/leagues/modals/errors/DriversAssigned/DriversAssigned";
import CannotSave from "@/features/leagues/modals/errors/CannotSave/CannotSave";
import NoTeams from "@/features/leagues/modals/errors/NoTeams/NoTeams";
import NoDrivers from "@/features/leagues/modals/errors/NoDrivers/NoDrivers";

type TeamAssignmentsProps = {
  seasonData: LeagueSeasonTable;
  onDirtyChange?: (isDirty: boolean) => void;
};

const TeamAssignments = ({ seasonData, onDirtyChange }: TeamAssignmentsProps) => {
  const { openModal } = useModal();
  const { showToast } = useToast();
  const [selectedDivisionId, setSelectedDivisionId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  // This is a snapshot key to ensure teams only load into the form when the underlying data actually changes, preventing form reset on unrelated data updates.
  const [loadedTeamsKey, setLoadedTeamsKey] = useState(""); 
  // This is a snapshot key to ensure driver assignments only load into the form when the underlying data actually changes, preventing form reset on unrelated data updates.
  const [loadedAssignmentsKey, setLoadedAssignmentsKey] = useState("");
  const seasonDivisions = useGetLeagueSeasonDivisionsQuery(seasonData.id);
  const firstDivisionId = seasonDivisions.data?.[0]?.id ?? "";
  const activeDivisionId = selectedDivisionId || firstDivisionId;
  const leagueParticipants = useGetLeagueParticipantsQuery(
    seasonData.league_id,
  );
  const seasonDriversBySeason = useGetLeagueSeasonDriversBySeasonIdQuery(
    seasonData.id,
  );
  const seasonTeamsByDivision = useGetLeagueSeasonTeamsByDivisionQuery(activeDivisionId, {
    skip: !activeDivisionId,
  });
  const isTeamChampionship = seasonData.is_team_championship;
  const [activeTab, setActiveTab] = useState<string>(ASSIGNMENT_TABS[0].label);

  // -- Mutations -- //

  const [createLeagueSeasonDriver] = useCreateLeagueSeasonDriverMutation();
  const [removeLeagueSeasonDriver] = useRemoveLeagueSeasonDriverMutation();
  const [updateLeagueSeasonDriverTeam] = useUpdateLeagueSeasonDriverTeamMutation();
  const [createLeagueSeasonTeam] = useCreateLeagueSeasonTeamMutation();
  const [updateLeagueSeasonTeam] = useUpdateLeagueSeasonTeamMutation();
  const [removeLeagueSeasonTeam] = useRemoveLeagueSeasonTeamMutation();

  // -- Form Methods -- //

  const formMethods = useForm<TeamAssignmentsFormValues>({
    resolver: zodResolver(teamAssignmentsFormSchema),
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
    getValues,
    reset,
    formState: { errors },
  } = formMethods;
  const {
    formState: { isDirty },
  } = formMethods;
  const {
    fields: teamFields,
    append: appendTeam,
    remove: removeTeamRow,
  } = useFieldArray({
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


  // -- Watchers and Effects -- //

  const watchedTeamsValue = useWatch({ control, name: "teams" });
  const watchedAssignmentsValue = useWatch({ control, name: "assignments" });
  const watchedTeams = useMemo(() => watchedTeamsValue ?? [], [watchedTeamsValue]);
  const watchedAssignments = useMemo(
    () => watchedAssignmentsValue ?? [],
    [watchedAssignmentsValue],
  );


  // -- Division -- //

  // Builds the division dropdown options for the assignment filter.
  const divisionOptions = useMemo(
    () => buildDivisionOptions(seasonDivisions.data),
    [seasonDivisions.data],
  );

  const defaultDivisionId = useMemo(
    () =>
      seasonDivisions.data?.find((division) => division.division_number === 1)
        ?.id ?? divisionOptions[0]?.value ?? "",
    [divisionOptions, seasonDivisions.data],
  );

  // Keeps the selected DIVISION option valid, defaulting to the first DIVISION.
  useEffect(() => {
    if (!divisionOptions.length) {
      setSelectedDivisionId("");
      return;
    }

    setSelectedDivisionId((currentValue) => {
      if (
        currentValue &&
        divisionOptions.some((option) => option.value === currentValue)
      ) {
        return currentValue;
      }

      return defaultDivisionId;
    });
  }, [divisionOptions, defaultDivisionId]);

  // Clears the form rows before loading data for a different DIVISION.
  useEffect(() => {
    if (!activeDivisionId) {
      return;
    }

    reset(
      { teams: [], assignments: [] },
      { keepDirty: false, keepTouched: false },
    );
    setLoadedTeamsKey("");
    setLoadedAssignmentsKey("");
  }, [activeDivisionId, reset]);

  
  // -- Drivers -- //

  // Narrows league participants down to driver profiles only.
  const driverParticipants = useMemo(
    () => buildDriverParticipants(leagueParticipants.data),
    [leagueParticipants.data],
  );

  // Maps profile ids to the option shape used by the driver select input.
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

  // Builds the full driver option list for the selected division.
  const driverOptions = useMemo(
    () => buildDriverOptions(driverParticipants),
    [driverParticipants],
  );

  // Filters the season driver records down to the active division.
  const currentDivisionDrivers = useMemo(
    () => buildCurrentDivisionDrivers(seasonDriversBySeason.data, activeDivisionId),
    [activeDivisionId, seasonDriversBySeason.data],
  );

  // -- Assignments -- //

  // Converts persisted teams into form rows for the active division.
  const persistedTeams = useMemo(
    () => buildPersistedTeams(seasonTeamsByDivision.currentData),
    [seasonTeamsByDivision.currentData],
  );

  // Creates a snapshot key so team data only loads when the server state actually changes.
  const persistedTeamsKey = useMemo(
    () =>
      `${activeDivisionId}:${persistedTeams
        .map(
          (team) =>
            `${team.teamId ?? team.localId}:${team.teamName}`,
        )
        .join("|")}`,
    [activeDivisionId, persistedTeams],
  );

  // Loads the active division's saved teams into the form once per data snapshot.
  useEffect(() => {
    if (persistedTeamsKey === loadedTeamsKey) {
      return;
    }

    reset(
      {
        ...getValues(),
        teams: persistedTeams,
      },
      { keepDirty: false, keepTouched: false },
    );
    setLoadedTeamsKey(persistedTeamsKey);
  }, [getValues, loadedTeamsKey, persistedTeams, persistedTeamsKey, reset]);

  // Converts saved team assignments into driver rows for the active division.
  const persistedAssignments = useMemo(
    () => buildPersistedAssignments(currentDivisionDrivers),
    [currentDivisionDrivers],
  );

  // Creates a snapshot key so driver assignments only load when saved data changes.
  const persistedAssignmentsKey = useMemo(
    () =>
      `${activeDivisionId}:${persistedAssignments
        .map((assignment) => `${assignment.driver}:${assignment.teamKey}`)
        .join("|")}`,
    [activeDivisionId, persistedAssignments],
  );

  // Loads the active division's saved driver-team links into the form once per snapshot.
  useEffect(() => {
    if (persistedAssignmentsKey === loadedAssignmentsKey) {
      return;
    }

    reset(
      {
        ...getValues(),
        assignments: persistedAssignments,
      },
      { keepDirty: false, keepTouched: false },
    );
    setLoadedAssignmentsKey(persistedAssignmentsKey);
  }, [
    getValues,
    loadedAssignmentsKey,
    persistedAssignments,
    persistedAssignmentsKey,
    reset,
  ]);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
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

  // Indexes persisted driver records by profile id for save-time updates.
  const persistedAssignmentMap = useMemo(
    () => new Map(currentDivisionDrivers.map((driver) => [driver.profile_id, driver])),
    [currentDivisionDrivers],
  );

  // Tracks drivers already assigned to other divisions so they can be EXCLUDED locally.
  const driversAssignedToOtherDivisions = useMemo(
    () =>
      buildDriversAssignedToOtherDivisions(
        seasonDriversBySeason.data,
        activeDivisionId,
      ),
    [activeDivisionId, seasonDriversBySeason.data],
  );

  // Teams
  //  --> Builds the team select options from non-empty team rows. 
  // Only teams with names are valid options for driver assignments.
  const teamOptions = useMemo(
    () => buildTeamOptions(watchedTeams),
    [watchedTeams],
  );

  // Clears the delete-blocking error as soon as a team no longer has assigned drivers.
  useEffect(() => {
    watchedTeams.forEach((team, index) => {
      const fieldName = `teams.${index}.teamName` as const;
      const teamKey = getTeamKey(team);
      const hasAssignedDrivers = watchedAssignments.some(
        (assignment) => assignment?.teamKey === teamKey,
      );
      const currentMessage = errors.teams?.[index]?.teamName?.message;

      if (hasAssignedDrivers) {
        return;
      }

      if (currentMessage === TEAM_DELETE_BLOCKED_MESSAGE) {
        clearErrors(fieldName);
      }
    });
  }, [clearErrors, errors.teams, watchedAssignments, watchedTeams]);

  // Driver Profiles
  //  --> Returns the driver options for one row while preserving that row's current selection.
  const getDriverOptionsForRow = (rowIndex: number) => {
    const selectedDriverIds = new Set(
      watchedAssignments
        .map((assignment, index) =>
          index === rowIndex ? "" : (assignment?.driver ?? ""),
        )
        .filter(Boolean),
    );
    const currentValue = watchedAssignments[rowIndex]?.driver;

    const filteredOptions = driverOptions.filter(
      (option) =>
        option.value === currentValue ||
        (!selectedDriverIds.has(option.value) &&
          !driversAssignedToOtherDivisions.has(option.value)),
    );

    const currentAssignedOption = currentValue
      ? participantOptionsByProfileId.get(currentValue)
      : undefined;

    if (
      currentAssignedOption &&
      !filteredOptions.some(
        (option) => option.value === currentAssignedOption.value,
      )
    ) {
      return [currentAssignedOption, ...filteredOptions];
    }

    return filteredOptions;
  };

  // -- Handlers -- //

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Add driver row
  const appendNextDriver = () => {
    if (teamOptions.length === 0) {
      openModal(<NoTeams />);
      return;
    }

    const selectedDriverIds = new Set(
      watchedAssignments
        .map((assignment) => assignment?.driver ?? "")
        .filter(Boolean),
    );
    const nextDriver = driverOptions.find(
      (option) =>
        !selectedDriverIds.has(option.value) &&
        !driversAssignedToOtherDivisions.has(option.value),
    );

    if (!nextDriver) {
      openModal(<NoDrivers />);
      return;
    }

    appendAssignment(
      { driver: nextDriver.value, teamKey: teamOptions[0]?.value ?? "" },
      { shouldFocus: false },
    );
  };

// Add team row
  const appendNextTeam = () => {
    appendTeam(createEmptyTeamRow(), { shouldFocus: false });
  };

  // Persists team rows first, then syncs driver-team assignments for the active division.
  const handleSave = async () => {
    if (!activeDivisionId) {
      return;
    }

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
      .map((team) => ({ ...team, teamName: team.teamName.trim() }))
      .filter((team) => team.teamName);

    const removedTeamIds = persistedTeams
      .filter(
        (persistedTeam) =>
          persistedTeam.teamId &&
          !currentTeams.some((currentTeam) => currentTeam.teamId === persistedTeam.teamId),
      )
      .map((team) => team.teamId as string);

    const changedTeams = currentTeams.filter(
      (team) =>
        team.teamId &&
        persistedTeams.some(
          (persistedTeam) =>
            persistedTeam.teamId === team.teamId && persistedTeam.teamName !== team.teamName,
        ),
    );

    const newTeams = currentTeams.filter((team) => !team.teamId);

    const currentAssignments = (formMethods.getValues("assignments") ?? []).filter(
      (assignment) => assignment.driver && assignment.teamKey,
    );

    try {
      setIsSaving(true);

      await withMinDelay(
        (async () => {
          const assignmentTimestamp = new Date().toISOString();

          const createdTeams = [];
           // Needed to ensure teams are created in order
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

          currentAssignments.forEach((assignment) => {
            const resolvedTeamId = resolvedTeamIds.get(assignment.teamKey);

            if (resolvedTeamId) {
              desiredDriverTeams.set(assignment.driver, resolvedTeamId);
            }
          });

          for (const driverRecord of currentDivisionDrivers) {
            const currentTeamId = driverRecord.team_id ?? "";
            const desiredTeamId = desiredDriverTeams.get(driverRecord.profile_id) ?? "";

            if (currentTeamId === desiredTeamId) {
              continue;
            }

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

          for (const assignment of currentAssignments) {
            if (persistedAssignmentMap.has(assignment.driver)) {
              continue;
            }

            const resolvedTeamId = resolvedTeamIds.get(assignment.teamKey);
            const participant = participantDetailsByProfileId.get(assignment.driver);

            if (!resolvedTeamId || !participant) {
              continue;
            }

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

          await Promise.all(
            removedTeamIds.map((teamId) =>
              removeLeagueSeasonTeam({ teamId }).unwrap(),
            ),
          );
        })(),
        1000,
      );

      await Promise.all([
        seasonDriversBySeason.refetch(),
        seasonTeamsByDivision.refetch(),
      ]);
      showToast({
        usage: "success",
        message: "Team assignments updated.",
      });
    } catch {
      handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
    } finally {
      setIsSaving(false);
    }
  };

    // Blocks deleting a team while any current driver row still points at it.
  const handleRemoveTeam = (index: number) => {
    const team = watchedTeams[index];

    if (!team) {
      return;
    }

    const teamKey = getTeamKey(team);
    const hasAssignedDrivers = watchedAssignments.some(
      (assignment) => assignment?.teamKey === teamKey,
    );

    if (hasAssignedDrivers) {
      openModal(<DriversAssigned />);
      
      return;
    }

    removeTeamRow(index);
  };

  // -- Components -- //
  // Renders the division filter when more than one division is available.
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

  // Renders the segmented Team and Driver tabs for team championships.
  const assignmentTabs = isTeamChampionship ? (
    <SegmentedTab
      tabs={ASSIGNMENT_TABS}
      activeTab={activeTab}
      onChange={handleTabChange}
    />
  ) : null;

  const driverListChildren = (
    <>
      {assignmentFields.length > 0 && (
        <TableWrapper
        >
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
                    icon={{ left: <RemoveIcon /> }}
                    onClick={() => handleRemoveTeam(index)}
                  />
                </ExtraCell>
              </TableRow>
            ))}
          </TableBody>
        </TableWrapper>
      )}
      <AddItem label="Add Team" onClick={appendNextTeam} />
    </>
  );

  return (
    <FormProvider {...formMethods}>
      <SheetForm
        id={"team-assignments-form"}
        seasonName={seasonData.season_name}
        header={"Team Assignments"}
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
