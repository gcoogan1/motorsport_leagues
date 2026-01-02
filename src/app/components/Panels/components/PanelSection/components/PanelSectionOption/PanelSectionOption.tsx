import Icon from "@/components/Icon/Icon";
import { OptionHelper, OptionTextContainer, OptionTitle, SectionOption } from "./PanelSectionOption.styles";

//TODO: Complete profile option type rendering

type PanelSectionOptionProps = {
  optionType: "text" | "profile";
  optionTitle: string;
  optionHelper: string;
  optionIcon: React.ReactNode;
  optionIconLabel: string;
  onOptionClick: () => void;
}

const PanelSectionOption = ({ optionType, optionTitle, optionHelper, optionIcon, optionIconLabel, onOptionClick }: PanelSectionOptionProps) => {
  return (
    <SectionOption>
      {optionType === "text" ? (
        <>
          <OptionTextContainer>
        <OptionTitle>{optionTitle}</OptionTitle>
        <OptionHelper>{optionHelper}</OptionHelper>
      </OptionTextContainer>
      <Icon onClick={onOptionClick} ariaLabel={optionIconLabel}>
        {optionIcon}
      </Icon>
        </>
      ) : (
        <>
          
        </>
      )}
    </SectionOption>
  )
}

export default PanelSectionOption