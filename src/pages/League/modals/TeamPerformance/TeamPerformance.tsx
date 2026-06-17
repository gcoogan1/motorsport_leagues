import { useMemo } from "react";
import SheetModal from "@/components/Sheets/SheetModal/SheetModal";
import Table from "@/components/Tables/Table/Table";
import { useModal } from "@/providers/modal/useModal";
import { useTeamPerformanceResults } from "./useTeamPerfomance";
import SpecialRow from "@/components/Tables/SpecialRow/SpecialRow";

type TeamPerformanceProps = {
  teamId: string;
  seasonName: string;
};

const TeamPerformance = ({
  teamId,
  seasonName,
}: TeamPerformanceProps) => {
  const { closeModal } = useModal();
  const { teamData, teamName, results } =
    useTeamPerformanceResults(teamId);

  const eventResults = useMemo(() => {
    return (results ?? []).filter((entry) => (entry.points ?? 0) > 0);
  }, [results]);

  const totalPoints = eventResults.reduce((acc, entry) => acc + (entry.points ?? 0), 0);

  if (!teamData || eventResults.length === 0) {
    return null;
  }


  const listChildren = (
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
            trackName: entry.track_name,
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
  );

  return (
    <SheetModal
      id={"team-performance"}
      seasonName={seasonName}
      blockHeader={teamData.team_name ?? "Unknown Team"}
      blockDescription={teamName ?? ""}
      header={"Team Performance"}
      listChildren={listChildren}
      onClose={closeModal}
    />
  );
};

export default TeamPerformance;