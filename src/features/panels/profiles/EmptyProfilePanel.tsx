import { useState } from "react";
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import PanelLayout from "@/components/Panels/components/PanelLayout/PanelLayout";
import Profile from "@assets/Icon/Profile.svg?react";
import Create from "@assets/Icon/Create.svg?react";
import Search from "@assets/Icon/Search.svg?react";

const PROFILE_TABS = [
  { label: "My Profiles", shouldExpand: true },
  { label: "Following" },
];

const EmptyProfilesPanel = () => {
  const [activeTab, setActiveTab] = useState<string>(PROFILE_TABS[0].label);

  return (
    <PanelLayout
      panelTitle="Profiles"
      panelTitleIcon={<Profile />}
      tabs={PROFILE_TABS}
      onTabChange={(tab) => {
        setActiveTab(tab);
      }}
    >
      {activeTab === "My Profiles" ? (
        <EmptyMessage
          title="No Profiles Created"
          icon={<Profile />}
          subtitle="Start participating in Leagues by creating your first driver’s Profile."
          actions={{
            primary: {
              label: "Create New Profile",
              leftIcon: <Create />,
              onClick: () => {
                console.log("Create New Profile clicked");
              },
            },
            secondary: {
              label: "Find a Profile",
              leftIcon: <Search />,
              onClick: () => {
                console.log("Find a Profile clicked");
              },
            },
          }}
        />
      ) : (
        <EmptyMessage
          title="Not Following Any Profiles"
          icon={<Profile />}
          subtitle="Find your friends to follow their Profiles and see their journey at Motorsport Leagues."
          actions={{
            primary: {
              label: "Create New Profile",
              leftIcon: <Create />,
              onClick: () => {
                console.log("Create New Profile clicked");
              },
            },
            secondary: {
              label: "Find a Profile",
              leftIcon: <Search />,
              onClick: () => {
                console.log("Find a Profile clicked");
              },
            },
          }}
        />
      )}
    </PanelLayout>
  );
};

export default EmptyProfilesPanel;
