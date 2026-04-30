import { useState } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { useAuth } from "@/providers/auth/useAuth";
import { useModal } from "@/providers/modal/useModal";
import { navigate } from "@/app/navigation/navigation";
import { useProfiles } from "@/rtkQuery/hooks/queries/useProfiles";
import { useSquads } from "@/rtkQuery/hooks/queries/useSquads";
import { useLeagues } from "@/rtkQuery/hooks/queries/useLeagues";
import { useDebounce } from "@/hooks/useDebounce";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { convertGameTypeToFullName } from "@/utils/convertGameTypes";
import type { ThemeName } from "@/app/design/tokens/theme";
import Search from "@/components/Search/Search";
import ProfileCard from "@/components/Cards/ProfileCard/ProfileCard";
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import SearchIcon from "@assets/Icon/Search.svg?react";
import SquadCard from "@/components/Cards/SquadCard/SquadCard";
import LeagueCard from "@/components/Cards/LeagueCard/LeagueCard";
import { getBannerVariants } from "@/components/Banner/Banner.variants";
import { getCoverVariants } from "@/components/Structures/Cover/Cover.variants";

const SEARCH_TABS = [
  { label: "Profiles" },
  { label: "Squads" },
  { label: "Leagues" },
];

type SearchFormProps = {
  closePanel?: () => void;
  startingTab?: string;
};

const SearchForm = ({ closePanel, startingTab }: SearchFormProps) => {
  const { user } = useAuth();
  const { closeModal } = useModal();
  const [activeTab, setActiveTab] = useState<string>(startingTab || SEARCH_TABS[0].label);

  // Lock background scroll while search modal/page is open
  useLockBodyScroll(true);

  // -- Form Setup -- //
  const formMethods = useForm({
    defaultValues: { search: "" },
  });

  const searchValue =
    useWatch({
      control: formMethods.control,
      name: "search",
    }) || "";

  // Debounce search input (prevents excessive queries)
  const debouncedSearch = useDebounce(searchValue, 300);

  // -- Profiles Query -- //
  const {
    data: profiles = [],
    isLoading,
    isError,
  } = useProfiles(
    user?.id,
    debouncedSearch,
    activeTab, // Pass the tab here
    { includeOwnProfiles: true }, // Include user's own profiles in search results
  );

  // -- Squads Query -- //
  const { data: squads = [] } = useSquads(
    user?.id,
    debouncedSearch,
    activeTab, // Pass the tab here
    { includeOwnSquads: true }, // Include user's own squads in search results
  );

  // -- Leagues Query -- //
  const { data: leagues = [] } = useLeagues(
    user?.id,
    debouncedSearch,
    activeTab, // Pass the tab here
    { includeOwnLeagues: true }, // Include user's own leagues in search results
  );

  const hasSearchTerm = debouncedSearch.trim().length > 0;

  const showResults =
    activeTab === "Profiles" && hasSearchTerm && !isLoading && !isError;
  
  const showSquadResults =
    activeTab === "Squads" && hasSearchTerm;

  const showLeagueResults =
    activeTab === "Leagues" && hasSearchTerm;

  // -- Handlers -- //
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleNavigateToProfile = (profileId: string) => { 
    navigate(`/profile/${profileId}`);
    closeModal();
    closePanel?.();
    return;
  }

  const handleNavigateToSquad = (squadId: string) => {
    navigate(`/squad/${squadId}`);
    closeModal();
    closePanel?.();
    return;
  }

  const handleNavigateToLeague = (leagueId: string) => {
    navigate(`/league/${leagueId}`);
    closeModal();
    closePanel?.();
    return;
  }

  return (
    <FormProvider {...formMethods}>
      <Search
        name="search"
        title="Search"
        placeholder="Start typing to search..."
        tabs={SEARCH_TABS}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      >
        {!hasSearchTerm ? (
          <EmptyMessage
            icon={<SearchIcon />}
            title="Start Searching"
            subtitle="Search for a Profile, Squad, or a League."
          />
        ) : activeTab === "Profiles" ? (
          profiles.length > 0 && showResults ? (
            profiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                cardSize="small"
                username={profile.username}
                userGame={convertGameTypeToFullName(profile.game_type)}
                avatarType={profile.avatar_type}
                avatarValue={profile.avatar_value}
                onClick={() => handleNavigateToProfile(profile.id)}
              />
            ))
          ) : (
            <EmptyMessage title="No Results" subtitle="Try a different search." />
          )
        ) : activeTab === "Squads" ? (
          squads.length > 0 && showSquadResults ? (
            squads.map((squad) => (
              <SquadCard 
                key={squad.id}
                name={squad.squad_name}
                memberCount={squad.member_count ?? 0}
                bannerImageUrl={
                  squad.banner_type === "preset"
                    ? getBannerVariants()[squad.banner_value as keyof ReturnType<typeof getBannerVariants>]
                    : squad.banner_value
                }
                size="small"
                onClick={() => handleNavigateToSquad(squad.id)}
              />
            ))
          ) : (
            <EmptyMessage title="No Results" subtitle="Try a different search." />
          )
        ) : activeTab === "Leagues" ? (
          leagues.length > 0 && showLeagueResults ? (
            leagues.map((league) => (
              <LeagueCard
                key={league.id}
                name={league.league_name}
                coverImageUrl={
                  league.cover_type === "preset"
                    ? getCoverVariants()[league.cover_value as keyof ReturnType<typeof getCoverVariants>]
                    : league.cover_value
                }
                seasonStatus={league.league_status}
                size="small"
                gameType={league.game_type}
                hostingSquad={league.hosting_squad_name}
                numOfParticipants={league.participants.length}
                onClick={() => handleNavigateToLeague(league.id)}
                themeColor={league.theme_color as ThemeName}
              />
            ))
          ) : (
            <EmptyMessage title="No Results" subtitle="Try a different search." />
          )
        ) : (
          <EmptyMessage title="No Results" subtitle="Try a different search." />
        )}
      </Search>
    </FormProvider>
  );
};

export default SearchForm;
