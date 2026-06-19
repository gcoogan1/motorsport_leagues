import SetupIcon from "@assets/Icon/Season_Setup.svg?react";
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import { useModal } from "@/providers/modal/useModal";
import type { LeagueSeasonTable, LeagueStatus } from "@/types/league.types";
import DriverLineup from "@/components/Cards/DiverLineup/DriverLineup";
import TeamLineup from "@/components/Cards/TeamLineup/TeamLineup";
import SegmentedTab from "@/components/Tabs/SegmentedTabs/SegmentedTab";
import FilterBar from "@/components/Tabs/FilterBar/FilterBar";
import DriverPerformance from "@/pages/League/modals/DriverPerformance/DriverPerformance";
import TeamPerformance from "@/pages/League/modals/TeamPerformance/TeamPerformance";
import {
  DriverColumns,
  LeftColumn,
  LineupContainer,
  MobileDriverLineup,
  RightColumn,
} from "./Lineup.styles";
import { ASSIGNMENT_TABS, useLineupData } from "./useLineupData";
import type { LineupDriver } from "./useLineupData";

type LineupProps = {
  seasonStatus: LeagueStatus;
  seasonData?: LeagueSeasonTable;
};

const Lineup = ({ seasonStatus, seasonData }: LineupProps) => {
  const {
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
  } = useLineupData({ seasonData });
  const { openModal } = useModal();

  const handleDriverClick = (driverId: string, driverName?: string) => {
    openModal(
      <DriverPerformance
        driverId={driverId}
        driverName={driverName}
        seasonName={seasonData?.season_name ?? "Season Name"}
      />,
    );
  };

  const handleTeamClick = (teamId: string, teamName: string, numOfDrivers: number) => {
    openModal(
      <TeamPerformance
        teamId={teamId}
        teamName={teamName}
        numOfDrivers={numOfDrivers}
        seasonName={seasonData?.season_name ?? "Season Name"}
      />,
    );
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
      driverId={driver.performanceDriverId}
      onClick={() => handleDriverClick(driver.performanceDriverId, driver.displayName)}
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
          {isTeamChampionship && activeView === "Teams" ? (
            <LineupContainer $isEmpty={selectedDivisionTeams.length === 0}>
              {selectedDivisionTeams.length === 0 ? (
                <EmptyMessage
                  icon={<SetupIcon />}
                  title="No Teams Assigned"
                  subtitle="Teams have not been created yet."
                />
              ) : (
                selectedDivisionTeams.map((team, index) => (
                  <TeamLineup
                    key={team.teamId}
                    teamName={team.teamName}
                    teamNumber={index + 1}
                    onTeamClick={() => handleTeamClick(team.teamId, team.teamName, team.drivers.length)}
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
            </LineupContainer>
          ) : (
            <LineupContainer
              $isEmpty={selectedDivisionDrivers.length === 0}
              isDriversTab={true}
            >
              {selectedDivisionDrivers.length === 0 ? (
                <EmptyMessage
                  icon={<SetupIcon />}
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
                            (entry) =>
                              entry.seasonDriverId === driver.seasonDriverId,
                          ) + 1,
                        ),
                      )}
                    </LeftColumn>
                    <RightColumn>
                      {rightColumnDrivers.map((driver) =>
                        renderDriverCard(
                          driver,
                          selectedDivisionDrivers.findIndex(
                            (entry) =>
                              entry.seasonDriverId === driver.seasonDriverId,
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
            </LineupContainer>
          )}
        </>
      )}
    </>
  );
};

export default Lineup;
