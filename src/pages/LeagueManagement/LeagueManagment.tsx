import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import type { AppDispatch, RootState } from "@/store";
import { getLeagueByIdThunk } from "@/store/leagues/league.thunk";
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
  Wrapper,
} from "./LeagueManagment.styles";
import Settings from "@/features/leagues/forms/Edit/Settings/Settings";
import SheetForm from "@/components/Sheets/SheetForm/SheetForm";
import SegmentedTab from "@/components/Tabs/SegmentedTabs/SegmentedTab";
import FilterBar from "@/components/Tabs/FilterBar/FilterBar";
import { navigate } from "@/app/navigation/navigation";
import { useAppTheme } from "@/providers/theme/useTheme";
import { useModal } from "@/providers/modal/useModal";
import UnsavedChanges from "@/features/leagues/modals/errors/UnsavedChanges/UnsavedChanges";

//TODO: Replace panelContent with SheetForms for each section once they are developed, and implement logic to fetch and display actual data for each section.

const LeagueManagment = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { openModal } = useModal();
  const { setOverrideThemeName, clearOverrideThemeName } = useAppTheme();
  const { leagueId } = useParams<{ leagueId: string }>();
  const [activeSection, setActiveSection] =
    useState<ManageMenuSection>("participant-roles");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  // const activePanel = panelContent[activeSection];
  const [openManageMenu, setOpenManageMenu] = useState(false);
  const isLargeScreen = useMediaQuery("(min-width: 920px)");
  const currentLeague = useSelector(
    (state: RootState) => state.league.currentLeague,
  );

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
    ) : (
      <SheetForm
        id={`manage-panel-${activeSection}`}
        seasonName="Season Name"
        header="Sheet Header"
        blockHeader="Setting Block Header"
        blockDescription="Copy Below the header."
        headerChildren={<div style={{ height: "300px" }}>Additional header content</div>}
        tabs={
          <div>
            <SegmentedTab
              tabs={[{ label: "Teams" }, { label: "Drivers" }]}
              activeTab={"teams"}
              onChange={() => {}}
            />
          </div>
        }
        filters={
          <FilterBar
            divisions={[{ label: "Division I", value: "division_1" }]}
            rounds={[{ label: "Round 1", value: "round_1" }]}
            events={[{ label: "Event A", value: "event_1" }]}
            sessions={[{ label: "Qualifying Session", value: "session_1" }]}
          />
        }
        details={{
          title: "Details",
          information: "Detailed information about the league.",
        }}
        listChildren={<div>List content</div>}
        onSave={() => console.log("Save changes")}
      />
    );

  const handlePendingNavigation = (action: () => void) => {
    if (activeSection !== "league-settings" || !hasUnsavedChanges) {
      action();
      return;
    }

    openModal(
      <UnsavedChanges
        onDiscard={() => {
          setHasUnsavedChanges(false);
          action();
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
            <ManageMenu
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
            />
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
                  handlePendingNavigation(() => {
                    setActiveSection(section);
                    setOpenManageMenu(false);
                  });
                }}
              />
            </ManageMenuMobileWrapper>
          )}
          {/* <div
            id={`manage-panel-${activeSection}`}
            role="tabpanel"
            aria-labelledby={`manage-tab-${activeSection}`}
            style={{ flex: 1, width: "100%", color: "#fff" }}
          >
            <h2>{activePanel.title}</h2>
            <p>{activePanel.description}</p>
          </div> */}
          {activeSheet}
        </Content>
      </ContentContainer>
    </Wrapper>
  );
};

export default LeagueManagment;
