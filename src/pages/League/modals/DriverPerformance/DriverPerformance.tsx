import { useMemo } from "react";
import SheetModal from "@/components/Sheets/SheetModal/SheetModal";
import Table from "@/components/Tables/Table/Table";
import { useModal } from "@/providers/modal/useModal";
import { useDriverPerformanceResults } from "./useDriverPerformance";
import SpecialRow from "@/components/Tables/SpecialRow/SpecialRow";
import SetupIcon from "@assets/Icon/Season_Setup.svg?react";
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import ResultsModal from "@/pages/League/modals/ResultsModal/ResultsModal";

type DriverPerformanceProps = {
  driverId: string;
  seasonId?: string;
  seasonName: string;
  driverName?: string;
  teamName?: string;
};

const DriverPerformance = ({
  driverId,
  seasonId,
  seasonName,
  driverName,
  teamName,
}: DriverPerformanceProps) => {
  const { closeModal, openModal } = useModal();
  const { driverData, teamName: performanceTeamName, results } =
    useDriverPerformanceResults(driverId);

  const eventResults = useMemo(() => {
    return results ?? [];
  }, [results]);

  const totalPoints = eventResults.reduce((acc, entry) => acc + (entry.points ?? 0), 0);

  const isEmpty = !driverData || eventResults.length === 0;

  const handleResultClick = (eventId: string) => {
    if (!seasonId) {
      return;
    }

    closeModal();
    openModal(
      <ResultsModal
        eventId={eventId}
        seasonId={seasonId}
        seasonName={seasonName}
      />,
    );
  };

  const listChildren = (
    <>
      {isEmpty ? (
        <EmptyMessage
          icon={<SetupIcon />}
          title="No Results"
          subtitle="No points have been awarded yet."
        />
      ) : (
        <>
          <Table
          title={"Driver's Season Results"}
          resultPerRound
          results={eventResults.map((entry) => ({
            position: entry.position,
            points: entry.points,
            type: "driver",
            roundInfo: {
              roundName: entry.round_name,
              trackName: entry.track_name ? entry.track_name : "Hidden Track",
            },
            driver: {
              id: driverId,
              username: driverData.display_name ?? "Unknown Driver",
              avatarType: "preset",
              avatarValue: "black",
            },
            onClick: () => handleResultClick(entry.event_id),
          }))}
        />
      <SpecialRow label="Total Points" value={totalPoints} />
        </>
      )}
    </>
  );

  return (
    <SheetModal
      id={"driver-performance"}
      seasonName={seasonName}
      details={{
        title: driverData?.display_name ?? driverName ?? "Unknown Driver",
        information: performanceTeamName ?? teamName ?? "",
      }}
      header={"Driver Performance"}
      listChildren={listChildren}
      onClose={closeModal}
    />
  );
};

export default DriverPerformance;
