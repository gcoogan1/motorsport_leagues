import { useMemo, useState } from "react";
import SetupIcon from "@assets/Icon/Season_Setup.svg?react";
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import {
  useGetLeagueParticipantsQuery,
  useGetLeagueSeasonDivisionsQuery,
  useGetLeagueSeasonDriversBySeasonIdQuery,
  useGetLeagueSeasonTeamsBySeasonIdQuery,
} from "@/rtkQuery/API/leagueApi";
import DriverLineup from "@/components/Cards/DiverLineup/DriverLineup";
import TeamLineup from "@/components/Cards/TeamLineup/TeamLineup";
import type {
  LeagueSeasonDivisionTable,
  LeagueSeasonTable,
  LeagueStatus,
} from "@/types/league.types";
import SegmentedTab from "@/components/Tabs/SegmentedTabs/SegmentedTab";
import FilterBar from "@/components/Tabs/FilterBar/FilterBar";
import {
  DriverColumns,
  LeftColumn,
  LineupContainer,
  MobileDriverLineup,
  RightColumn,
} from "./Lineup.styles";
import type { Tag } from "@/components/Tags/Tags.variants";

const ASSIGNMENT_TABS = [{ label: "Teams" }, { label: "Drivers" }];

type LineupProps = {
  seasonStatus: LeagueStatus;
  seasonData?: LeagueSeasonTable;
};

