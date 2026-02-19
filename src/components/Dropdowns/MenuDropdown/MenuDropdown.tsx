import * as Select from "@radix-ui/react-select";
import { DropdownContainer } from './MenuDropdown.styles'
import type { MenuTypes } from './MenuOption/MenuOption';
import MenuOption from './MenuOption/MenuOption';

//NOTE: This component is meant to be used as the content of a Radix Select.
//  It is not a standalone dropdown component. 
// The options prop should be passed in with the necessary data to render the dropdown items, 
// and the onSelect function should be handled by the parent component using Radix's Select.Item onSelect prop.

type Options = {
  label: string;
  value: string;
  secondaryInfo?: string;
  icon?: React.ReactNode;
  avatar?: {
    avatarType: "preset" | "upload";
    avatarValue: string;
  }
}

type MenuDropdownProps = {
  type: MenuTypes;
  options: Options[];
  onSelect?: (value: string) => void;
  isStandAlone?: boolean;
}

const MenuDropdown = ({ type, options, onSelect, isStandAlone }: MenuDropdownProps) => {

  // For text type in standalone mode, render plain buttons
  if (type === "text" && isStandAlone) {
    return (
      <DropdownContainer $isStandAlone={true}>
        {options.map((option) => (
          <MenuOption
            key={option.value}
            type={type}
            label={option.label}
            value={option.value}
            secondaryInfo={option.secondaryInfo}
            icon={option.icon}
            isStandAlone={true}
            onSelect={onSelect}
          />
        ))}
      </DropdownContainer>
    );
  }

  // Otherwise use Radix MenuOption
  return (
    <Select.Viewport asChild>
      <DropdownContainer>
        {options.map((option) => (
          <MenuOption
            key={option.value}
            type={type}
            label={option.label}
            value={option.value}
            secondaryInfo={option.secondaryInfo}
            icon={option.icon}
            avatar={option.avatar}
          />
        ))}
      </DropdownContainer>
    </Select.Viewport>
  )
}

export default MenuDropdown;
