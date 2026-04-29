import { useSelector } from "react-redux";
// import { useModal } from "@/providers/modal/useModal";
import { usePanel } from "@/providers/panel/usePanel";
import { useLeagueParticipants } from "@/rtkQuery/hooks/queries/useLeagues";
import { selectCurrentLeague, selectIsCurrentLeagueParticipantDirector, selectLeagueViewType } from "@/store/leagues/league.selectors";
import PanelLayout from "@/components/Panels/components/PanelLayout/PanelLayout";
import ParticipantsIcon from "@assets/Icon/Participants.svg?react";
import type { Tag } from "@/components/Tags/Tags.variants";
import { convertGameTypeToFullName } from "@/utils/convertGameTypes";
import ProfileList, { type ProfileAction } from "@/components/Lists/ProfileList/ProfileList";
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import { navigate } from "@/app/navigation/navigation";

type LeagueParticipantsProps = {
  leagueId: string;
};

const LeagueParticipants = ({ leagueId }: LeagueParticipantsProps) => {
  const { closePanel } = usePanel();
    // const { openModal } = useModal();
    const currentLeague = useSelector(selectCurrentLeague);
    const leagueViewType = useSelector(selectLeagueViewType);
    const isDirectorParticipant = useSelector(selectIsCurrentLeagueParticipantDirector);
    const isDirector = isDirectorParticipant === true && leagueViewType !== "loading";
    const resolvedLeagueId = leagueId ?? currentLeague?.id ?? "";
    const { data: participants = [] } = useLeagueParticipants(resolvedLeagueId);

    const formatedProfiles = participants.map((participant) => ({
      id: participant.profile_id,
      label: participant.username,
      avatar: {
        avatarType: participant.avatar_type,
        avatarValue: participant.avatar_value,
      },
      secondaryInfo: convertGameTypeToFullName(participant.game_type),
      tags: participant.roles ? (participant.roles as Tag[]) : undefined,
    }));
  
    const participantsCount = participants.length;
    const participantsPanelTitle = `${participantsCount} Participant${participantsCount !== 1 ? "s" : ""}`;
    const emptyPanelTitle = "Participants";


    const handleProfileAction = (
        selectedProfileId: string,
        action: ProfileAction,
      ) => {
        if (action === "view") {
          closePanel();
          navigate(`/profile/${selectedProfileId}`);
        } else if (action === "manage") {
          closePanel();
          navigate(`/league/${resolvedLeagueId}/management`);
          return
        }
      };



  return (
    <PanelLayout
      panelTitle={participantsCount > 0 ? participantsPanelTitle : emptyPanelTitle}
      panelTitleIcon={<ParticipantsIcon />}
    >
      <>
          {participants && participants.length > 0 ? (
            <ProfileList
              key={resolvedLeagueId}
              items={formatedProfiles}
              onClick={handleProfileAction}
              allowManageAction={isDirector}
              listType="league"
            />
          ) : (
            <EmptyMessage
              title="No Participants Yet"
              icon={<ParticipantsIcon />}
              subtitle="Participants of this League will appear here."
            />
          )}
        </>
    </PanelLayout>
  )
}

export default LeagueParticipants