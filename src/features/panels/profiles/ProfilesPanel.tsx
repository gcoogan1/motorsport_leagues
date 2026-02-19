import { useState } from "react";
import { useSelector } from "react-redux";
import { type RootState } from "@/store";
import { navigate } from "@/app/navigation/navigation";
import { usePanel } from "@/providers/panel/usePanel";
import { useAuth } from "@/providers/auth/useAuth";
import { useModal } from "@/providers/modal/useModal";
import { useProfileFollowing } from "@/hooks/rtkQuery/queries/useProfileFollowers";
import { convertGameTypeToFullName } from "@/utils/convertGameTypes";
import PanelLayout from "@/components/Panels/components/PanelLayout/PanelLayout";
import Create from "@assets/Icon/Create.svg?react";
import SearchIcon from "@assets/Icon/Search.svg?react";
import Profile from "@assets/Icon/Profile.svg?react";
import ProfileCard from "@/components/Cards/ProfileCard/ProfileCard";
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import SearchForm from "@/features/search/forms/SearchForm";

//TODO: Add functionality to actions and following tab

const PROFILE_TABS = [
  { label: "My Profiles", shouldExpand: true },
  { label: "Following" },
];

const ProfilesPanel = () => {
  const { user } = useAuth();
  const { closePanel } = usePanel();
  const { openModal } = useModal();
  const [activeTab, setActiveTab] = useState<string>(PROFILE_TABS[0].label);

  const profiles = useSelector((state: RootState) => state.profile.data);
  const { data: following = [] } = useProfileFollowing(user?.id || "");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleGoToProfile = (profileId: string) => {
    closePanel();
    navigate(`/profile/${profileId}`);
  };

  const handleCreateProfile = () => {
    closePanel();
    navigate("/create-profile");
  };

  const handleSearchProfiles = () => {
    openModal(<SearchForm />);
  };

  return (
    <PanelLayout
      panelTitle="Profiles"
      panelTitleIcon={<Profile />}
      tabs={PROFILE_TABS}
      onTabChange={handleTabChange}
      actions={
        activeTab === "My Profiles" && profiles && profiles.length > 0
          ? {
              primary: {
                label: "Create Profile",
                leftIcon: <Create />,
                action: handleCreateProfile,
              },
              secondary: {
                label: "Search",
                leftIcon: <SearchIcon />,
                action: handleSearchProfiles,
              },
            }
          : undefined
      }
    >
      {activeTab === "My Profiles" ? (
        <>
          {profiles && profiles.length > 0 ? (
            profiles.map((prof) => (
              <ProfileCard
                key={prof.id}
                userGame={convertGameTypeToFullName(prof.game_type)}
                username={prof.username}
                cardSize="medium"
                onClick={() => handleGoToProfile(prof.id)}
                avatarType={prof.avatar_type}
                avatarValue={prof.avatar_value}
              />
            ))
          ) : (
            <EmptyMessage
              title="No Profiles Created"
              icon={<Profile />}
              subtitle="Start participating in Leagues by creating your first driver’s Profile."
              actions={{
                primary: {
                  label: "Create New Profile",
                  leftIcon: <Create />,
                  onClick: handleCreateProfile,
                },
              }}
            />
          )}
        </>
      ) : (
        <>
          {following && following.length > 0 ? (
            following.map((prof) => (
              <ProfileCard
                key={prof.id}
                userGame={convertGameTypeToFullName(prof.game_type)}
                username={prof.username}
                cardSize="small"
                onClick={() => handleGoToProfile(prof.id)}
                avatarType={prof.avatar_type}
                avatarValue={prof.avatar_value}
              />
            ))
          ) : (
            <EmptyMessage
              title="Not Following Any Profiles"
              icon={<Profile />}
              subtitle="Find your friends to follow their Profiles and see their journey."
              actions={{
                secondary: {
                  label: "Find a Profile",
                  leftIcon: <SearchIcon />,
                  onClick: handleSearchProfiles,
                },
              }}
            />
          )}
        </>
      )}
    </PanelLayout>
  );
};

export default ProfilesPanel;
