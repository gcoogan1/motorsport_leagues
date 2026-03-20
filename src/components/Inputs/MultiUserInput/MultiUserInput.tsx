import { useId, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import Error_Outlined from "@assets/Icon/Error_Outlined.svg?react";
import { type MultiValue } from "react-select";
import {
  FieldWrapper,
  Label,
  HelperText,
  ErrorText,
  MultiSelectMenuGlobalStyles,
} from "./MultiUserInput.styles";
import {
  CustomMenuList,
  CustomMultiValue,
  CustomOption,
  CustomValueContainer,
} from "./MultiUserInput.renderers";
import type { Profile, SelectOption } from "./MultiUserInput.types";
import { isValidEmail, MAX_SELECTIONS } from "./MultiUserInput.utils";

type MultiUserInputProps = {
  profiles?: Profile[];
  name?: string;
  label?: string;
  helperText?: string;
  placeholder?: string;
};

const MultiUserInput = ({
  profiles,
  name = "multiUserInput",
  label,
  helperText,
  placeholder,
}: MultiUserInputProps) => {
  const inputId = useId(); // Generate a unique ID for the input field
  const { control } = useFormContext();
  const [inputValue, setInputValue] = useState("");

  // Transform the provided profiles into the format expected by react-select
  const options: SelectOption[] =
    profiles?.map((profile) => ({
      value: profile.username,
      label: profile.username,
      profileId: profile.id,
      accountId: profile.accountId,
      avatar: {
        avatarType: profile.avatarType,
        avatarValue: profile.avatarValue,
      },
      secondaryInfo: profile.game,
    })) ?? [];

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={[]}
      render={({ field: { onChange, value, ref }, fieldState: { error } }) => {
        // Determine if the current input value is a valid email and not already selected
        const selectedValues = (value as MultiValue<SelectOption>) ?? [];
        const isAtLimit = selectedValues.length >= MAX_SELECTIONS;
        const resolvedPlaceholder = placeholder ?? "";

        // Function to handle adding a new email option when the user presses Enter
        const addEmailOption = (rawEmail: string) => {
          const email = rawEmail.trim();
          if (!isValidEmail(email)) return;
          if (selectedValues.length >= MAX_SELECTIONS) return;

          const isDuplicate = selectedValues.some(
            (item) => item.value.toLowerCase() === email.toLowerCase(),
          );
          if (isDuplicate) return;

          const newOption: SelectOption = {
            value: email,
            label: email,
            isEmail: true,
          };

          onChange([...selectedValues, newOption]);
          setInputValue("");
        };

        return (
          <FieldWrapper>
            <MultiSelectMenuGlobalStyles />
            {label && <Label htmlFor={inputId}>{label}</Label>}
            <CreatableSelect<SelectOption, true>
              isMulti
              unstyled
              classNamePrefix="select" // This prefix is used in our styled-components for targeting
              ref={ref}
              inputId={inputId}
              value={value}
              inputValue={inputValue}
              onInputChange={(newValue, meta) => {
                // Update local input state to control the input value
                if (meta.action === "input-change") {
                  setInputValue(newValue);
                }

                return newValue;
              }}
              onKeyDown={(event) => {
                const isEnter = event.key === "Enter";
                const isTab = event.key === "Tab";
                if (!isEnter && !isTab) return;
                if (!inputValue.trim()) return;
                // Only intercept if input is a valid email — otherwise let
                // react-select handle Enter/Tab to select the focused dropdown option
                if (!isValidEmail(inputValue.trim())) return;

                event.preventDefault();
                addEmailOption(inputValue);
              }}
              onChange={(selected) => {
                // When the selection changes (either by selecting an existing option or creating a new one), we need to update the form state.
                const nextValue = (selected as MultiValue<SelectOption>) ?? [];
                
                // Filter out duplicates based on value (for emails/usernames) and profileId (for profiles)
                const uniqueValues = new Set<string>();
                const filteredValues = nextValue.filter((item) => {
                  // Use profileId as key if available, otherwise use value
                  const key = item.profileId ? `profile:${item.profileId}` : `value:${item.value.toLowerCase()}`;
                  if (uniqueValues.has(key)) {
                    return false; // Skip duplicate
                  }
                  uniqueValues.add(key);
                  return true;
                });
                
                onChange(filteredValues.slice(0, MAX_SELECTIONS));
                setInputValue("");
              }}
              options={options}
              isValidNewOption={() => false} // Disable the default "create new option" behavior since we're handling it manually
              noOptionsMessage={() =>
                isAtLimit ? `You can select up to ${MAX_SELECTIONS}.` : " "
              }
              // Custom function to create a new option when the user types an email and presses Enter
              getNewOptionData={(input): SelectOption => ({
                value: input,
                label: input,
                isEmail: true,
              })}
              // Disable options when the limit is reached, but allow already selected options to be deselected
              isOptionDisabled={(option, selected) =>
                selected.length >= MAX_SELECTIONS &&
                !selected.some((item) => item.value === option.value)
              }
              // Custom components to render options, selected values, and the menu list
              components={{
                Option: CustomOption,
                MultiValue: CustomMultiValue,
                MenuList: CustomMenuList,
                ValueContainer: CustomValueContainer,
                MultiValueRemove: () => null,
                ClearIndicator: () => null,
                DropdownIndicator: () => null,
              }}
              classNames={{
                control: () => (error ? "select__control--has-error" : ""), // Add error class to control when there's an error
              }}
              styles={{
                input: (base) => ({ // Hide caret while keeping input behavior
                  ...base,
                  caretColor: "transparent",
                }),
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
              placeholder={resolvedPlaceholder}
              hideSelectedOptions
              menuIsOpen={inputValue.length > 0}
              menuPortalTarget={document.body}
              menuPosition="fixed"
            />
            {helperText && !error && <HelperText>{helperText}</HelperText>}
            {error && (
              <ErrorText>
                <Error_Outlined width={18} height={18} />
                {error.message}
              </ErrorText>
            )}
          </FieldWrapper>
        );
      }}
    />
  );
};

export default MultiUserInput;
