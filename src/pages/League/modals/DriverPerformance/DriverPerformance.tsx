import { useMemo } from "react";
import SheetModal from "@/components/Sheets/SheetModal/SheetModal";
import Table from "@/components/Tables/Table/Table";
import { useModal } from "@/providers/modal/useModal";
import { useDriverPerformanceResults } from "./useDriverPerformance";
import SpecialRow from "@/components/Tables/SpecialRow/SpecialRow";

type DriverPerformanceProps = {
  driverId: string;
  seasonName: string;
};

const DriverPerformance = ({
  driverId,
  seasonName,
}: DriverPerformanceProps) => {
  const { closeModal } = useModal();
  const { driverData, teamName, results } =
    useDriverPerformanceResults(driverId);

  const eventResults = useMemo(() => {
    return (results ?? []).filter((entry) => (entry.points ?? 0) > 0);
  }, [results]);

  const totalPoints = eventResults.reduce((acc, entry) => acc + (entry.points ?? 0), 0);

  if (!driverData || eventResults.length === 0) {
    return null;
  }


  const listChildren = (
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
            trackName: entry.track_name,
          },
          driver: {
            id: driverId,
            username: driverData.display_name ?? "Unknown Driver",
            avatarType: "preset",
            avatarValue: "black",
          },
          onClick: () => {},
        }))}
      />
      <SpecialRow label="Total Points" value={totalPoints} />
    </>
  );

  return (
    <SheetModal
      id={"driver-performance"}
      seasonName={seasonName}
      blockHeader={driverData?.display_name ?? "Unknown Driver"}
      blockDescription={teamName ?? ""}
      header={"Driver Performance"}
      listChildren={listChildren}
      onClose={closeModal}
    />
  );
};

export default DriverPerformance;
