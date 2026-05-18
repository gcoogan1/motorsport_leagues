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
import SegmentedTab from "@/components/Tabs/SegmentedTabs/SegmentedTab";
import SelectInput from "@/components/Inputs/SelectInput/SelectInput";
import TextInput from "@/components/Inputs/TextInput/TextInput";
import RemoveIcon from "@assets/Icon/Remove.svg?react";
import DeleteIcon from "@assets/Icon/Delete.svg?react";
import {
  useCreateLeagueSeasonDriverMutation,
  useGetLeagueParticipantsQuery,
  useGetLeagueSeasonDivisionsQuery,
  useGetLeagueSeasonDriversBySeasonIdQuery,
  useGetLeagueSeasonTeamsByDivisionQuery,
  useGetLeagueSeasonTeamsBySeasonIdQuery,
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
} from "../../TeamAssignments/TeamAssignments.styles";
import {
  TEAM_NAME_MAX_LENGTH,
  TEAM_DELETE_BLOCKED_MESSAGE,
  teamAssignmentsFormSchema,
  type TeamAssignmentsFormValues,
} from "../../TeamAssignments/teamAssignments.schema";
import {
  ASSIGNMENT_TABS,
  buildCurrentDivisionDrivers,
  buildDivisionOptions,
  buildDriverOptions,
  buildDriverParticipants,
  buildParticipantOptionsByProfileId,
  buildPersistedAssignments,
  buildPersistedTeams,
  createEmptyTeamRow,
  getTeamKey,
  TEAM_COLUMN_STYLE,
} from "../../TeamAssignments/TeamAssignments.util";
import {
  buildDriversAssignedToOtherDivisions,
  buildPreQualDriverDetailsByProfileId,
  buildPreQualDrivers,
  buildPreQualDriversByTeamId,
  buildPreQualTeamByName,
  buildSelectedTeamOptions,
  buildPreQualTeams,
  buildPreQualTeamOptionsForRow,
  buildReadOnlyDivisionDrivers,
  buildTeamNamesAssignedToOtherDivisions,
  findNextAvailablePreQualTeam,
} from "./prequalTeamAssignments.util";
import DriversAssigned from "@/features/leagues/modals/errors/DriversAssigned/DriversAssigned";
import CannotSave from "@/features/leagues/modals/errors/CannotSave/CannotSave";
import NoTeams from "@/features/leagues/modals/errors/NoTeams/NoTeams";
import NoDrivers from "@/features/leagues/modals/errors/NoDrivers/NoDrivers";
import PrequalDriversTable from "../Driver/PrequalDriversTable";
import PrequalTeamsTable from "./PrequalTeamsTable";

type PrequalTeamAssignmentsProps = {
  seasonData: LeagueSeasonTable;
  onDirtyChange?: (isDirty: boolean) => void;
};

