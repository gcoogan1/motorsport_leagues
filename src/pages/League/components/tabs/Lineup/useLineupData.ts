import { useMemo, useState } from "react";
import {
  useGetLeagueParticipantsQuery,
  useGetLeagueSeasonDivisionsQuery,
  useGetLeagueSeasonDriversBySeasonIdQuery,
  useGetLeagueSeasonTeamsBySeasonIdQuery,
} from "@/rtkQuery/API/leagueApi";
import type {
  LeagueSeasonDivisionTable,
  LeagueSeasonTable,
} from "@/types/league.types";
import type { Tag } from "@/components/Tags/Tags.variants";

export const ASSIGNMENT_TABS = [{ label: "Teams" }, { label: "Drivers" }];

/** A driver entry normalised for display in the lineup tab. */
export type LineupDriver = {
  seasonDriverId: string;
  performanceDriverId: string;
  createdAt: string;
  addedToTeam: string | null;
  profileId: string;
  displayName: string;
  gameType: string;
  avatarType: "preset" | "upload";
  avatarValue: string;
  tags: Tag[];
  divisionId: string;
  divisionName: string;
  teamId: string | null;
  teamName: string | null;
  teamDriverNumber?: number;
};

/** A team entry normalised for display in the lineup tab, with its roster pre-sorted. */
export type LineupTeam = {
  teamId: string;
  createdAt: string;
  teamName: string;
  divisionId: string;
  divisionName: string;
  drivers: LineupDriver[];
};

/** Converts raw division records into { label, value } options for FilterBar. */
const buildDivisionOptions = (
  divisions: LeagueSeasonDivisionTable[] | undefined,
) =>
  (divisions ?? []).map((division) => ({
    label: division.division_name,
    value: division.id,
  }));

/**
 * Centralises all data fetching, transformation, and display-state logic for
 * the Lineup tab. Returns everything the Lineup component needs to render;
 * the component itself only handles JSX.
 *
 * Pre-qual championship note: the pre-qual division (division_number === 0)
 * acts as the source of truth for teams and driver assignments. Linked
 * divisions mirror those teams but may not have their own driver DB records
 * until the assignment form is saved. This hook falls back to the pre-qual
 * team's drivers when a linked division team has none of its own.
 */
