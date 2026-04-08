import { useState } from "react";
import Select, {
  components,
  type DropdownIndicatorProps,
  type OptionProps,
} from "react-select";
import DropdownIcon from "@assets/Icon/Dropdown.svg?react";
import CheckIcon from "@assets/Icon/Check.svg?react";
import Icon from "@/components/Icon/Icon";
import { OptionContent, OptionLabel, OptionMeta, OptionRow, SelectButtonWrapper, SelectMenuGlobalStyles } from "./SelectButton.styles";

export type SelectButtonOption = {
  value: string;
  label: string;
  secondaryInfo?: string;
  isDisabled?: boolean;
};

type SelectButtonProps = {
  label?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onClick?: () => void;
  options: SelectButtonOption[];
  isDisabled?: boolean;
  noOptionsMessage?: string;
};

const DropdownIndicator = (
  props: DropdownIndicatorProps<SelectButtonOption, false>,
) => {
  return (
    <components.DropdownIndicator {...props}>
      <DropdownIcon width={18} height={18} />
    </components.DropdownIndicator>
  );
};

const Option = (props: OptionProps<SelectButtonOption, false>) => {
  const { children, innerRef, innerProps, isFocused, isSelected, data } = props;

  return (
    <components.Option {...props}>
      <OptionRow
        ref={innerRef}
        {...innerProps}
        $isFocused={isFocused}
        $isSelected={isSelected}
      >
        <OptionContent>
          <OptionLabel>{children}</OptionLabel>
          {data.secondaryInfo && <OptionMeta>{data.secondaryInfo}</OptionMeta>}
        </OptionContent>
        {isSelected && (
          <Icon size="small">
            <CheckIcon />
          </Icon>
        )}
      </OptionRow>
    </components.Option>
  );
};

function SelectButton({
  label = "Select option...",
  value,
  defaultValue,
  onChange,
  onClick,
  options,
  isDisabled = false,
  noOptionsMessage = "No options found.",
}: SelectButtonProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");

  const selectedValue = value ?? internalValue;
  const selectedOption = options.find((option) => option.value === selectedValue) ?? null;

  const handleChange = (option: SelectButtonOption | null) => {
    const nextValue = option?.value ?? "";

    if (value === undefined) {
      setInternalValue(nextValue);
    }

    onChange?.(nextValue);
  };

  return (
    <SelectButtonWrapper>
      <SelectMenuGlobalStyles />
      <Select<SelectButtonOption, false>
        unstyled
        classNamePrefix="select"
        value={selectedOption}
        options={options}
        placeholder={label}
        openMenuOnFocus
        openMenuOnClick
        tabSelectsValue={false}
        isSearchable={false}
        isDisabled={isDisabled}
        onMenuOpen={onClick}
        onChange={handleChange}
        noOptionsMessage={() => noOptionsMessage}
        components={{
          DropdownIndicator,
          IndicatorSeparator: () => null,
          Option,
        }}
        styles={{
          control: (base) => ({
            ...base,
            boxShadow: "none",
          }),
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        }}
        menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
        menuPosition="fixed"
      />
    </SelectButtonWrapper>
  )
}

export default SelectButton