type LineupDriver = {
  seasonDriverId: string;
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

type LineupTeam = {
  teamId: string;
  createdAt: string;
  teamName: string;
  divisionId: string;
  divisionName: string;
  drivers: LineupDriver[];
};

const Lineup = ({ seasonStatus, seasonData }: LineupProps) => {
  const seasonId = seasonData?.id ?? "";
  const leagueId = seasonData?.league_id ?? "";
  const [activeTab, setActiveTab] = useState<string>(ASSIGNMENT_TABS[0].label);
  const [selectedDivisionId, setSelectedDivisionId] = useState("");


  // -- Data fetching and memoization -- //
  const seasonDivisions = useGetLeagueSeasonDivisionsQuery(seasonId, {
    skip: !seasonId,
  });
  const seasonDriversBySeason = useGetLeagueSeasonDriversBySeasonIdQuery(
    seasonId,
    {
      skip: !seasonId,
    },
  );
  const seasonTeamsBySeason = useGetLeagueSeasonTeamsBySeasonIdQuery(seasonId, {
    skip: !seasonId,
  });
  const leagueParticipants = useGetLeagueParticipantsQuery(leagueId, {
    skip: !leagueId,
  });

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

    const drivers: LineupDriver[] = (seasonDriversBySeason.data ?? []).map((driver) => {
      const division = divisionsById.get(driver.division_id);
      const team = driver.team_id ? teamsById.get(driver.team_id) : undefined;

      return {
        seasonDriverId: driver.id,
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
    });

    const teams: LineupTeam[] = (seasonTeamsBySeason.data ?? []).map((team) => {
      const division = divisionsById.get(team.division_id);
      const teamDrivers = drivers
        .filter((driver) => driver.teamId === team.id)
        .sort(
          (left, right) => {
            const leftTimestamp = left.addedToTeam ?? left.createdAt;
            const rightTimestamp = right.addedToTeam ?? right.createdAt;
            const addedToTeamDiff =
              new Date(leftTimestamp).getTime() -
              new Date(rightTimestamp).getTime();

            if (addedToTeamDiff !== 0) {
              return addedToTeamDiff;
            }

            const leftName = left.displayName;
            const rightName = right.displayName;
            const nameDiff = leftName.localeCompare(rightName);

            if (nameDiff !== 0) {
              return nameDiff;
            }

            return left.seasonDriverId.localeCompare(right.seasonDriverId);
          },
        )
        .map((driver, index) => ({
          ...driver,
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

    const driversWithNumbers: LineupDriver[] = drivers.map((driver) => {
      if (!driver.teamId) {
        return driver;
      }

      const team = teams.find((currentTeam) => currentTeam.teamId === driver.teamId);
      const teamDriver = team?.drivers.find(
        (teamEntry) => teamEntry.seasonDriverId === driver.seasonDriverId,
      );

      return {
        ...driver,
        teamDriverNumber: teamDriver?.teamDriverNumber,
      };
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

  const isTeamChampionship = lineupData?.season.isTeamChampionship;
  const moreThanOneDivision = lineupData
    ? lineupData.divisions.length > 1
    : false;


  // -- Divisions -- //
  const buildDivisionOptions = (
    divisions: LeagueSeasonDivisionTable[] | undefined,
  ) =>
    (divisions ?? []).map((division) => ({
      label: division.division_name,
      value: division.id,
    }));

  const divisionOptions = useMemo(
    () => buildDivisionOptions(lineupData?.divisions),
    [lineupData?.divisions],
  );

  const defaultDivisionId = divisionOptions[0]?.value ?? "";

  const activeView = isTeamChampionship ? activeTab : "Drivers";
  const activeDivisionId = divisionOptions.some(
    (option) => option.value === selectedDivisionId,
  )
    ? selectedDivisionId
    : defaultDivisionId;

  const selectedDivisionDrivers = useMemo(
    () =>
      (activeDivisionId
        ? (lineupData?.drivers ?? []).filter(
            (driver) => driver.divisionId === activeDivisionId,
          )
        : (lineupData?.drivers ?? []))
        .sort(
          (left, right) => {
            const createdAtDiff =
              new Date(left.createdAt).getTime() -
              new Date(right.createdAt).getTime();

            if (createdAtDiff !== 0) {
              return createdAtDiff;
            }

            const leftName = left.displayName;
            const rightName = right.displayName;
            const nameDiff = leftName.localeCompare(rightName);

            if (nameDiff !== 0) {
              return nameDiff;
            }

            return left.seasonDriverId.localeCompare(right.seasonDriverId);
          },
        ),
    [activeDivisionId, lineupData?.drivers],
  );

  const selectedDivisionTeams = useMemo(
    () =>
      (activeDivisionId
        ? (lineupData?.teams ?? []).filter(
            (team) => team.divisionId === activeDivisionId,
          )
        : (lineupData?.teams ?? []))
        .sort((left, right) => {
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

  const leftColumnDrivers = useMemo(
    () => selectedDivisionDrivers.filter((_, index) => index % 2 === 0),
    [selectedDivisionDrivers],
  );

  const rightColumnDrivers = useMemo(
    () => selectedDivisionDrivers.filter((_, index) => index % 2 === 1),
    [selectedDivisionDrivers],
  );

  const activeCount =
    isTeamChampionship && activeView === "Teams"
      ? selectedDivisionTeams.length
      : selectedDivisionDrivers.length;

  const totalCount = useMemo(() => {
    if (!lineupData) {
      return 0;
    }

    if (activeView === "Teams") {
      return lineupData.teams.length;
    }

    return new Set(lineupData.drivers.map((driver) => driver.profileId)).size;
  }, [activeView, lineupData]);

  const countLabel =
    isTeamChampionship && activeView === "Teams"
      ? `Showing ${activeCount} of ${totalCount} Teams`
      : `Showing ${activeCount} of ${totalCount} Drivers`;

  // -- Handlers -- //

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const renderDriverCard = (driver: LineupDriver, fallbackNumber: number) => (
    <DriverLineup
      key={driver.seasonDriverId}
      username={driver.displayName}
      teamName={driver.teamName ?? ""}
      avatarType={driver.avatarType}
      avatarValue={driver.avatarValue}
      tags={driver.tags}
      cardNumber={String(fallbackNumber)}
      driverId={driver.profileId}
    />
  );

  return (
    <>
      {seasonStatus === "setup" ? (
        <EmptyMessage
          icon={<SetupIcon />}
          title="Coming Soon"
          subtitle="The latest Season of this League is being set up!"
        />
      ) : (
        <>
          {isTeamChampionship && (
            <SegmentedTab
              tabs={ASSIGNMENT_TABS}
              activeTab={activeView}
              onChange={handleTabChange}
            />
          )}
          {moreThanOneDivision && (
            <FilterBar
              divisions={divisionOptions}
              rounds={[]}
              events={[]}
              sessions={[]}
              selectedDivision={activeDivisionId}
              onDivisionChange={setSelectedDivisionId}
              text={countLabel}
            />
          )}
            {isTeamChampionship && activeView === "Teams"
              ? (
                <LineupContainer $isEmpty={selectedDivisionTeams.length === 0}>
                  {selectedDivisionTeams.length === 0 ? ( 
                    <EmptyMessage
                      title="No Teams Assigned"
                      subtitle="Teams have not been created yet."
                    />
                  ) : (
                    selectedDivisionTeams.map((team, index) => (
                      <TeamLineup
                        key={team.teamId}
                        teamName={team.teamName}
                        teamNumber={index + 1}
                        drivers={team.drivers.map((driver) => ({
                          id: driver.seasonDriverId,
                          username: driver.displayName,
                          avatarType: driver.avatarType,
                          avatarValue: driver.avatarValue,
                          driverNumber: String(driver.teamDriverNumber ?? 0),
                          tags: driver.tags,
                        }))}
                      />
                    ))
                  )}
                </ LineupContainer>
              )
              : (
                <LineupContainer $isEmpty={selectedDivisionDrivers.length === 0} isDriversTab={true}>
                  {selectedDivisionDrivers.length === 0 ? (
                    <EmptyMessage
                      title="No Drivers Assigned"
                      subtitle="Drivers have not been placed in the lineup yet."
                    />
                  ) : (
                    <>
                      <DriverColumns>
                        <LeftColumn>
                          {leftColumnDrivers.map((driver) =>
                            renderDriverCard(
                              driver,
                              selectedDivisionDrivers.findIndex(
                                (entry) => entry.seasonDriverId === driver.seasonDriverId,
                              ) + 1,
                            ),
                          )}
                        </LeftColumn>
                        <RightColumn>
                          {rightColumnDrivers.map((driver) =>
                            renderDriverCard(
                              driver,
                              selectedDivisionDrivers.findIndex(
                                (entry) => entry.seasonDriverId === driver.seasonDriverId,
                              ) + 1,
                            ),
                          )}
                        </RightColumn>
                      </DriverColumns>
                      <MobileDriverLineup $isEmpty={false} isDriversTab={true}>
                        {selectedDivisionDrivers.map((driver, index) =>
                          renderDriverCard(driver, index + 1),
                        )}
                      </MobileDriverLineup>
                    </>
                  )}
                </ LineupContainer>
            )}
        </>
      )}
    </>
  );
};

export default Lineup;
