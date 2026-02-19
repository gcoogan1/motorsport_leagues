import { useAuth } from "@/providers/auth/useAuth";
import { useModal } from "@/providers/modal/useModal";
import { navigate } from "@/app/navigation/navigation";
import { usePanel } from "@/providers/panel/usePanel";
import { useProfileFollowers } from "@/hooks/rtkQuery/queries/useProfileFollowers";
import { convertProfilesToSelectOptions } from "@/utils/convertProfilesToSelectOptions";
import PanelLayout from "@/components/Panels/components/PanelLayout/PanelLayout";
import FollowersIcon from "@assets/Icon/Followers.svg?react";
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import ProfileList from "@/components/Lists/ProfileList/ProfileList";
import RemoveFollower from "./modals/core/RemoveFollower/RemoveFollower";

type ProfileFollowersProps = {
  profileId: string;
};

const ProfileFollowers = ({ profileId }: ProfileFollowersProps) => {
  const { openModal } = useModal();
  const { closePanel } = usePanel();
  const { user } = useAuth();
  const { data: followers = [] } = useProfileFollowers(profileId ?? "");

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

  const handleProfileAction = (selectedProfileId: string, action: "view" | "remove") => {
    if (action === "view") {
      closePanel();
      navigate(`/profile/${selectedProfileId}`);
    } else if (action === "remove") {
      if (!user?.id) return;
      openModal(<RemoveFollower followerProfileId={selectedProfileId} currentProfileId={profileId} />);
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
            key={profileId}
            items={formatedProfiles}
            onClick={handleProfileAction}
          />
        ) : (
          <EmptyMessage
            title="No Followers Yet"
            icon={<FollowersIcon />}
            subtitle="Followers of this Profile will appear here."
          />
        )}
      </>
    </PanelLayout>
  );
};

export default ProfileFollowers;
