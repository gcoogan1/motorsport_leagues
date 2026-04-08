import { useState } from "react";
import { usePanel } from "@/providers/panel/usePanel";
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import PanelLayout from "@/components/Panels/components/PanelLayout/PanelLayout";
import League from "@assets/Icon/League.svg?react";
import CreateIcon from "@assets/Icon/Create.svg?react";
import SearchIcon from "@assets/Icon/Search.svg?react";
import { navigate } from "@/app/navigation/navigation";

const LEAGUE_TABS = [
  { label: "My Leagues", shouldExpand: true },
  { label: "Following" },
];

const LeaguesPanel = () => {
  const { closePanel } = usePanel();
  const [activeTab, setActiveTab] = useState<string>(LEAGUE_TABS[0].label);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleCreateLeague = () => {
    closePanel();
    navigate("/create-league");
    return;
  };

  // const handleGoToLeague = (leagueId: string) => {
  //   closePanel();
  //   navigate(`/league/${leagueId}`);
  // };

  const handleSearchLeagues = () => {
    // openModal(<SearchForm closePanel={closePanel} startingTab="Leagues" />);
  };

  return (
    <PanelLayout
      panelTitle="Leagues"
      panelTitleIcon={<League />}
      tabs={LEAGUE_TABS}
      onTabChange={handleTabChange}
      actions={
        activeTab === "My Leagues" || activeTab === "Following"
          ? {
              primary: {
                label: "Create New League",
                leftIcon: <CreateIcon />,
                action: handleCreateLeague,
              },
              secondary: {
                label: "Find a League",
                leftIcon: <SearchIcon />,
                action: handleSearchLeagues,
              },
            }
          : undefined
      }
    >
      {activeTab === "My Leagues" ? (
        <EmptyMessage
          title="No Leagues Created or Joined"
          icon={<League />}
          subtitle="Use your driver Profile to join a League or use a Squad to create your perfect racing series."
          actions={{
            primary: {
              label: "Create New League",
              leftIcon: <CreateIcon />,
              onClick: handleCreateLeague,
            },
            secondary: {
              label: "Find a League",
              leftIcon: <SearchIcon />,
              onClick: handleSearchLeagues,
            },
          }}
        />
      ) : (
        <EmptyMessage
          title="Not Following Any Leagues"
          icon={<League />}
          subtitle="Track your favorite Leagues that you are not participating in by Following them."
          actions={{
            primary: {
              label: "Create New League",
              leftIcon: <CreateIcon />,
              onClick: handleCreateLeague,
            },
            secondary: {
              label: "Find a League",
              leftIcon: <SearchIcon />,
              onClick: handleSearchLeagues,
            },
          }}
        />
      )}
    </PanelLayout>
  );
};

export default LeaguesPanel;
