import * as Select from "@radix-ui/react-select";
import { useController, useFormContext } from "react-hook-form";
import type { BannerImageValue } from "@/types/squad.types";
import MenuDropdown from "@/components/Dropdowns/MenuDropdown/MenuDropdown";
import Icon from "@/components/Icon/Icon";
import DropdownIcon from "@assets/Icon/Dropdown.svg?react";
import Error_Outlined from "@assets/Icon/Error_Outlined.svg?react";
import {
  FieldLabel,
  InputWrapper,
  LabelRow,
  InputContainer,
  StyledTrigger,
  PlaceholderWrapper,
  IconWrapper,
  StyledContent,
  HelperText,
  ErrorText,
  SquadText,
  PlaceholderText,
} from "./SquadSelectInput.styles";
import Banner from "@/components/Banner/Banner";

type Squad = {
  label: string;
  value: string;
  banner: BannerImageValue | "none";
};

type SquadSelectInputProps = {
  name: string;
  fieldLabel: string;
  squads: Squad[];
  helperText?: string;
  placeholder?: string;
  hasError?: boolean;
  errorMessage?: string;
};

const SquadSelectInput = ({
  name,
  fieldLabel,
  helperText,
  placeholder,
  hasError,
  errorMessage,
  squads,
}: SquadSelectInputProps) => {
  const { control } = useFormContext();

  // Use useController for the most direct link to RHF state
  const { field } = useController({
    name,
    control,
    defaultValue: "",
  });

  const selectedSquad = squads?.find((s) => s.value === field.value);

  // Prep options for the dropdown
  const dropdownOptions = squads?.map((squad) => ({
    ...squad,
    isSelected: squad.value === field.value,
  }));

  return (
    <InputWrapper>
      <LabelRow>
        <FieldLabel>{fieldLabel}</FieldLabel>
      </LabelRow>

      <Select.Root
        key={field.value}
        value={field.value}
        onValueChange={(val) => {
          field.onChange(val); // Updates RHF
        }}
      >
        <InputContainer>
          <StyledTrigger $hasError={hasError}>
            <PlaceholderWrapper>
              {selectedSquad ? (
                <>
                  <Banner banner={selectedSquad.banner} />
                  <SquadText>{selectedSquad.label}</SquadText>
                </>
              ) : (
                <>
                  <PlaceholderText>
                    {placeholder || "Select squad..."}
                  </PlaceholderText>
                </>
              )}
            </PlaceholderWrapper>
          </StyledTrigger>
          <IconWrapper isSelected={!!selectedSquad}>
            <Icon size="small" >
              <DropdownIcon />
            </Icon>
          </IconWrapper>
        </InputContainer>

        <Select.Portal>
          <StyledContent position="popper" sideOffset={8}>
            {/* IMPORTANT: MenuDropdown MUST use Select.Item internally */}
            <MenuDropdown type="squad" options={dropdownOptions} />
          </StyledContent>
        </Select.Portal>
      </Select.Root>

      {helperText && <HelperText>{helperText}</HelperText>}
      {!!hasError && (
        <ErrorText>
          <Error_Outlined width={18} height={18} /> {errorMessage}
        </ErrorText>
      )}
    </InputWrapper>
  );
};

export default SquadSelectInput;
