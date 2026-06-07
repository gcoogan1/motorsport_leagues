import { useEffect, useId, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Select, {
  components,
  type DropdownIndicatorProps,
  type OptionProps,
  type SelectInstance,
  type ValueContainerProps,
} from "react-select";
import Error_Outlined from "@assets/Icon/Error_Outlined.svg?react";
import DropdownIcon from "@assets/Icon/Dropdown.svg?react";
import Checkbox from "@/components/Inputs/Checkbox/Checkbox";
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
} from "./CheckboxMultiSelectInput.styles";
import type { SelectInputOption } from "@/components/Inputs/SelectInput/SelectInput";

type CheckboxMultiSelectInputProps = {
  name: string;
  label?: string;
  options: SelectInputOption[];
  placeholder?: string;
  helperText?: string;
  hasError?: boolean;
  errorMessage?: string;
  noOptionsMessage?: string;
  isDisabled?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
  blurInputOnSelect?: boolean;
  openMenuOnFocus?: boolean;
  onValueChange?: (values: string[]) => void;
};

const DropdownIndicator = (
  props: DropdownIndicatorProps<SelectInputOption, true>,
) => {
  return (
    <components.DropdownIndicator {...props}>
      <DropdownIcon width={18} height={18} />
    </components.DropdownIndicator>
  );
};

const Option = (props: OptionProps<SelectInputOption, true>) => {
  const { children, innerRef, innerProps, isFocused, isSelected, data, selectOption } = props;

  return (
    <components.Option {...props}>
      <OptionRow
        ref={innerRef}
        {...innerProps}
        $isFocused={isFocused}
        $isSelected={isSelected}
      >
        <Checkbox
          label=""
          checked={isSelected}
          onChange={() => selectOption(data)}
        />
        <OptionContent>
          <OptionLabel>{children}</OptionLabel>
          {data.secondaryInfo && <OptionMeta>{data.secondaryInfo}</OptionMeta>}
        </OptionContent>
      </OptionRow>
    </components.Option>
  );
};

const ValueContainer = (
  props: ValueContainerProps<SelectInputOption, true>,
) => {
  const selected = props.getValue();
  const selectedLabels = selected.map((option) => option.label).join(", ");

  return (
    <components.ValueContainer {...props}>
      {selected.length > 0 ? (
        <span
          title={selectedLabels}
          style={{
            display: "block",
            width: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {selectedLabels}
        </span>
      ) : (
        props.children
      )}
    </components.ValueContainer>
  );
};

const CheckboxMultiSelectInput = ({
  name,
  label,
  options,
  placeholder = "Select options...",
  helperText,
  hasError,
  errorMessage,
  noOptionsMessage = "No options found.",
  isDisabled = false,
  isClearable = false,
  isSearchable = false,
  blurInputOnSelect = false,
  openMenuOnFocus = true,
  onValueChange,
}: CheckboxMultiSelectInputProps) => {
  const inputId = useId();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const selectRef = useRef<SelectInstance<SelectInputOption, true> | null>(null);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const { control } = useFormContext();

  useEffect(() => {
    if (!menuIsOpen) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickInWrapper = wrapperRef.current?.contains(target);
      const clickInMenuPortal =
        target instanceof Element &&
        Boolean(target.closest(".select__menu"));

      if (!clickInWrapper && !clickInMenuPortal) {
        setMenuIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [menuIsOpen]);

  const handleWrapperKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  };

  const handleWrapperMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isDisabled) {
      return;
    }

    const target = event.target as HTMLElement;
    if (target.closest(".select__menu")) {
      return;
    }

    setMenuIsOpen(true);
    selectRef.current?.focus();
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={[]}
      render={({ field, fieldState }) => {
        const resolvedHasError = Boolean(hasError || fieldState.error);
        const resolvedErrorMessage = errorMessage ?? fieldState.error?.message;
        const selectedOptions = options.filter((option) =>
          (field.value ?? []).includes(option.value),
        );

        return (
          <InputWrapper
            ref={wrapperRef}
            $hasValue={selectedOptions.length > 0}
            onKeyDown={handleWrapperKeyDown}
            onMouseDown={handleWrapperMouseDown}
          >
            <SelectMenuGlobalStyles />
            <LabelRow>
              {label && <Label htmlFor={inputId}>{label}</Label>}
            </LabelRow>

            <Select<SelectInputOption, true>
              unstyled
              isMulti
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              inputId={inputId}
              ref={(instance) => {
                selectRef.current = instance;
                field.ref(instance);
              }}
              classNamePrefix="select"
              value={selectedOptions}
              menuIsOpen={menuIsOpen}
              options={options}
              placeholder={placeholder}
              openMenuOnFocus={openMenuOnFocus}
              openMenuOnClick
              onMenuOpen={() => setMenuIsOpen(true)}
              onMenuClose={() => setMenuIsOpen(false)}
              tabSelectsValue={false}
              isSearchable={isSearchable}
              isDisabled={isDisabled}
              isClearable={isClearable}
              blurInputOnSelect={blurInputOnSelect}
              onBlur={field.onBlur}
              onChange={(nextOptions) => {
                const nextValues = (nextOptions ?? []).map((option) => option.value);
                field.onChange(nextValues);
                onValueChange?.(nextValues);
              }}
              noOptionsMessage={() => noOptionsMessage}
              components={{
                DropdownIndicator,
                IndicatorSeparator: () => null,
                Option,
                ValueContainer,
                MultiValue: () => null,
              }}
              classNames={{
                control: () => (resolvedHasError ? "select__control--has-error" : ""),
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

export default CheckboxMultiSelectInput;