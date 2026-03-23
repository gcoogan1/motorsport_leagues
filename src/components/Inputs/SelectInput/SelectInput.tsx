import { useId } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Select, {
  components,
  type DropdownIndicatorProps,
  type OptionProps,
} from "react-select";
import Error_Outlined from "@assets/Icon/Error_Outlined.svg?react";
import DropdownIcon from "@assets/Icon/Dropdown.svg?react";
import CheckIcon from "@assets/Icon/Check.svg?react";
import {
  ErrorText,
  HelperText,
  InputWrapper,
  Label,
  LabelRow,
  OptionContent,
  OptionLabel,
  OptionMeta,
  OptionRow,
  SelectMenuGlobalStyles,
} from "./SelectInput.styles";
import Icon from "@/components/Icon/Icon";

export type SelectInputOption = {
  value: string;
  label: string;
  secondaryInfo?: string;
  isDisabled?: boolean;
};

type SelectInputProps = {
  name: string;
  label: string;
  options: SelectInputOption[];
  placeholder?: string;
  helperText?: string;
  hasError?: boolean;
  errorMessage?: string;
  noOptionsMessage?: string;
  isDisabled?: boolean;
  isClearable?: boolean;
};

const DropdownIndicator = (
  props: DropdownIndicatorProps<SelectInputOption, false>,
) => {
  return (
    <components.DropdownIndicator {...props}>
      <DropdownIcon width={18} height={18} />
    </components.DropdownIndicator>
  );
};

const Option = (props: OptionProps<SelectInputOption, false>) => {
  const { children, innerRef, innerProps, isFocused, isSelected, data } = props;
  return (
    <components.Option {...props}>
      {/* REQUIRED: innerRef and innerProps enable keyboard and mouse interaction */}
      <OptionRow 
        ref={innerRef} 
        {...innerProps} 
        $isFocused={isFocused} 
        $isSelected={isSelected}
      >
        <OptionContent>
          <OptionLabel>{children}</OptionLabel>
          {data.secondaryInfo && (
            <OptionMeta>{data.secondaryInfo}</OptionMeta>
          )}
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

const SelectInput = ({
  name,
  label,
  options,
  placeholder = "Select option...",
  helperText,
  hasError,
  errorMessage,
  noOptionsMessage = "No options found.",
  isDisabled = false,
  isClearable = false,
}: SelectInputProps) => {
  const inputId = useId();
  const { control } = useFormContext();

  const handleWrapperKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field, fieldState }) => {
        const resolvedHasError = Boolean(hasError || fieldState.error);
        const resolvedErrorMessage = errorMessage ?? fieldState.error?.message;
        const selectedOption =
          options.find((option) => option.value === field.value) ?? null;

        return (
          <InputWrapper
            $hasValue={!!selectedOption}
            onKeyDown={handleWrapperKeyDown}
          >
            <SelectMenuGlobalStyles />
            <LabelRow>
              <Label htmlFor={inputId}>{label}</Label>
            </LabelRow>

            <Select<SelectInputOption, false>
              unstyled
              inputId={inputId}
              ref={field.ref}
              classNamePrefix="select"
              value={selectedOption}
              options={options}
              placeholder={placeholder}
              openMenuOnFocus
              openMenuOnClick
              tabSelectsValue={false}
              isSearchable={false}
              isDisabled={isDisabled}
              isClearable={isClearable}
              onBlur={field.onBlur}
              onChange={(option) => field.onChange(option?.value ?? "")}
              noOptionsMessage={() => noOptionsMessage}
              components={{
                DropdownIndicator,
                IndicatorSeparator: () => null,
                Option,
              }}
  
            classNames={{
                control: () => (resolvedHasError ? "select__control--has-error" : ""), // Add error class to control when there's an error
              }}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
              menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
              menuPosition="fixed"
            />

            {helperText && !resolvedHasError && <HelperText>{helperText}</HelperText>}
            {resolvedHasError && (
              <ErrorText>
                <Error_Outlined width={18} height={18} />
                {resolvedErrorMessage}
              </ErrorText>
            )}
          </InputWrapper>
        );
      }}
    />
  );
};

export default SelectInput;
