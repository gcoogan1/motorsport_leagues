import { useMemo, useState } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import Search from "@/components/Search/Search";
import ProfileCard from "@/components/Cards/ProfileCard/ProfileCard";
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import SearchIcon from "@assets/Icon/Search.svg?react";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

// TODO: Data needs to be pulled from Redux State.
// Squads and Leagues still need to be implemented.

const SEARCH_TABS = [
  { label: "Profiles" },
  { label: "Squads" },
  { label: "Leagues" },
];

//REMOVE
const DUMMY_DATA: Record<string, any[]> = {
  Profiles: [
    {
      id: 1,
      username: "MaxVerstappen",
      userGame: "Gran Turismo 7",
      avatarType: "preset",
      avatarValue: "black",
    },
    {
      id: 2,
      username: "LewisHamilton",
      userGame: "Gran Turismo 7",
      avatarType: "preset",
      avatarValue: "blue",
    },
    {
      id: 3,
      username: "ValtteriBottas",
      userGame: "Gran Turismo 7",
      avatarType: "preset",
      avatarValue: "green",
    },
    {
      id: 4,
      username: "ValtteriBottas",
      userGame: "Gran Turismo 7",
      avatarType: "preset",
      avatarValue: "green",
    },
    {
      id: 5,
      username: "ValtteriBottas",
      userGame: "Gran Turismo 7",
      avatarType: "preset",
      avatarValue: "green",
    },
    {
      id: 6,
      username: "ValtteriBottas",
      userGame: "Gran Turismo 7",
      avatarType: "preset",
      avatarValue: "green",
    },
    {
      id: 7,
      username: "ValtteriBottas",
      userGame: "Gran Turismo 7",
      avatarType: "preset",
      avatarValue: "green",
    },
    {
      id: 8,
      username: "ValteriBottas",
      userGame: "Gran Turismo 7",
      avatarType: "preset",
      avatarValue: "green",
    },
    {
      id: 9,
      username: "ValtteriBottas",
      userGame: "Gran Turismo 7",
      avatarType: "preset",
      avatarValue: "green",
    },
    {
      id: 10,
      username: "ValtteriBottas",
      userGame: "Gran Turismo 7",
      avatarType: "preset",
      avatarValue: "green",
    },
    {
      id: 11,
      username: "ValtteriBottas",
      userGame: "Gran Turismo 7",
      avatarType: "preset",
      avatarValue: "green",
    },
    {
      id: 12,
      username: "ValtteriBottas",
      userGame: "Gran Turismo 7",
      avatarType: "preset",
      avatarValue: "green",
    },
    {
      id: 13,
      username: "ValtteriBottas",
      userGame: "Gran Turismo 7",
      avatarType: "preset",
      avatarValue: "green",
    },
    {
      id: 14,
      username: "ValtteriBottas",
      userGame: "Gran Turismo 7",
      avatarType: "preset",
      avatarValue: "green",
    },
    {
      id: 15,
      username: "ValtteriBottas",
      userGame: "Gran Turismo 7",
      avatarType: "preset",
      avatarValue: "green",
    },
    {
      id: 16,
      username: "ValtteriBottas",
      userGame: "Gran Turismo 7",
      avatarType: "preset",
      avatarValue: "green",
    },
  ],
};

const SearchForm = () => {
  const [activeTab, setActiveTab] = useState<string>(SEARCH_TABS[0].label);
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

  // -- Filtered Results -- //

  // This is where we will use Redux State to get real data.
  // For now we just filter dummy data based on the active tab and search value
  const filteredResults = useMemo(() => {
    const currentCategory = DUMMY_DATA[activeTab] || [];
    if (!searchValue) return currentCategory;

    return currentCategory.filter((item) => {
      const text = (item.username || item.name || "").toLowerCase();
      return text.includes(searchValue.toLowerCase());
    });
  }, [searchValue, activeTab]);

  // -- Handlers -- //

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

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
        {!searchValue ? (
          <EmptyMessage
            icon={<SearchIcon />}
            title="Start Searching"
            subtitle="Search for a Profile, Squad, or a League."
          />
        ) : (
          filteredResults.length > 0 ? (
            filteredResults.map((result) => (
              <ProfileCard
                key={result.id}
                cardSize="small"
                username={result.username}
                userGame={result.userGame}
                avatarType={result.avatarType}
                avatarValue={result.avatarValue}
              />
            ))
          ) : (
            <EmptyMessage
              title="No Results"
              subtitle={`Try a different search.`}
            />
          )
        )}
      </Search>
    </FormProvider>
  );
};

export default SearchForm;
