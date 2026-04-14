import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { usePanel } from "@/providers/panel/usePanel";
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import PanelLayout from "@/components/Panels/components/PanelLayout/PanelLayout";
import League from "@assets/Icon/League.svg?react";
import CreateIcon from "@assets/Icon/Create.svg?react";
import SearchIcon from "@assets/Icon/Search.svg?react";
import { navigate } from "@/app/navigation/navigation";
import {
  fetchLeaguesByAccountIdThunk,
  getLeagueByIdThunk,
} from "@/store/leagues/league.thunk";

const LEAGUE_TABS = [
  { label: "My Leagues", shouldExpand: true },
  { label: "Following" },
];

const LeaguesPanel = () => {
  const { closePanel } = usePanel();
  const [activeTab, setActiveTab] = useState<string>(LEAGUE_TABS[0].label);
  const dispatch = useDispatch<AppDispatch>();
  const accountId = useSelector((state: RootState) => state.account.data?.id);
  const leagues = useSelector((state: RootState) => state.league.data);
  const leagueStatus = useSelector((state: RootState) => state.league.status);

  useEffect(() => {
    if (accountId) {
      dispatch(fetchLeaguesByAccountIdThunk(accountId));
    }
  }, [accountId, dispatch]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleCreateLeague = () => {
    closePanel();
    navigate("/create-league");
    return;
  };

  const handleGoToLeague = async (leagueId: string) => {
    await dispatch(getLeagueByIdThunk(leagueId));
    closePanel();
    navigate(`/league/${leagueId}`);
  };

  const handleSearchLeagues = () => {
    // openModal(<SearchForm closePanel={closePanel} startingTab="Leagues" />);
  };

  const hasLeagues = (leagues?.length ?? 0) > 0;

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
                label: "Search",
                leftIcon: <SearchIcon />,
                action: handleSearchLeagues,
              },
            }
          : undefined
      }
    >
      {activeTab === "My Leagues" ? (
        hasLeagues ? (
          <div>
            {leagues?.map((league) => (
              <div
                key={league.id}
                onClick={() => {
                  void handleGoToLeague(league.id);
                }}
                style={{ cursor: "pointer", padding: "12px 0" }}
              >
                {league.league_name}
              </div>
            ))}
          </div>
        ) : leagueStatus === "loading" ? (
          null
        ) : (
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
        )
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
