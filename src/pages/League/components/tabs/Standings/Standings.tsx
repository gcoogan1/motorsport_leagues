import { useModal } from "@/providers/modal/useModal.ts";
import SetupIcon from "@assets/Icon/Season_Setup.svg?react";
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import SegmentedTab from "@/components/Tabs/SegmentedTabs/SegmentedTab";
import FilterBar from "@/components/Tabs/FilterBar/FilterBar";
import Table from "@/components/Tables/Table/Table";
import DriverPerformance from "@/pages/League/modals/DriverPerformance/DriverPerformance.tsx";
import type { LeagueSeasonTable, LeagueStatus } from "@/types/league.types";
import { ASSIGNMENT_TABS, useStandingsData } from "./useStandingsData.ts";
import TeamPerformance from "@/pages/League/modals/TeamPerformance/TeamPerformance.tsx";

type StandingsProps = {
  seasonStatus: LeagueStatus;
  seasonData?: LeagueSeasonTable;
};

const Standings = ({ seasonStatus, seasonData }: StandingsProps) => {
  const {
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
  } = useStandingsData({ seasonData });

  const { openModal } = useModal();
  const showingTeams = isTeamChampionship && activeView === "Teams";

  const handleDriverClick = (driverId: string) => {
    return openModal(
      <DriverPerformance
        driverId={driverId}
        seasonId={seasonData?.id}
        seasonName={seasonData?.season_name ?? "Season Name"}
      />,
    );
  };

  const handleTeamClick = (teamId: string) => {
    return openModal(
      <TeamPerformance
        teamId={teamId}
        seasonId={seasonData?.id}
        seasonName={seasonData?.season_name ?? "Season Name"}
      />,
    );
  }

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
          {showingTeams ? (
            teamResults.length === 0 ? (
              <EmptyMessage
                icon={<SetupIcon />}
                title="No Standings Available"
                subtitle="No points have been awarded yet."
              />
            ) : (
              <Table
                title="TEAMS Total Season Points"
                metricLabel="Rounds"
                results={teamResults.map((entry) => ({
                  position: entry.position,
                  points: entry.totalPoints,
                  races: entry.completedRounds,
                  type: "team",
                  driver: {
                    id: entry.teamId,
                    username: entry.teamName,
                    driverNumber: "0",
                    avatarType: "preset",
                    avatarValue: "black",
                    teamName: entry.teamName,
                  },
                  onClick: () => handleTeamClick(entry.teamId),
                }))}
              />
            )
          ) : driverResults.length === 0 ? (
            <EmptyMessage
              icon={<SetupIcon />}
              title="No Standings Available"
              subtitle="No points have been awarded yet."
            />
          ) : (
            <Table
              title="DRIVERS Total Season Points"
              metricLabel="Races"
              results={driverResults.map((entry) => ({
                position: entry.position,
                points: entry.totalPoints,
                races: entry.completedRaces,
                type: "driver",
                driver: {
                  id: entry.driverId,
                  username: entry.displayName,
                  driverNumber: "0",
                  avatarType: entry.avatarType,
                  avatarValue: entry.avatarValue,
                  tags: entry.tags,
                  teamName: entry.teamName,
                },
                onClick: () => {
                  handleDriverClick(entry.driverId);
                },
              }))}
            />
          )}
        </>
      )}
    </>
  );
};

export default Standings;
