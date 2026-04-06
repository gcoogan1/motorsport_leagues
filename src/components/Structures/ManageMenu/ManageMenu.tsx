import { useState } from "react";
import ManageMenuLink from "./ManageMenuLink/ManageMenuLink";
import SelectButton, { type SelectButtonOption } from "@/components/SelectButton/SelectButton";
import {
  Header,
  HeaderTitle,
  Links,
  ManageMenuContainer,
  Season,
  SectionContainer,
  SelectContainer,
} from "./ManageMenu.styles";
import { generalLinks, seasonLinks } from "./ManageMenu.constants";

// TODO: Replace seasonOptions with actual season data once available, and implement season selection logic to update the menu based on the selected season.

export type ManageMenuSection =
  | "participant-roles"
  | "league-settings"
  | "season-settings"
  | "overview-page"
  | "driver-assignments"
  | "schedule-rounds"
  | "enter-results"
  | "rules-and-regulations";

  
type ManageMenuProps = {
  activeSection: ManageMenuSection;
  onSectionChange: (section: ManageMenuSection) => void;
};


const seasonOptions: SelectButtonOption[] = [
  {
    value: "season-1",
    label: "Season 1",
  },
  {
    value: "season-2",
    label: "Season 2",
  },
  {
    value: "season-3",
    label: "Season 3",
  },
];

const ManageMenu = ({ activeSection, onSectionChange }: ManageMenuProps) => {
  const [selectedSeason, setSelectedSeason] = useState("");

  return (
    <ManageMenuContainer>
      <Header>
        <HeaderTitle>Manage League</HeaderTitle>
      </Header>
      <SectionContainer>
        <Links role="tablist" aria-label="League management sections">
          {generalLinks.map((link) => (
            <ManageMenuLink
              key={link.id}
              id={`manage-tab-${link.id}`}
              controlsId={`manage-panel-${link.id}`}
              label={link.label}
              icon={link.icon}
              isSelected={activeSection === link.id}
              onClick={() => onSectionChange(link.id)}
            />
          ))}
        </Links>
        <Season>
          <SelectContainer>
            <SelectButton
              label="Season Name"
              options={seasonOptions}
              value={selectedSeason}
              onChange={setSelectedSeason}
            />
          </SelectContainer>
          <Links role="tablist" aria-label="Season management sections">
            {seasonLinks.map((link) => (
              <ManageMenuLink
                key={link.id}
                id={`manage-tab-${link.id}`}
                controlsId={`manage-panel-${link.id}`}
                label={link.label}
                icon={link.icon}
                isSelected={activeSection === link.id}
                onClick={() => onSectionChange(link.id)}
              />
            ))}
          </Links>
        </Season>
      </SectionContainer>
    </ManageMenuContainer>
  );
};

export default ManageMenu;
