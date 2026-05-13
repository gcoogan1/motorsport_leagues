import { useEffect, useMemo, useState } from "react";
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
  LeagueParticipantProfile,
  LeagueSeasonDriverTable,
  LeagueSeasonTeamTable,
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
import SegmentedTab from "@/components/Tabs/SegmentedTabs/SegmentedTab";
import SelectInput from "@/components/Inputs/SelectInput/SelectInput";
import TextInput from "@/components/Inputs/TextInput/TextInput";

type TeamRow = {
  teamId?: string;
  localId: string;
  teamName: string;
};

type DriverAssignmentRow = {
  driver: string;
  teamKey: string;
};

type TeamAssignmentsFormValues = {
  teams: TeamRow[];
  assignments: DriverAssignmentRow[];
};

type TeamAssignmentsProps = {
  seasonData: LeagueSeasonTable;
};

const TeamAssignments = ({ seasonData }: TeamAssignmentsProps) => {
  const { openModal } = useModal();
  const { showToast } = useToast();
  const [selectedDivisionId, setSelectedDivisionId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [hydratedTeamsKey, setHydratedTeamsKey] = useState("");
  const [hydratedAssignmentsKey, setHydratedAssignmentsKey] = useState("");
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
  const [createLeagueSeasonDriver] = useCreateLeagueSeasonDriverMutation();
  const [removeLeagueSeasonDriver] = useRemoveLeagueSeasonDriverMutation();
  const [updateLeagueSeasonDriverTeam] = useUpdateLeagueSeasonDriverTeamMutation();
  const [createLeagueSeasonTeam] = useCreateLeagueSeasonTeamMutation();
  const [updateLeagueSeasonTeam] = useUpdateLeagueSeasonTeamMutation();
  const [removeLeagueSeasonTeam] = useRemoveLeagueSeasonTeamMutation();
  const formMethods = useForm<TeamAssignmentsFormValues>({
    defaultValues: {
      teams: [],
      assignments: [],
    },
  });
  const { control } = formMethods;
  const {
    fields: teamFields,
    append: appendTeam,
    remove: removeTeamRow,
    replace: replaceTeams,
  } = useFieldArray({
    control,
    name: "teams",
  });
  const {
    fields: assignmentFields,
    append: appendAssignment,
    remove: removeAssignment,
    replace: replaceAssignments,
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
  const isTeamChampionship = seasonData.is_team_championship;
  const tabs = [{ label: "Team" }, { label: "Driver" }];
  const [activeTab, setActiveTab] = useState<string>(tabs ? tabs[0].label : "");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const createEmptyTeamRow = (): TeamRow => ({
    localId: `team-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    teamName: "",
  });

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
      if (
        currentValue &&
        divisionOptions.some((option) => option.value === currentValue)
      ) {
        return currentValue;
      }

      return divisionOptions[0]?.value ?? "";
    });
  }, [divisionOptions]);

  useEffect(() => {
    if (!activeDivisionId) {
      return;
    }

    replaceTeams([]);
    replaceAssignments([]);
    setHydratedTeamsKey("");
    setHydratedAssignmentsKey("");
  }, [activeDivisionId, replaceAssignments, replaceTeams]);

  // -- Drivers -- //
  const driverParticipants = useMemo(
    () =>
      (leagueParticipants.data ?? []).filter(
        (participant: LeagueParticipantProfile) =>
          participant.roles.includes("driver"),
      ),
    [leagueParticipants.data],
  );

  const participantOptionsByProfileId = useMemo(
    () =>
      new Map(
        (leagueParticipants.data ?? []).map(
          (participant: LeagueParticipantProfile) => [
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
          ],
        ),
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

  const currentDivisionDrivers = useMemo(
    () =>
      (seasonDriversBySeason.data ?? []).filter(
        (assignment: LeagueSeasonDriverTable) => assignment.division_id === activeDivisionId,
      ),
    [activeDivisionId, seasonDriversBySeason.data],
  );

  // -- Assignments -- //

  const persistedTeams = useMemo(
    () =>
      (seasonTeamsByDivision.currentData ?? []).map((team: LeagueSeasonTeamTable) => ({
        teamId: team.id,
        localId: team.id,
        teamName: team.team_name,
      })),
    [seasonTeamsByDivision.currentData],
  );

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

  useEffect(() => {
    if (persistedTeamsKey === hydratedTeamsKey) {
      return;
    }

    replaceTeams(persistedTeams);
    setHydratedTeamsKey(persistedTeamsKey);
  }, [hydratedTeamsKey, persistedTeams, persistedTeamsKey, replaceTeams]);

  const persistedAssignments = useMemo(
    () =>
      currentDivisionDrivers
        .filter((assignment: LeagueSeasonDriverTable) => !!assignment.team_id)
        .map((assignment: LeagueSeasonDriverTable) => ({
          driver: assignment.profile_id,
          teamKey: assignment.team_id ?? "",
        })),
    [currentDivisionDrivers],
  );

  const persistedAssignmentsKey = useMemo(
    () =>
      `${activeDivisionId}:${persistedAssignments
        .map((assignment) => `${assignment.driver}:${assignment.teamKey}`)
        .join("|")}`,
    [activeDivisionId, persistedAssignments],
  );

  useEffect(() => {
    if (persistedAssignmentsKey === hydratedAssignmentsKey) {
      return;
    }

    replaceAssignments(persistedAssignments);
    setHydratedAssignmentsKey(persistedAssignmentsKey);
  }, [
    hydratedAssignmentsKey,
    persistedAssignments,
    persistedAssignmentsKey,
    replaceAssignments,
  ]);

  const persistedAssignmentMap = useMemo(
    () => new Map(currentDivisionDrivers.map((driver) => [driver.profile_id, driver])),
    [currentDivisionDrivers],
  );

  const driversAssignedToOtherDivisions = useMemo(
    () =>
      new Set(
        (seasonDriversBySeason.data ?? [])
          .filter(
            (assignment: LeagueSeasonDriverTable) =>
              assignment.division_id !== activeDivisionId,
          )
          .map((assignment: LeagueSeasonDriverTable) => assignment.profile_id),
      ),
    [activeDivisionId, seasonDriversBySeason.data],
  );

  const teamOptions = useMemo(
    () =>
      watchedTeams
        .filter((team) => team.teamName.trim())
        .map((team) => ({
          value: team.teamId ?? team.localId,
          label: team.teamName.trim(),
        })),
    [watchedTeams],
  );

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

  const appendNextDriver = () => {
    if (teamOptions.length === 0) {
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
      return;
    }

    appendAssignment(
      { driver: nextDriver.value, teamKey: teamOptions[0]?.value ?? "" },
      { shouldFocus: false },
    );
  };

  const appendNextTeam = () => {
    appendTeam(createEmptyTeamRow(), { shouldFocus: false });
  };

  // -- Handlers -- //
  const handleSave = async () => {
    if (!activeDivisionId) {
      return;
    }

    const currentTeams = (formMethods.getValues("teams") ?? [])
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
          const createdTeams = await Promise.all(
            newTeams.map((team) =>
              createLeagueSeasonTeam({
                seasonId: seasonData.id,
                divisionId: activeDivisionId,
                teamName: team.teamName,
              }).unwrap(),
            ),
          );

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
            resolvedTeamIds.set(team.teamId ?? team.localId, team.teamId ?? "");
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
              }).unwrap();
              continue;
            }

            if (currentTeamId) {
              await removeLeagueSeasonDriver({ driverId: driverRecord.id }).unwrap();
              await createLeagueSeasonDriver({
                seasonId: seasonData.id,
                divisionId: activeDivisionId,
                profileId: driverRecord.profile_id,
              }).unwrap();
            }
          }

          for (const assignment of currentAssignments) {
            if (persistedAssignmentMap.has(assignment.driver)) {
              continue;
            }

            const resolvedTeamId = resolvedTeamIds.get(assignment.teamKey);

            if (!resolvedTeamId) {
              continue;
            }

            await createLeagueSeasonDriver({
              seasonId: seasonData.id,
              divisionId: activeDivisionId,
              profileId: assignment.driver,
              teamId: resolvedTeamId,
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

  // -- Components -- //
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

  const assignmentTabs = isTeamChampionship ? (
    <SegmentedTab
      tabs={tabs}
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
                <ParticipantCell>
                  <SelectInput
                    name={`assignments.${index}.teamKey`}
                    options={teamOptions}
                    placeholder="Select team..."
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
              <ParticipantColumn style={{ maxWidth: "none", flex: "1 1 0" }}>
                <ColumnText>Team</ColumnText>
              </ParticipantColumn>
            </TableRow>
          </ParticipantHeader>
          <TableBody>
            {teamFields.map((field, index) => (
              <TableRow key={field.id}>
                <NumberCell>
                  <NumberText>{index + 1}</NumberText>
                </NumberCell>
                <ParticipantCell style={{ maxWidth: "none", flex: "1 1 0" }}>
                  <TextInput name={`teams.${index}.teamName`} />
                </ParticipantCell>
                <ExtraCell>
                  <Button
                    size="small"
                    color="base"
                    rounded
                    variant="ghost"
                    ariaLabel="remove row"
                    icon={{ left: <RemoveIcon /> }}
                    onClick={() => removeTeamRow(index)}
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
        listChildren={activeTab === "Driver" ? driverListChildren : teamListChildren}
        tabs={assignmentTabs}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </FormProvider>
  );
};

export default TeamAssignments;
