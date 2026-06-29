import { useMemo } from "react";
import SheetModal from "@/components/Sheets/SheetModal/SheetModal";
import Table from "@/components/Tables/Table/Table";
import { useModal } from "@/providers/modal/useModal";
import { useTeamPerformanceResults } from "./useTeamPerfomance";
import SpecialRow from "@/components/Tables/SpecialRow/SpecialRow";
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import SetupIcon from "@assets/Icon/Season_Setup.svg?react";

type TeamPerformanceProps = {
  teamId: string;
  seasonName: string;
  teamName?: string;
  numOfDrivers?: number;
};

const TeamPerformance = ({
  teamId,
  teamName,
  numOfDrivers,
  seasonName,
}: TeamPerformanceProps) => {
  const { closeModal } = useModal();
  const { teamData, results } =
    useTeamPerformanceResults(teamId);

  const eventResults = useMemo(() => {
    return (results ?? []).filter((entry) => (entry.points ?? 0) > 0);
  }, [results]);

  const participatingDriverCount = useMemo(
    () => new Set(eventResults.map((entry) => entry.driver_id)).size,
    [eventResults],
  );

  const driverCount = participatingDriverCount === 0 ? numOfDrivers ?? 0 : participatingDriverCount;
  const participantLabel = `${driverCount} Driver${driverCount === 1 ? "" : "s"}`;

  const totalPoints = eventResults.reduce((acc, entry) => acc + (entry.points ?? 0), 0);

  const isEmpty = !teamData || eventResults.length === 0;




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
        title={"Team's Season Results"}
        resultPerRound
        results={eventResults.map((entry) => ({
          position: entry.position,
          points: entry.points,
          type: "team",
          roundInfo: {
            roundName: entry.round_name,
            trackName: entry.track_name ? entry.track_name : "Hidden Track",
          },
          driver: {
            id: "",
            username: "",
            avatarType: "preset",
            avatarValue: "black",
          },
          onClick: () => {},
        }))}
      />
      <SpecialRow label="Total Points" value={totalPoints} />
        </>
      )}
    </>
  );

  return (
    <SheetModal
      id={"team-performance"}
      seasonName={seasonName}
      details={{
        title: teamData?.team_name ?? teamName ?? "Unknown Team",
        information: participantLabel,
      }}
      header={"Team Performance"}
      listChildren={listChildren}
      onClose={closeModal}
    />
  );
};

export default TeamPerformance;