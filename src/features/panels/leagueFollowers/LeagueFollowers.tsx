import { useAuth } from "@/providers/auth/useAuth";
import { useModal } from "@/providers/modal/useModal";
import { navigate } from "@/app/navigation/navigation";
import { usePanel } from "@/providers/panel/usePanel";
import { useLeagueFollowers } from "@/rtkQuery/hooks/queries/useLeagueFollowers";
import { convertProfilesToSelectOptions } from "@/utils/convertProfilesToSelectOptions";
import { useSelector } from "react-redux";
import { selectCurrentLeague, selectLeagueViewType, selectIsCurrentLeagueParticipantDirector } from "@/store/leagues/league.selectors";

import PanelLayout from "@/components/Panels/components/PanelLayout/PanelLayout";
import FollowersIcon from "@assets/Icon/Followers.svg?react";
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import ProfileList, { type ProfileAction } from "@/components/Lists/ProfileList/ProfileList";
import RemoveLeagueFollower from "./modals/core/RemoveLeagueFollower/RemoveLeagueFollower";


type LeagueFollowersProps = {
  leagueId?: string;
};

const LeagueFollowers = ({ leagueId }: LeagueFollowersProps) => {
  const { openModal } = useModal();
  const { closePanel } = usePanel();
  const { user } = useAuth();
  const currentLeague = useSelector(selectCurrentLeague);
  const leagueViewType = useSelector(selectLeagueViewType);
  const isDirectorParticipant = useSelector(selectIsCurrentLeagueParticipantDirector);
  const resolvedLeagueId = leagueId ?? currentLeague?.id ?? "";
  const isDirector = isDirectorParticipant === true && leagueViewType !== "loading";
  const { data: followers = [] } = useLeagueFollowers(resolvedLeagueId);

  const formatedProfiles = convertProfilesToSelectOptions(followers || []).map(
    (profile) => ({
      id: profile.value,
      label: profile.label,
      avatar: profile.avatar,
      secondaryInfo: profile.secondaryInfo,
    }),
  );

  const followersCount = followers.length;
  const followersPanelTitle = `${followersCount} Follower${followersCount !== 1 ? "s" : ""}`;
  const emptyPanelTitle = "Followers";

  const handleProfileAction = (selectedProfileId: string, action: ProfileAction) => {
    if (action === "view") {
      closePanel();
      navigate(`/profile/${selectedProfileId}`);
    } else if (action === "remove") {
      if (!user?.id) return;
      openModal(<RemoveLeagueFollower followerProfileId={selectedProfileId} currentLeagueId={resolvedLeagueId} />);
    }
  };

  return (
    <PanelLayout
      panelTitle={followersCount > 0 ? followersPanelTitle : emptyPanelTitle}
      panelTitleIcon={<FollowersIcon />}
    >
      <>
        {followers && followers.length > 0 ? (
          <ProfileList
            key={resolvedLeagueId}
            items={formatedProfiles}
            onClick={handleProfileAction}
            allowRemoveAction={isDirector}
            removeType="follower"
            listType="league"
          />
        ) : (
          <EmptyMessage
            title="No Followers Yet"
            icon={<FollowersIcon />}
            subtitle="Followers of this League will appear here."
          />
        )}
      </>
    </PanelLayout>
  );
};

export default LeagueFollowers;
