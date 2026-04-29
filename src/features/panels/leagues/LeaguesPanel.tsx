import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { usePanel } from "@/providers/panel/usePanel";
import { navigate } from "@/app/navigation/navigation";
import { useModal } from "@/providers/modal/useModal";
import { getLeagueByIdThunk } from "@/store/leagues/league.thunk";
import type { LeagueTable } from "@/types/league.types";
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import SearchForm from "@/features/search/forms/SearchForm";
import PanelLayout from "@/components/Panels/components/PanelLayout/PanelLayout";
import League from "@assets/Icon/League.svg?react";
import CreateIcon from "@assets/Icon/Create.svg?react";
import SearchIcon from "@assets/Icon/Search.svg?react";
import { useParticipantLeagues } from "@/rtkQuery/hooks/queries/useLeagues";
import { useLeagueFollowing } from "@/rtkQuery/hooks/queries/useLeagueFollowers";
import LeagueCard from "@/components/Cards/LeagueCard/LeagueCard";
import { getCoverVariants } from "@/components/Structures/Cover/Cover.variants";

const LEAGUE_TABS = [
  { label: "My Leagues", shouldExpand: true },
  { label: "Following" },
];

type LeagueListItemProps = {
  league: LeagueTable;
  onClick: () => void;
  isSmall?: boolean;
};

// This component is used to render each league in the list of leagues on the LeaguesPanel. It displays the league name, member count, and banner image.
const LeagueListItem = ({ league, onClick, isSmall }: LeagueListItemProps) => {
  const coverImage =
    league.cover_type === "preset"
      ? getCoverVariants()[
          league.cover_value as keyof ReturnType<typeof getCoverVariants>
        ]
      : league.cover_value;

  return (
    <LeagueCard
      name={league.league_name}
      hostingSquad={league.hosting_squad_name}
      coverImageUrl={coverImage}
      size={isSmall ? "small" : "medium"}
      onClick={onClick}
      seasonStatus={league.league_status}
    />
  );
};

const LeaguesPanel = () => {
  const { openModal } = useModal();
  const { closePanel } = usePanel();
  const [activeTab, setActiveTab] = useState<string>(LEAGUE_TABS[0].label);
  const dispatch = useDispatch<AppDispatch>();
  const accountId = useSelector((state: RootState) => state.account.data?.id);
  const {
    data: following = [],
    isLoading: isFollowingLoading,
  } = useLeagueFollowing(accountId ?? "");
  const {
    data: myLeagues = [],
    isLoading: isMyLeaguesLoading,
  } = useParticipantLeagues(accountId);

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
    openModal(<SearchForm closePanel={closePanel} startingTab="Leagues" />);
  };

  if (activeTab === "My Leagues" && isMyLeaguesLoading) {
    return null;
  }

  if (activeTab === "Following" && isFollowingLoading) {
    return null;
  }

  return (
    <PanelLayout
      panelTitle="Leagues"
      panelTitleIcon={<League />}
      tabs={LEAGUE_TABS}
      onTabChange={handleTabChange}
      actions={
        activeTab === "My Leagues" || (activeTab === "Following" && following && following.length > 0)
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
        myLeagues.length > 0 ? (
          myLeagues.map((league) => {
            const coverImageUrl =
              league.cover_type === "preset"
                ? getCoverVariants()[league.cover_value as keyof ReturnType<typeof getCoverVariants>]
                : league.cover_value;
            const participant = league.participants.find((p) => p.account_id === accountId);
            const roleTags = participant?.roles ?? [];

            return (
              <LeagueCard
                key={league.id}
                name={league.league_name}
                coverImageUrl={coverImageUrl}
                seasonStatus={league.league_status}
                size="medium"
                gameType={league.game_type}
                hostingSquad={league.hosting_squad_name}
                numOfParticipants={league.participants.length}
                onClick={() => handleGoToLeague(league.id)}
                tags={roleTags}
              />
            );
          })
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
        following && following.length > 0 ?  (
          following.map((league) => {
            return (
              <LeagueListItem
                key={league.id}
                league={league}
                onClick={() => handleGoToLeague(league.id)}
                isSmall
              />
            );
          })
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
        )
      )}
    </PanelLayout>
  );
};

export default LeaguesPanel;
