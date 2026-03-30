import { useAuth } from "@/providers/auth/useAuth";
import { useModal } from "@/providers/modal/useModal";
import { navigate } from "@/app/navigation/navigation";
import { usePanel } from "@/providers/panel/usePanel";
import { useSquadFollowers } from "@/hooks/rtkQuery/queries/useSquadFollowers";
import { convertProfilesToSelectOptions } from "@/utils/convertProfilesToSelectOptions";
import { useSelector } from "react-redux";
import { selectCurrentSquad, selectSquadViewType } from "@/store/squads/squad.selectors";

import PanelLayout from "@/components/Panels/components/PanelLayout/PanelLayout";
import FollowersIcon from "@assets/Icon/Followers.svg?react";
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import ProfileList, { type ProfileAction } from "@/components/Lists/ProfileList/ProfileList";
import RemoveSquadFollower from "./modals/core/RemoveSquadFollower/RemoveSquadFollower";


type SquadFollowersProps = {
  squadId?: string;
};

const SquadFollowers = ({ squadId }: SquadFollowersProps) => {
  const { openModal } = useModal();
  const { closePanel } = usePanel();
  const { user } = useAuth();
  const currentSquad = useSelector(selectCurrentSquad);
  const squadViewType = useSelector(selectSquadViewType);
  const resolvedSquadId = squadId ?? currentSquad?.id ?? "";
  const { data: followers = [] } = useSquadFollowers(resolvedSquadId);

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
      openModal(<RemoveSquadFollower followerProfileId={selectedProfileId} currentSquadId={resolvedSquadId} />);
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
            key={resolvedSquadId}
            items={formatedProfiles}
            onClick={handleProfileAction}
            allowRemoveAction={squadViewType === "founder"}
            removeType="follower"
            listType="squad"
          />
        ) : (
          <EmptyMessage
            title="No Followers Yet"
            icon={<FollowersIcon />}
            subtitle="Followers of this Squad will appear here."
          />
        )}
      </>
    </PanelLayout>
  );
};

export default SquadFollowers;