export const useLineupData = ({
  seasonData,
}: {
  seasonData?: LeagueSeasonTable;
}) => {
  const seasonId = seasonData?.id ?? "";
  const leagueId = seasonData?.league_id ?? "";

  // Teams / Drivers tab toggle (team championships only).
  const [activeTab, setActiveTab] = useState<string>(ASSIGNMENT_TABS[0].label);
  // Division filter bar selection; defaults to the first division.
  const [selectedDivisionId, setSelectedDivisionId] = useState("");

  // -- Queries -- //
  const seasonDivisions = useGetLeagueSeasonDivisionsQuery(seasonId, {
    skip: !seasonId,
  });
  const seasonDriversBySeason = useGetLeagueSeasonDriversBySeasonIdQuery(
    seasonId,
    { skip: !seasonId },
  );
  const seasonTeamsBySeason = useGetLeagueSeasonTeamsBySeasonIdQuery(seasonId, {
    skip: !seasonId,
  });
  const leagueParticipants = useGetLeagueParticipantsQuery(leagueId, {
    skip: !leagueId,
  });

  // -- Data Transformation -- //
  const lineupData = useMemo(() => {
    if (!seasonData) {
      return null;
    }

    const divisionsById = new Map(
      (seasonDivisions.data ?? []).map((division) => [division.id, division]),
    );
    const teamsById = new Map(
      (seasonTeamsBySeason.data ?? []).map((team) => [team.id, team]),
    );
    const participantTagsByProfileId = new Map(
      (leagueParticipants.data ?? []).map((participant) => [
        participant.profile_id,
        participant.roles as Tag[],
      ]),
    );
    const seasonDriverIdByProfileAndDivision = new Map(
      (seasonDriversBySeason.data ?? [])
        .filter((driver) => !!driver.profile_id)
        .map((driver) => [`${driver.profile_id}:${driver.division_id}`, driver.id] as const),
    );

    const drivers: LineupDriver[] = (seasonDriversBySeason.data ?? []).map(
      (driver) => {
        const division = divisionsById.get(driver.division_id);
        const team = driver.team_id
          ? teamsById.get(driver.team_id)
          : undefined;

        return {
          seasonDriverId: driver.id,
          performanceDriverId: driver.id,
          createdAt: driver.created_at,
          addedToTeam: driver.added_to_team ?? null,
          profileId: driver.profile_id,
          displayName: driver.display_name ?? "Unknown Driver",
          gameType: driver.game_type ?? "gt7",
          avatarType: driver.avatar_type ?? "preset",
          avatarValue: driver.avatar_value ?? "profile1",
          tags: participantTagsByProfileId.get(driver.profile_id) ?? [],
          divisionId: driver.division_id,
          divisionName: division?.division_name ?? "",
          teamId: driver.team_id ?? null,
          teamName: team?.team_name ?? null,
        };
      },
    );

    // Find the pre-qual division so linked division teams can inherit their
    // drivers when no directly-assigned driver records exist yet.
    const preQualDivision = (seasonDivisions.data ?? []).find(
      (d) => d.division_number === 0,
    );
    // Map team name → pre-qual team id for O(1) fallback lookup.
    const preQualTeamIdByName = new Map(
      (seasonTeamsBySeason.data ?? [])
        .filter((t) => preQualDivision && t.division_id === preQualDivision.id)
        .map((t) => [t.team_name, t.id]),
    );

    const teams: LineupTeam[] = (seasonTeamsBySeason.data ?? []).map((team) => {
      const division = divisionsById.get(team.division_id);

      // For linked divisions (non-pre-qual), always use the matching pre-qual
      // team's current drivers as the source of truth for display. This ensures
      // that any changes to the pre-qual assignment are immediately reflected in
      // all linked divisions without requiring a re-save of each division.
      const isLinkedDivision =
        !!preQualDivision && team.division_id !== preQualDivision.id;
      const fallbackTeamId = isLinkedDivision
        ? (preQualTeamIdByName.get(team.team_name) ?? null)
        : null;
      const driverSource = fallbackTeamId
        ? drivers.filter((driver) => driver.teamId === fallbackTeamId)
        : drivers.filter((driver) => driver.teamId === team.id);

      const teamDrivers = driverSource
        .sort((left, right) => {
          const leftTimestamp = left.addedToTeam ?? left.createdAt;
          const rightTimestamp = right.addedToTeam ?? right.createdAt;
          const addedToTeamDiff =
            new Date(leftTimestamp).getTime() -
            new Date(rightTimestamp).getTime();

          if (addedToTeamDiff !== 0) {
            return addedToTeamDiff;
          }

          const nameDiff = left.displayName.localeCompare(right.displayName);

          if (nameDiff !== 0) {
            return nameDiff;
          }

          return left.seasonDriverId.localeCompare(right.seasonDriverId);
        })
        .map((driver, index) => ({
          ...driver,
          performanceDriverId:
            seasonDriverIdByProfileAndDivision.get(
              `${driver.profileId}:${team.division_id}`,
            ) ?? driver.seasonDriverId,
          teamDriverNumber: index + 1,
        }));

      return {
        teamId: team.id,
        createdAt: team.created_at,
        teamName: team.team_name,
        divisionId: team.division_id,
        divisionName: division?.division_name ?? "",
        drivers: teamDrivers,
      };
    });

    // Second pass over drivers to attach teamDriverNumber from the already-sorted
    // team roster. This lets DriverLineup cards show the correct in-team position.
    const driversWithNumbers: LineupDriver[] = drivers.map((driver) => {
      if (!driver.teamId) {
        return driver;
      }

      const team = teams.find((t) => t.teamId === driver.teamId);
      const teamDriver = team?.drivers.find(
        (te) => te.seasonDriverId === driver.seasonDriverId,
      );

      return { ...driver, teamDriverNumber: teamDriver?.teamDriverNumber };
    });

    return {
      season: {
        id: seasonData.id,
        name: seasonData.season_name,
        isTeamChampionship: seasonData.is_team_championship,
        status: seasonData.season_status,
      },
      divisions: seasonDivisions.data ?? [],
      drivers: driversWithNumbers,
      teams,
    };
  }, [
    leagueParticipants.data,
    seasonData,
    seasonDivisions.data,
    seasonDriversBySeason.data,
    seasonTeamsBySeason.data,
  ]);

  // -- Division & View State -- //

  const isTeamChampionship = lineupData?.season.isTeamChampionship;
  const moreThanOneDivision = lineupData
    ? lineupData.divisions.length > 1
    : false;

  const divisionOptions = useMemo(
    () => buildDivisionOptions(lineupData?.divisions),
    [lineupData?.divisions],
  );

  const defaultDivisionId = divisionOptions[0]?.value ?? "";
  // Non-team championships are always in the Drivers view.
  const activeView = isTeamChampionship ? activeTab : "Drivers";
  // Fall back to the first division if the stored selection is no longer valid
  // (e.g. after a division is removed).
  const activeDivisionId = divisionOptions.some(
    (option) => option.value === selectedDivisionId,
  )
    ? selectedDivisionId
    : defaultDivisionId;

  // -- Selected Division Slices -- //

  // Drivers visible in the active division.
  //
  // We seed the list from the already-resolved team rosters (the same source
  // the Teams tab uses, including pre-qual fallback) to guarantee both tabs
  // always agree on which drivers are assigned. profileId is used as the
  // deduplication key so a person with both a pre-qual record and a linked-
  // division record doesn't appear twice.
  //
  // After seeding from teams we do a second pass over all raw driver records
  // to pick up anyone in the division who isn't on a team yet (e.g. newly
  // added participants waiting for team assignment).
  const selectedDivisionDrivers = useMemo(() => {
    const allDrivers = lineupData?.drivers ?? [];

    const sortFn = (left: LineupDriver, right: LineupDriver) => {
      const createdAtDiff =
        new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
      if (createdAtDiff !== 0) return createdAtDiff;
      const nameDiff = left.displayName.localeCompare(right.displayName);
      if (nameDiff !== 0) return nameDiff;
      return left.seasonDriverId.localeCompare(right.seasonDriverId);
    };

    if (!activeDivisionId) {
      return allDrivers.slice().sort(sortFn);
    }

    const teamsInDivision = (lineupData?.teams ?? []).filter(
      (t) => t.divisionId === activeDivisionId,
    );

    // Seed from team rosters — this is the same data the Teams tab renders.
    const driversByProfile = new Map<string, LineupDriver>();
    for (const team of teamsInDivision) {
      for (const driver of team.drivers) {
        driversByProfile.set(driver.profileId, driver);
      }
    }

    // Add division-assigned drivers not already covered by a team roster.
    for (const driver of allDrivers) {
      if (
        driver.divisionId === activeDivisionId &&
        !driversByProfile.has(driver.profileId)
      ) {
        driversByProfile.set(driver.profileId, driver);
      }
    }

    return [...driversByProfile.values()].sort(sortFn);
  }, [activeDivisionId, lineupData?.drivers, lineupData?.teams]);

  const selectedDivisionTeams = useMemo(
    () =>
      (activeDivisionId
        ? (lineupData?.teams ?? []).filter(
            (team) => team.divisionId === activeDivisionId,
          )
        : (lineupData?.teams ?? [])
      ).sort((left, right) => {
        const createdAtDiff =
          new Date(left.createdAt).getTime() -
          new Date(right.createdAt).getTime();

        if (createdAtDiff !== 0) {
          return createdAtDiff;
        }

        const nameDiff = left.teamName.localeCompare(right.teamName);

        if (nameDiff !== 0) {
          return nameDiff;
        }

        return left.teamId.localeCompare(right.teamId);
      }),
    [activeDivisionId, lineupData?.teams],
  );

  // Split into two columns for the desktop two-column driver grid layout.
  const leftColumnDrivers = useMemo(
    () => selectedDivisionDrivers.filter((_, index) => index % 2 === 0),
    [selectedDivisionDrivers],
  );

  const rightColumnDrivers = useMemo(
    () => selectedDivisionDrivers.filter((_, index) => index % 2 === 1),
    [selectedDivisionDrivers],
  );

  // -- Count Label -- //

  // How many items are visible in the currently selected division.
  const activeCount =
    isTeamChampionship && activeView === "Teams"
      ? selectedDivisionTeams.length
      : selectedDivisionDrivers.length;

  const totalCount = useMemo(() => {
    if (!lineupData) {
      return 0;
    }

    if (activeView === "Teams") {
      // Deduplicate by team name since pre-qual and linked divisions create
      // separate DB records for the same logical team.
      return new Set(lineupData.teams.map((team) => team.teamName)).size;
    }

    return new Set(lineupData.drivers.map((driver) => driver.profileId)).size;
  }, [activeView, lineupData]);

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
    selectedDivisionDrivers,
    selectedDivisionTeams,
    leftColumnDrivers,
    rightColumnDrivers,
    countLabel,
    handleTabChange,
  };
};
