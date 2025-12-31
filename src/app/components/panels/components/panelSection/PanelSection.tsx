import PanelSectionOption from "./components/panelSectionOption/PanelSectionOption";
import { PanelSectionContainer, SectionList, SectionTitle } from "./PanelSection.styles";

type PanelOptions = {
  optionType: "text" | "profile";
  optionTitle: string;
  optionHelper: string;
  optionIcon: React.ReactNode;
  optionIconLabel: string;
  onOptionClick: () => void;
}

type PanelSectionProps = {
  sectionTitle?: string;
  options?: PanelOptions[];
};

const PanelSection = ({ sectionTitle, options }: PanelSectionProps) => {
  return (
    <PanelSectionContainer>
      {sectionTitle && <SectionTitle>{sectionTitle}</SectionTitle>}
      <SectionList>
        {options && options.map((option, index) => (
          <PanelSectionOption
            key={index}
            optionType={option.optionType}
            optionTitle={option.optionTitle}
            optionHelper={option.optionHelper}
            optionIcon={option.optionIcon}
            optionIconLabel={option.optionIconLabel}
            onOptionClick={option.onOptionClick}
          />
        ))}
      </SectionList>
    </PanelSectionContainer>
  )
}

export default PanelSection