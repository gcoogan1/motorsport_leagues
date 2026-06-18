import { useMemo, useState } from "react";
import {
  useGetLeagueParticipantsQuery,
  useGetLeagueSeasonDivisionsQuery,
  useGetLeagueSeasonDriversBySeasonIdQuery,
  useGetLeagueSeasonTeamsBySeasonIdQuery,
} from "@/rtkQuery/API/leagueApi";
import { useGetResultsByDivisionIdQuery } from "@/rtkQuery/API/resultsApi";
import type { LeagueSeasonTable } from "@/types/league.types";
import type { ResultsTable } from "@/types/results.types";
import type { Tag } from "@/components/Tags/Tags.variants";

export const ASSIGNMENT_TABS = [{ label: "Teams" }, { label: "Drivers" }];

type DriverStanding = {
  position: number;
  driverId: string;
  displayName: string;
  avatarType: "preset" | "upload";
  avatarValue: string;
  tags: Tag[];
  teamName: string;
  completedRaces: number;
  totalPoints: number;
};

type TeamStanding = {
  position: number;
  teamId: string;
  teamName: string;
  completedRounds: number;
  totalPoints: number;
};

export const useStandingsData = ({
  seasonData,
}: {
  seasonData?: LeagueSeasonTable;
}) => {
  const seasonId = seasonData?.id ?? "";
  const leagueId = seasonData?.league_id ?? "";

  const [activeTab, setActiveTab] = useState<string>(ASSIGNMENT_TABS[0].label);
  const [selectedDivisionId, setSelectedDivisionId] = useState("");

  const seasonDivisions = useGetLeagueSeasonDivisionsQuery(seasonId, {
    skip: !seasonId,
  });
  const seasonDrivers = useGetLeagueSeasonDriversBySeasonIdQuery(seasonId, {
    skip: !seasonId,
  });
  const seasonTeams = useGetLeagueSeasonTeamsBySeasonIdQuery(seasonId, {
    skip: !seasonId,
  });
  const leagueParticipants = useGetLeagueParticipantsQuery(leagueId, {
    skip: !leagueId,
  });

  const divisionOptions = useMemo(
    () =>
      (seasonDivisions.data ?? []).map((division) => ({
        label: division.division_name,
        value: division.id,
      })),
    [seasonDivisions.data],
  );

  const defaultDivisionId = divisionOptions[0]?.value ?? "";
  const activeDivisionId = divisionOptions.some(
    (option) => option.value === selectedDivisionId,
  )
    ? selectedDivisionId
    : defaultDivisionId;

  const divisionResults = useGetResultsByDivisionIdQuery(activeDivisionId, {
    skip: !activeDivisionId,
  });

  const isTeamChampionship = Boolean(seasonData?.is_team_championship);
  const activeView = isTeamChampionship ? activeTab : "Drivers";
  const moreThanOneDivision = divisionOptions.length > 1;

  const driversById = useMemo(
    () =>
      new Map(
        (seasonDrivers.data ?? []).map((driver) => [driver.id, driver] as const),
      ),
    [seasonDrivers.data],
  );

  const teamsById = useMemo(
    () =>
      new Map((seasonTeams.data ?? []).map((team) => [team.id, team] as const)),
    [seasonTeams.data],
  );

  const participantTagsByProfileId = useMemo(
    () =>
      new Map(
        (leagueParticipants.data ?? []).map((participant) => [
          participant.profile_id,
          participant.roles as Tag[],
        ]),
      ),
    [leagueParticipants.data],
  );

  const driverResults = useMemo<DriverStanding[]>(() => {
    const source = (divisionResults.data ?? []).filter(
      (result) =>
        result.session_type !== "qualifying" &&
        result.fastest_lap !== true,
    );
    const standingsByDriver = new Map<
      string,
      {
        driverId: string;
        displayName: string;
        avatarType: "preset" | "upload";
        avatarValue: string;
        tags: Tag[];
        teamName: string;
        completedRaces: number;
        totalPoints: number;
      }
    >();

    source.forEach((result: ResultsTable) => {
      const seasonDriver = driversById.get(result.driver_id);

      if (!seasonDriver) {
        return;
      }

      const resolvedTeamId = result.team_id ?? seasonDriver.team_id;
      const resolvedTeamName = resolvedTeamId
        ? (teamsById.get(resolvedTeamId)?.team_name ?? result.team_name ?? "")
        : (result.team_name ?? "");

      const current = standingsByDriver.get(result.driver_id);

      if (!current) {
        standingsByDriver.set(result.driver_id, {
          driverId: result.driver_id,
          displayName: seasonDriver.display_name ?? "Unknown Driver",
          avatarType: seasonDriver.avatar_type ?? "preset",
          avatarValue: seasonDriver.avatar_value ?? "profile1",
          tags: participantTagsByProfileId.get(seasonDriver.profile_id) ?? [],
          teamName: resolvedTeamName,
          completedRaces: result.session_type === "race" ? 1 : 0,
          totalPoints: result.points ?? 0,
        });
        return;
      }

      current.totalPoints += result.points ?? 0;
      if (result.session_type === "race") {
        current.completedRaces += 1;
      }
      if (resolvedTeamName && current.teamName !== resolvedTeamName) {
        current.teamName = resolvedTeamName;
      }
    });

    return [...standingsByDriver.values()]
      .filter((entry) => entry.totalPoints > 0)
      .sort((left, right) => {
        if (right.totalPoints !== left.totalPoints) {
          return right.totalPoints - left.totalPoints;
        }

        if (right.completedRaces !== left.completedRaces) {
          return right.completedRaces - left.completedRaces;
        }

        return left.displayName.localeCompare(right.displayName);
      })
      .map((entry, index) => ({
        position: index + 1,
        ...entry,
      }));
  }, [divisionResults.data, driversById, participantTagsByProfileId, teamsById]);

  const teamResults = useMemo<TeamStanding[]>(() => {
    const source = (divisionResults.data ?? []).filter(
      (result) =>
        result.session_type !== "qualifying" &&
        result.fastest_lap !== true,
    );
    const standingsByTeam = new Map<
      string,
      {
        teamId: string;
        teamName: string;
        rounds: Set<string>;
        totalPoints: number;
      }
    >();

    source.forEach((result: ResultsTable) => {
      const driver = driversById.get(result.driver_id);
      const fallbackTeamId = driver?.team_id;
      const teamId = result.team_id ?? fallbackTeamId;

      if (!teamId) {
        return;
      }

      const seasonTeam = teamsById.get(teamId);
      const resolvedTeamName = seasonTeam?.team_name ?? result.team_name;
      const teamName = resolvedTeamName ?? "Unknown Team";
      const current = standingsByTeam.get(teamId);

      if (!current) {
        standingsByTeam.set(teamId, {
          teamId,
          teamName,
          rounds: result.session_type === "race" ? new Set([result.round_id]) : new Set(),
          totalPoints: result.points ?? 0,
        });
        return;
      }

      current.totalPoints += result.points ?? 0;
      if (result.session_type === "race") {
        current.rounds.add(result.round_id);
      }
      if (resolvedTeamName && current.teamName !== resolvedTeamName) {
        current.teamName = resolvedTeamName;
      }
    });

    return [...standingsByTeam.values()]
      .filter((entry) => entry.totalPoints > 0)
      .sort((left, right) => {
        if (right.totalPoints !== left.totalPoints) {
          return right.totalPoints - left.totalPoints;
        }

        if (right.rounds.size !== left.rounds.size) {
          return right.rounds.size - left.rounds.size;
        }

        return left.teamName.localeCompare(right.teamName);
      })
      .map((entry, index) => ({
        position: index + 1,
        teamId: entry.teamId,
        teamName: entry.teamName,
        completedRounds: entry.rounds.size,
        totalPoints: entry.totalPoints,
      }));
  }, [divisionResults.data, driversById, teamsById]);

  const activeCount =
    isTeamChampionship && activeView === "Teams"
      ? teamResults.length
      : driverResults.length;

  const totalCount = useMemo(() => {
    if (isTeamChampionship && activeView === "Teams") {
      return new Set((seasonTeams.data ?? []).map((team) => team.team_name)).size;
    }

    return new Set((seasonDrivers.data ?? []).map((driver) => driver.profile_id)).size;
  }, [activeView, isTeamChampionship, seasonDrivers.data, seasonTeams.data]);

  const countLabel =
    isTeamChampionship && activeView === "Teams"
      ? `Showing ${activeCount} of ${totalCount} Teams`
      : `Showing ${activeCount} of ${totalCount} Drivers`;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return {
    activeView,
    activeDivisionId,
    setSelectedDivisionId,
    divisionOptions,
    isTeamChampionship,
    moreThanOneDivision,
    driverResults,
    teamResults,
    countLabel,
    handleTabChange,
  };
};
