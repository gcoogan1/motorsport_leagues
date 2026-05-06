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
  seasonOptions: SelectButtonOption[];
  selectedSeason: string;
  onSeasonChange: (seasonId: string) => void;
};

const ManageMenu = ({
  activeSection,
  onSectionChange,
  seasonOptions,
  selectedSeason,
  onSeasonChange,
}: ManageMenuProps) => {

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
              onChange={onSeasonChange}
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
