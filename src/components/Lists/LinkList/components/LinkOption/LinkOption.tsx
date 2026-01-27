import Icon from "@/components/Icon/Icon";
import {
  Option,
  OptionHelper,
  OptionTextContainer,
  OptionTitle,
} from "./LinkOption.styles";

//TODO: Complete account option type rendering

type LinkOptionProps = {
  optionType: "text" | "account";
  optionTitle: string;
  optionHelper?: string;
  optionIcon: React.ReactNode;
  optionIconLabel: string;
  onOptionClick: () => void;
};

const LinkOption = ({
  optionType,
  optionTitle,
  optionHelper,
  optionIcon,
  optionIconLabel,
  onOptionClick,
}: LinkOptionProps) => {
  return (
    <Option onClick={onOptionClick}>
      {optionType === "text" ? (
        <>
          <OptionTextContainer>
            <OptionTitle>{optionTitle}</OptionTitle>
            <OptionHelper>{optionHelper}</OptionHelper>
          </OptionTextContainer>
          <Icon ariaLabel={optionIconLabel}>
            {optionIcon}
          </Icon>
        </>
      ) : (
        <></>
      )}
    </Option>
  );
};

export default LinkOption;
