import Icon from "@/components/Icon/Icon";
import Placeholder from "@assets/Graphics/Placeholder.svg?react";
import CheckCircle from "@assets/Icon/Check_Circle_Filled.svg?react";
import { designTokens } from "@/app/design/tokens";
import {
  HelperMessage,
  IconContainer,
  Label,
  SelectBoxContainer,
  SelectBoxContent,
  TextContent,
} from "./SelectBox.styles";

type SelectBoxProps = {
  label: string;
  helperMessage?: string;
  isSelected?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  isDisabled?: boolean;
};

const SelectBox = ({ label, helperMessage, isSelected, onClick, icon, isDisabled }: SelectBoxProps) => {
  return (
    <SelectBoxContainer type="button" $isSelected={isSelected} onClick={onClick} disabled={isDisabled}>
      <SelectBoxContent>
        <IconContainer>
          {icon ? icon : <Placeholder />}
        </IconContainer>
        <TextContent>
          <Label>{label}</Label>
          <HelperMessage>{helperMessage}</HelperMessage>
        </TextContent>
      </SelectBoxContent>
        {isSelected && (
          <IconContainer>
            <Icon>
              <CheckCircle color={designTokens.colors.text.text1} />
            </Icon>
          </IconContainer>
        )}
    </SelectBoxContainer>
  );
};

export default SelectBox;
