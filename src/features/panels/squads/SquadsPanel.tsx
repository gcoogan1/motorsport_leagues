import { useState } from "react";
import { useSelector } from "react-redux";
import { type RootState } from "@/store";
// import { useAuth } from "@/providers/auth/useAuth";
// import { useModal } from "@/providers/modal/useModal";
// import { usePanel } from "@/providers/panel/usePanel";
import SquadIcon from "@assets/Icon/Squad.svg?react";
import CreateIcon from "@assets/Icon/Create.svg?react";
import SearchIcon from "@assets/Icon/Search.svg?react";
import PanelLayout from "@/components/Panels/components/PanelLayout/PanelLayout";
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import SquadCard from "@/components/Cards/SquadCard/SquadCard";


const SQUAD_TABS = [
  { label: "My Squads", shouldExpand: true },
  { label: "Following" },
];

const SquadsPanel = () => {
  // const { user } = useAuth();
  // const { closePanel } = usePanel();
  // const { openModal } = useModal();
  const [activeTab, setActiveTab] = useState<string>(SQUAD_TABS[0].label);
  const squads = useSelector((state: RootState) => state.squad.data);


  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleCreateSquad = () => {};

  const handleSearchSquads = () => {};

  return (
    <PanelLayout
      panelTitle="Squads"
      panelTitleIcon={<SquadIcon />}
      tabs={SQUAD_TABS}
      
      onTabChange={handleTabChange}
      actions={
        activeTab === "My Squads" && squads && squads.length > 0
          ? {
              primary: {
                label: "Create New Squad",
                leftIcon: <CreateIcon />,
                action: handleCreateSquad,
              },
              secondary: {
                label: "Find a Squad",
                leftIcon: <SearchIcon />,
                action: handleSearchSquads,
              },
            }
          : undefined
      }
    >
      {activeTab === "My Squads" ? (
        <>
          {squads && squads.length > 0 ? (
            squads.map((squad) => (
              <SquadCard 
                key={squad.id}
                name={squad.squad_name}
                memberCount={0}
                bannerImageUrl={squad.banner_image_url || undefined}
                size="medium"
              
              />
            ))
          ) : (
            <EmptyMessage
            title="No Squads Created or Joined"
            icon={<SearchIcon />}
            subtitle="Start building your racing community by creating or joining your first Squad with a Profile."
            actions={{
              primary: {
                label: "Create New Squad",
                leftIcon: <CreateIcon />,
                onClick: handleCreateSquad,
              },
              secondary: {
                label: "Find a Squad",
                leftIcon: <SearchIcon />,
                onClick: handleSearchSquads,
              },
            }}
          />
          )}
        </>
      ) : (
        <>
          <EmptyMessage
            title="Not Following Any Squads"
            icon={<SearchIcon />}
            subtitle="Keep up with your favorite teams and communities by following Squads."
            actions={{
              primary: {
                label: "Create New Squad",
                leftIcon: <CreateIcon />,
                onClick: handleCreateSquad,
              },
              secondary: {
                label: "Find a Squad",
                leftIcon: <SearchIcon />,
                onClick: handleSearchSquads,
              },
            }}
          />
        </>
      )}
    </PanelLayout>
  );
};

export default SquadsPanel;