const PrequalTeamAssignments = ({
  seasonData,
  onDirtyChange,
}: PrequalTeamAssignmentsProps) => {
  const { openModal } = useModal();
  const { showToast } = useToast();
  const [selectedDivisionId, setSelectedDivisionId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [loadedTeamsKey, setLoadedTeamsKey] = useState("");
  const [loadedAssignmentsKey, setLoadedAssignmentsKey] = useState("");
  const [activeTab, setActiveTab] = useState<string>(ASSIGNMENT_TABS[0].label);
  const seasonDivisions = useGetLeagueSeasonDivisionsQuery(seasonData.id);
  const firstDivisionId = seasonDivisions.data?.[0]?.id ?? "";
  const activeDivisionId = selectedDivisionId || firstDivisionId;
  const leagueParticipants = useGetLeagueParticipantsQuery(seasonData.league_id);
  const seasonDriversBySeason = useGetLeagueSeasonDriversBySeasonIdQuery(seasonData.id);
  const seasonTeamsByDivision = useGetLeagueSeasonTeamsByDivisionQuery(activeDivisionId, {
    skip: !activeDivisionId,
  });
  const seasonTeamsBySeason = useGetLeagueSeasonTeamsBySeasonIdQuery(seasonData.id);
  const [createLeagueSeasonDriver] = useCreateLeagueSeasonDriverMutation();
  const [removeLeagueSeasonDriver] = useRemoveLeagueSeasonDriverMutation();
  const [updateLeagueSeasonDriverTeam] = useUpdateLeagueSeasonDriverTeamMutation();
  const [createLeagueSeasonTeam] = useCreateLeagueSeasonTeamMutation();
  const [updateLeagueSeasonTeam] = useUpdateLeagueSeasonTeamMutation();
  const [removeLeagueSeasonTeam] = useRemoveLeagueSeasonTeamMutation();

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
    reset,
    setValue,
    formState: { errors, isDirty },
  } = formMethods;

  const {
    fields: teamFields,
    append: appendTeam,
    remove: removeTeamRow,
    replace: replaceTeamRows,
  } = useFieldArray({
    control,
    name: "teams",
  });

  const {
    fields: assignmentFields,
    append: appendAssignment,
    remove: removeAssignment,
    replace: replaceAssignmentRows,
  } = useFieldArray({
    control,
    name: "assignments",
  });

  const watchedTeamsValue = useWatch({ control, name: "teams" });
  const watchedAssignmentsValue = useWatch({ control, name: "assignments" });
  const watchedTeams = useMemo(() => watchedTeamsValue ?? [], [watchedTeamsValue]);
  const watchedAssignments = useMemo(
    () => watchedAssignmentsValue ?? [],
    [watchedAssignmentsValue],
  );

  // Build the division filter options once the season divisions load.
  const divisionOptions = useMemo(
    () => buildDivisionOptions(seasonDivisions.data),
    [seasonDivisions.data],
  );

  const defaultDivisionId = divisionOptions[0]?.value ?? "";

  const preQualDivision = useMemo(
    () => seasonDivisions.data?.find((division) => division.division_number === 0),
    [seasonDivisions.data],
  );

  const currentDivision = useMemo(
    () => seasonDivisions.data?.find((division) => division.id === activeDivisionId),
    [activeDivisionId, seasonDivisions.data],
  );

  const preQualDivisionId = preQualDivision?.id ?? "";
  // Division 0 is the source of truth. Other divisions only reference those teams.
  const isPreQualDivision = currentDivision?.division_number === 0;
  const isLinkedDivision = !!currentDivision && currentDivision.division_number !== 0;

  useEffect(() => {
    // Keep the selected division valid as divisions load or change.
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
  }, [defaultDivisionId, divisionOptions]);

  useEffect(() => {
    // Switching divisions starts from a clean local form state before persisted rows hydrate.
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

  // Prefer the latest stable query payload while refetches are in flight.
  const seasonTeams = seasonTeamsBySeason.currentData ?? seasonTeamsBySeason.data;
  const seasonDrivers = seasonDriversBySeason.currentData ?? seasonDriversBySeason.data;

  // These are the editable driver rows for the currently selected division only.
  const currentDivisionDrivers = useMemo(
    () => buildCurrentDivisionDrivers(seasonDrivers, activeDivisionId),
    [activeDivisionId, seasonDrivers],
  );

  // Division-scoped teams back the editable Teams tab for the active division.
  const divisionTeams = useMemo(
    () => seasonTeamsByDivision.currentData ?? seasonTeamsByDivision.data ?? [],
    [seasonTeamsByDivision.currentData, seasonTeamsByDivision.data],
  );

  const currentDivisionTeamsById = useMemo(
    () => new Map(divisionTeams.map((team) => [team.id, team])),
    [divisionTeams],
  );

  const readOnlyDivisionDrivers = useMemo(
    () => buildReadOnlyDivisionDrivers(currentDivisionDrivers, currentDivisionTeamsById),
    [currentDivisionDrivers, currentDivisionTeamsById],
  );

  // Pre-qual teams and drivers act as the source set for every linked division.
  const preQualTeams = useMemo(
    () => buildPreQualTeams(seasonTeams, preQualDivisionId),
    [preQualDivisionId, seasonTeams],
  );

  const preQualTeamByName = useMemo(
    () => buildPreQualTeamByName(preQualTeams),
    [preQualTeams],
  );

  const preQualDrivers = useMemo(
    () => buildPreQualDrivers(seasonDrivers, preQualDivisionId),
    [preQualDivisionId, seasonDrivers],
  );

  const preQualDriversByTeamId = useMemo(
    () => buildPreQualDriversByTeamId(preQualDrivers),
    [preQualDrivers],
  );

  const preQualDriverDetailsByProfileId = useMemo(
    () => buildPreQualDriverDetailsByProfileId(preQualDrivers),
    [preQualDrivers],
  );

  // Once a linked division claims a pre-qual team, other linked divisions cannot reuse it.
  const teamNamesAssignedToOtherDivisions = useMemo(
    () =>
      buildTeamNamesAssignedToOtherDivisions(
        seasonTeams,
        activeDivisionId,
        preQualDivisionId,
      ),
    [activeDivisionId, preQualDivisionId, seasonTeams],
  );

  const persistedTeams = useMemo(
    () => buildPersistedTeams(divisionTeams),
    [divisionTeams],
  );

  const persistedTeamsKey = useMemo(
    () =>
      `${activeDivisionId}:${persistedTeams
        .map((team) => `${team.teamId ?? team.localId}:${team.teamName}`)
        .join("|")}`,
    [activeDivisionId, persistedTeams],
  );

  useEffect(() => {
    if (persistedTeamsKey === loadedTeamsKey) {
      return;
    }

    // Replace only the team rows so local appends are not wiped by a full form reset.
    replaceTeamRows(persistedTeams);
    setLoadedTeamsKey(persistedTeamsKey);
  }, [loadedTeamsKey, persistedTeams, persistedTeamsKey, replaceTeamRows]);

  const persistedAssignments = useMemo(
    () => (isLinkedDivision ? [] : buildPersistedAssignments(currentDivisionDrivers)),
    [currentDivisionDrivers, isLinkedDivision],
  );

  const persistedAssignmentsKey = useMemo(
    () =>
      `${activeDivisionId}:${persistedAssignments
        .map((assignment) => `${assignment.driver}:${assignment.teamKey}`)
        .join("|")}`,
    [activeDivisionId, persistedAssignments],
  );

  useEffect(() => {
    if (persistedAssignmentsKey === loadedAssignmentsKey) {
      return;
    }

    // Linked divisions keep drivers read-only, so this only hydrates editable rows where needed.
    replaceAssignmentRows(persistedAssignments);
    setLoadedAssignmentsKey(persistedAssignmentsKey);
  }, [
    loadedAssignmentsKey,
    persistedAssignments,
    persistedAssignmentsKey,
    replaceAssignmentRows,
  ]);

  useEffect(() => {
    // Bubble unsaved state to the parent sheet guard.
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    // Mirror the sheet-level unsaved changes guard on browser refresh/navigation.
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
    () => new Map(currentDivisionDrivers.map((driver) => [driver.profile_id, driver])),
    [currentDivisionDrivers],
  );

  const driversAssignedToOtherDivisions = useMemo(
    () =>
      buildDriversAssignedToOtherDivisions(
        seasonDrivers,
        activeDivisionId,
        preQualDivisionId,
      ),
    [activeDivisionId, preQualDivisionId, seasonDrivers],
  );

  const teamOptions = useMemo(
    () => buildSelectedTeamOptions(watchedTeams),
    [watchedTeams],
  );

  useEffect(() => {
    // Clear the delete guard once no current driver row points at the team anymore.
    watchedTeams.forEach((team, index) => {
      if (!team) {
        return;
      }

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

  const getDriverOptionsForRow = (rowIndex: number) => {
    // Keep the current row selection visible while preventing duplicate driver use.
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

  const getPreQualTeamOptionsForRow = (rowIndex: number) =>
    // Keep the current selection visible while filtering out teams already used elsewhere.
    buildPreQualTeamOptionsForRow(
      watchedTeams.map((team) => team?.teamName ?? ""),
      rowIndex,
      preQualTeams,
      teamNamesAssignedToOtherDivisions,
    );

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const appendNextDriver = () => {
    // Drivers cannot be added until the division has at least one team to assign them to.
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

  const appendNextTeam = () => {
    if (isPreQualDivision) {
      // Division 0 creates its own teams directly.
      appendTeam(createEmptyTeamRow(), { shouldFocus: false });
      return;
    }

    // Linked divisions only select from the unused teams already created in pre-qual.
    const currentTeams = formMethods.getValues("teams") ?? [];
    const emptyRowIndex = currentTeams.findIndex(
      (team) => !(team?.teamName?.trim() ?? ""),
    );
    const nextTeam = findNextAvailablePreQualTeam(
      currentTeams.map((team) => team?.teamName ?? ""),
      preQualTeams,
      teamNamesAssignedToOtherDivisions,
    );

    if (!nextTeam) {
      openModal(<NoTeams isPreQual />);
      return;
    }

    if (emptyRowIndex >= 0) {
      // Reuse a blank row before appending another select row.
      setValue(`teams.${emptyRowIndex}.teamName`, nextTeam.team_name, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      return;
    }

    appendTeam(
      {
        ...createEmptyTeamRow(),
        teamName: nextTeam.team_name,
      },
      { shouldFocus: false },
    );
  };

  const handleSave = async () => {
    if (!activeDivisionId) {
      return;
    }

    // Validate first so the active tab can jump to the slice that needs attention.
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

    const currentTeams = (formMethods.getValues("teams") ?? [])
      .map((team) => ({ ...team, teamName: team?.teamName?.trim() ?? "" }))
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

    if (
      isLinkedDivision &&
      currentTeams.some(
        (team) =>
          !preQualTeamByName.has(team.teamName) ||
          teamNamesAssignedToOtherDivisions.has(team.teamName),
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
          // All writes use the same timestamp so team ordering stays consistent in the UI.
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
              const preQualTeam = preQualTeamByName.get(team.teamName);

              if (!resolvedTeamId || !preQualTeam) {
                return;
              }

              const preQualTeamDrivers = preQualDriversByTeamId.get(preQualTeam.id) ?? [];

              preQualTeamDrivers.forEach((driver) => {
                desiredDriverTeams.set(driver.profile_id, resolvedTeamId);
              });
            });
          } else {
            // The pre-qual division assigns drivers directly to the teams created here.
            currentAssignments.forEach((assignment) => {
              const resolvedTeamId = resolvedTeamIds.get(assignment.teamKey);

              if (resolvedTeamId) {
                desiredDriverTeams.set(assignment.driver, resolvedTeamId);
              }
            });
          }

          for (const driverRecord of currentDivisionDrivers) {
            // Remove stale links and update existing driver-team relationships in place.
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

          if (isLinkedDivision) {
            // Create missing division driver rows from the pre-qual source records.
            for (const [profileId, resolvedTeamId] of desiredDriverTeams.entries()) {
              if (persistedAssignmentMap.has(profileId)) {
                continue;
              }

              const preQualDriver = preQualDriverDetailsByProfileId.get(profileId);
              const participant = participantDetailsByProfileId.get(profileId);

              if (!resolvedTeamId || (!preQualDriver && !participant)) {
                continue;
              }

              await createLeagueSeasonDriver({
                seasonId: seasonData.id,
                divisionId: activeDivisionId,
                profileId,
                displayName:
                  preQualDriver?.display_name ?? participant?.username ?? "Unknown Driver",
                gameType:
                  preQualDriver?.game_type ?? participant?.game_type ?? "gt7",
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
        seasonTeamsBySeason.refetch(),
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

  const handleRemoveTeam = (index: number) => {
    // Linked divisions can drop a referenced pre-qual team immediately.
    const team = watchedTeams[index];

    if (!team) {
      return;
    }

    const teamKey = getTeamKey(team);
    const hasAssignedDrivers = watchedAssignments.some(
      (assignment) => assignment?.teamKey === teamKey,
    );

    if (isLinkedDivision) {
      removeTeamRow(index);
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

  // Team championships always switch between team selection and driver assignment views.
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
        // Linked divisions inherit drivers from pre-qual team membership only.
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
      <PrequalTeamsTable
        teamFields={teamFields}
        teamErrors={errors.teams}
        getOptionsForRow={getPreQualTeamOptionsForRow}
        onRemoveTeam={handleRemoveTeam}
        onAddTeam={appendNextTeam}
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
