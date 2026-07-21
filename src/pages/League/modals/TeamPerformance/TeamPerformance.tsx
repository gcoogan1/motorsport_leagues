import SheetModal from "@/components/Sheets/SheetModal/SheetModal";
import Table from "@/components/Tables/Table/Table";
import { useModal } from "@/providers/modal/useModal";
import { useTeamPerformanceResults } from "./useTeamPerfomance";
import SpecialRow from "@/components/Tables/SpecialRow/SpecialRow";
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import LoadingMessage from "@/components/Messages/LoadingMessage/LoadingMessage";
import ResultsModal from "@/pages/League/modals/ResultsModal/ResultsModal";
import SetupIcon from "@assets/Icon/Season_Setup.svg?react";

type TeamPerformanceProps = {
  teamId: string;
  seasonId?: string;
  seasonName: string;
  teamName?: string;
  numOfDrivers?: number;
};

const TeamPerformance = ({
  teamId,
  seasonId,
  teamName,
  numOfDrivers,
  seasonName,
}: TeamPerformanceProps) => {
  const { closeModal, openModal } = useModal();
  const { teamData, events, driverCount, isLoading } =
    useTeamPerformanceResults(teamId);

  const resolvedDriverCount = driverCount === 0 ? numOfDrivers ?? 0 : driverCount;
  const participantLabel = `${resolvedDriverCount} Driver${resolvedDriverCount === 1 ? "" : "s"}`;

  const totalPoints = events.reduce((acc, entry) => acc + entry.totalPoints, 0);

  const isEmpty = !teamData || events.length === 0;

  const handleEventClick = (eventId: string) => {
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
      {isLoading ? (
        <LoadingMessage />
      ) : isEmpty ? (
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
            results={events.map((event) => ({
              points: event.totalPoints,
              type: "team",
              roundInfo: {
                roundName: event.roundName,
                trackName: event.eventName,
                secondaryLabel: event.eventName,
              },
              driver: {
                id: event.eventId,
                username: teamData?.team_name ?? teamName ?? "Unknown Team",
                teamName: teamData?.team_name ?? teamName ?? "Unknown Team",
                avatarType: "preset",
                avatarValue: "black",
              },
              onClick: () => handleEventClick(event.eventId),
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