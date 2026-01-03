import Icon from "@/components/Icon/Icon";
import { Option, OptionHelper, OptionTextContainer, OptionTitle } from "./LinkOption.styles";

//TODO: Complete profile option type rendering

type LinkOptionProps = {
  optionType: "text" | "profile";
  optionTitle: string;
  optionHelper: string;
  optionIcon: React.ReactNode;
  optionIconLabel: string;
  onOptionClick: () => void;
}

const LinkOption = ({ optionType, optionTitle, optionHelper, optionIcon, optionIconLabel, onOptionClick }: LinkOptionProps) => {
  return (
    <Option>
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
    </Option>
  )
}

export default LinkOption