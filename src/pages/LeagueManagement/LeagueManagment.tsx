import { useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import ManageIcon from "@assets/Icon/Manage.svg?react";
import DropdownIcon from "@assets/Icon/Dropdown.svg?react";
import SubNavbar from "@/components/Structures/SubNavbar/SubNavbar";
import ManageMenu, {
  type ManageMenuSection,
} from "@/components/Structures/ManageMenu/ManageMenu";
import Button from "@/components/Button/Button";
import { Content, ContentContainer, ManageMenuMobileWrapper, Wrapper } from "./LeagueManagment.styles";

//TODO: Replace panelContent with SheetForms for each section once they are developed, and implement logic to fetch and display actual data for each section.

const panelContent: Record<
  ManageMenuSection,
  { title: string; description: string }
> = {
  "participant-roles": {
    title: "Participant Roles",
    description:
      "Hi there. This panel will become the participant roles management component.",
  },
  "league-settings": {
    title: "League Settings",
    description:
      "Hi there. This panel will become the league settings component.",
  },
  "season-settings": {
    title: "Season Settings",
    description:
      "Hi there. This panel will become the season settings component.",
  },
  "overview-page": {
    title: "Overview Page",
    description:
      "Hi there. This panel will become the overview page editor component.",
  },
  "driver-assignments": {
    title: "Driver Assignments",
    description:
      "Hi there. This panel will become the driver assignments component.",
  },
  "schedule-rounds": {
    title: "Schedule Rounds",
    description:
      "Hi there. This panel will become the schedule rounds component.",
  },
  "enter-results": {
    title: "Enter Results",
    description:
      "Hi there. This panel will become the results entry component.",
  },
  "rules-and-regulations": {
    title: "Rules & Regulations",
    description:
      "Hi there. This panel will become the rules management component.",
  },
};

const LeagueManagment = () => {
  const [activeSection, setActiveSection] =
    useState<ManageMenuSection>("participant-roles");
  const activePanel = panelContent[activeSection];
  const [openManageMenu, setOpenManageMenu] = useState(false);
  const isLargeScreen = useMediaQuery("(min-width: 920px)");

  useLockBodyScroll(openManageMenu && !isLargeScreen);

  return (
    <Wrapper>
      <SubNavbar name="Name of League" />
      <ContentContainer>
        <Content>
          {isLargeScreen ? (
            <ManageMenu
              activeSection={activeSection}
              onSectionChange={setActiveSection}
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
                  setActiveSection(section);
                  setOpenManageMenu(false);
                }}
              />
            </ManageMenuMobileWrapper>
          )}
          <div
            id={`manage-panel-${activeSection}`}
            role="tabpanel"
            aria-labelledby={`manage-tab-${activeSection}`}
            style={{ flex: 1, width: "100%", color: "#fff" }}
          >
            <h2>{activePanel.title}</h2>
            <p>{activePanel.description}</p>
          </div>
        </Content>
      </ContentContainer>
    </Wrapper>
  );
};

export default LeagueManagment;
