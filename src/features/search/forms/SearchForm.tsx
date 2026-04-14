import { useState } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { useAuth } from "@/providers/auth/useAuth";
import { useModal } from "@/providers/modal/useModal";
import { navigate } from "@/app/navigation/navigation";
import { useProfiles } from "@/hooks/rtkQuery/queries/useProfiles";
import { useSquads } from "@/hooks/rtkQuery/queries/useSquads";
import { useDebounce } from "@/hooks/useDebounce";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { convertGameTypeToFullName } from "@/utils/convertGameTypes";
import Search from "@/components/Search/Search";
import ProfileCard from "@/components/Cards/ProfileCard/ProfileCard";
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import SearchIcon from "@assets/Icon/Search.svg?react";
import SquadCard from "@/components/Cards/SquadCard/SquadCard";
import { getBannerVariants } from "@/components/Banner/Banner.variants";

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

  const hasSearchTerm = debouncedSearch.trim().length > 0;

  const showResults =
    activeTab === "Profiles" && hasSearchTerm && !isLoading && !isError;
  
  const showSquadResults =
    activeTab === "Squads" && hasSearchTerm;

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
        ) : (
          <EmptyMessage title="No Results" subtitle="Try a different search." />
        )}
      </Search>
    </FormProvider>
  );
};

export default SearchForm;
