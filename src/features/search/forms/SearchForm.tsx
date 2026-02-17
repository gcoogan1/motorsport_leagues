import { useState } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { useAuth } from "@/providers/auth/useAuth";
import { useModal } from "@/providers/modal/useModal";
import { navigate } from "@/app/navigation/navigation";
import { useProfiles } from "@/hooks/queries/useProfiles";
import { useDebounce } from "@/hooks/useDebounce";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import Search from "@/components/Search/Search";
import ProfileCard from "@/components/Cards/ProfileCard/ProfileCard";
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import SearchIcon from "@assets/Icon/Search.svg?react";

const SEARCH_TABS = [
  { label: "Profiles" },
  { label: "Squads" },
  { label: "Leagues" },
];

const SearchForm = () => {
  const { user } = useAuth();
  const { closeModal } = useModal();
  const [activeTab, setActiveTab] = useState<string>(SEARCH_TABS[0].label);

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
  );

  const showResults =
    activeTab === "Profiles" && debouncedSearch && !isLoading && !isError;

  // -- Handlers -- //
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleNavigateToProfile = (profileId: string) => { 
    navigate(`/profile/${profileId}`);
    closeModal();
    return
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
        {/* No Search Yet */}
        {!searchValue ? (
          <EmptyMessage
            icon={<SearchIcon />}
            title="Start Searching"
            subtitle="Search for a Profile, Squad, or a League."
          />
        ) : activeTab !== "Profiles" ? (
          <EmptyMessage
            title="Coming Soon"
            subtitle={`${activeTab} search is not implemented yet.`}
          />
        ) : isLoading ? (
          <EmptyMessage title="Searching..." />
        ) : isError ? (
          <EmptyMessage
            title="Something went wrong"
            subtitle="Please try again."
          />
        ) : profiles.length > 0 && showResults ? (
          profiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              cardSize="small"
              username={profile.username}
              userGame={profile.game_type}
              avatarType={profile.avatar_type}
              avatarValue={profile.avatar_value}
              onClick={() => handleNavigateToProfile(profile.id)}
            />
          ))
        ) : (
          <EmptyMessage title="No Results" subtitle="Try a different search." />
        )}
      </Search>
    </FormProvider>
  );
};

export default SearchForm;
