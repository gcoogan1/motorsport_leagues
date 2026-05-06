import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import type { SelectButtonOption } from "@/components/SelectButton/SelectButton";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { navigate } from "@/app/navigation/navigation";
import { useAppTheme } from "@/providers/theme/useTheme";
import { useModal } from "@/providers/modal/useModal";
import { usePanel } from "@/providers/panel/usePanel";
import type { AppDispatch, RootState } from "@/store";
import { getLeagueByIdThunk } from "@/store/leagues/league.thunk";
import { useLeagueSeasons } from "@/rtkQuery/hooks/queries/useLeagues";
import ManageIcon from "@assets/Icon/Manage.svg?react";
import DropdownIcon from "@assets/Icon/Dropdown.svg?react";
import SubNavbar from "@/components/Structures/SubNavbar/SubNavbar";
import ManageMenu, {
  type ManageMenuSection,
} from "@/components/Structures/ManageMenu/ManageMenu";
import Button from "@/components/Button/Button";
import {
  Content,
  ContentContainer,
  ManageMenuMobileWrapper,
  ManageMenuWrapper,
  Wrapper,
} from "./LeagueManagment.styles";
import Settings from "@/features/leagues/forms/Edit/Settings/Settings";
import Roles from "@/features/leagues/forms/Roles/Roles";
import UnsavedChanges from "@/features/leagues/modals/errors/UnsavedChanges/UnsavedChanges";
import SeasonSettings from "@/features/leagues/forms/Edit/SeasonSettings/SeasonSettings";

//TODO: Replace panelContent with SheetForms for each section once they are developed, and implement logic to fetch and display actual data for each section.

const LeagueManagment = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { openModal } = useModal();
  const { closePanel } = usePanel();
  const { setOverrideThemeName, clearOverrideThemeName } = useAppTheme();
  const { leagueId } = useParams<{ leagueId: string }>();
  const [activeSection, setActiveSection] =
    useState<ManageMenuSection>("season-settings");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  // const activePanel = panelContent[activeSection];
  const [openManageMenu, setOpenManageMenu] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState("");
  const isLargeScreen = useMediaQuery("(min-width: 920px)");
  const currentLeague = useSelector(
    (state: RootState) => state.league.currentLeague,
  );
  const { data: seasons = [] } = useLeagueSeasons(leagueId ?? "");

  const seasonOptions = useMemo<SelectButtonOption[]>(
    () =>
      seasons.map((season) => ({
        value: season.id,
        label: season.season_name,
      })),
    [seasons],
  );
  const activeSeasonData = useMemo(() => {
    if (seasons.length === 0) {
      return undefined;
    }

    return seasons.find((season) => season.id === selectedSeason) ?? seasons[0];
  }, [seasons, selectedSeason]);
  const mostRecentSeasonId = seasons.at(-1)?.id ?? "";
  const activeSeasonId = activeSeasonData?.id ?? "";

  useLockBodyScroll(openManageMenu && !isLargeScreen);

  // Load league data
  useEffect(() => {
    if (leagueId && currentLeague?.id !== leagueId) {
      dispatch(getLeagueByIdThunk(leagueId));
    }
  }, [leagueId, currentLeague?.id, dispatch]);

  // Set theme color based on league settings
  useEffect(() => {
    if (!currentLeague?.theme_color || currentLeague.id !== leagueId) {
      return;
    }

    setOverrideThemeName(currentLeague.theme_color);

    return () => {
      clearOverrideThemeName();
    };
  }, [
    currentLeague?.id,
    currentLeague?.theme_color,
    leagueId,
    setOverrideThemeName,
    clearOverrideThemeName,
  ]);

  const activeSheet =
    activeSection === "league-settings" && leagueId ? (
      <Settings leagueId={leagueId} onDirtyChange={setHasUnsavedChanges} />
    ) : activeSection === "participant-roles" && leagueId ? (
      <Roles leagueId={leagueId} onDirtyChange={setHasUnsavedChanges} />
    ) : activeSection === "season-settings" && activeSeasonData ? (
      <SeasonSettings
        seasonData={activeSeasonData}
        isMostRecentSeason={activeSeasonId === mostRecentSeasonId}
        onDirtyChange={setHasUnsavedChanges}
      />
    ) : activeSection === "overview-page" && activeSeasonData ? (
      <>{activeSeasonData.season_name}</>
    ) : activeSection === "driver-assignments" && activeSeasonData ? (
      <>{activeSeasonData.season_name}</>
    ) : activeSection === "schedule-rounds" && activeSeasonData ? (
      <>{activeSeasonData.season_name}</>
    ) : activeSection === "enter-results" && activeSeasonData ? (
      <>{activeSeasonData.season_name}</>
    ) : activeSection === "rules-and-regulations" && activeSeasonData ? (
      <>{activeSeasonData.season_name}</>
    ) : (
      <>Coming Soon</>
    );

  const handlePendingNavigation = (
    action: () => void,
    options?: {
      onCancel?: () => void;
    },
  ) => {
    const isGuardedSection =
      activeSection === "league-settings" || activeSection === "participant-roles" || activeSection === "season-settings";

    if (!isGuardedSection || !hasUnsavedChanges) {
      action();
      return;
    }

    openModal(
      <UnsavedChanges
        onDiscard={() => {
          setHasUnsavedChanges(false);
          closePanel();
          action();
        }}
        onCancel={() => {
          closePanel();
          options?.onCancel?.();
        }}
      />,
    );
  };

  const handleGoBack = () => {
    handlePendingNavigation(() => {
      navigate(`/league/${leagueId}`);
    });
  }

  const handleSectionChange = (section: ManageMenuSection) => {
    if (section === activeSection) {
      if (!isLargeScreen) {
        setOpenManageMenu(false);
      }

      return;
    }

    handlePendingNavigation(() => {
      setActiveSection(section);
    });
  };

  return (
    <Wrapper>
      <SubNavbar name={currentLeague?.league_name ?? "League"} onBack={handleGoBack} />
      <ContentContainer>
        <Content>
          {isLargeScreen ? (
            <ManageMenuWrapper>
              <ManageMenu
                activeSection={activeSection}
                onSectionChange={handleSectionChange}
                seasonOptions={seasonOptions}
                selectedSeason={activeSeasonId}
                onSeasonChange={setSelectedSeason}
              />
            </ManageMenuWrapper>
          ) : (
            <Button
              color="primary"
              variant="outlined"
              size="medium"
              onClick={() => setOpenManageMenu(true)}
              icon={{ left: <ManageIcon />, right: <DropdownIcon /> }}
            >
              Manage League
            </Button>
          )}
          {!isLargeScreen && openManageMenu && (
            <ManageMenuMobileWrapper>
              <ManageMenu
                activeSection={activeSection}
                onSectionChange={(section) => {
                  if (section === activeSection) {
                    setOpenManageMenu(false);
                    return;
                  }

                  handlePendingNavigation(
                    () => {
                      setActiveSection(section);
                      setOpenManageMenu(false);
                    },
                    {
                      onCancel: () => {
                        setOpenManageMenu(false);
                      },
                    },
                  );
                }}
                seasonOptions={seasonOptions}
                selectedSeason={activeSeasonId}
                onSeasonChange={setSelectedSeason}
              />
            </ManageMenuMobileWrapper>
          )}
          {activeSheet}
        </Content>
      </ContentContainer>
    </Wrapper>
  );
};

export default LeagueManagment;
