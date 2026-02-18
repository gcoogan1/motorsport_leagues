import * as Select from "@radix-ui/react-select";
import DropdownIcon from "@assets/Icon/Dropdown.svg?react";
import Error_Outlined from "@assets/Icon/Error_Outlined.svg?react";
import {
  ErrorText,
  FieldLabel,
  HelperText,
  IconWrapper,
  InputContainer,
  InputWrapper,
  LabelRow,
  PlaceholderText,
  PlaceholderWrapper,
  StyledContent,
  StyledTrigger,
} from "./ProfileSelectInput.styes";
import Icon from "@/components/Icon/Icon";
import Avatar from "@/components/Avatar/Avatar";
import { useController, useFormContext } from "react-hook-form";
import MenuDropdown from "@/components/Dropdowns/MenuDropdown/MenuDropdown";
import UserProfile from "@/components/Users/Profile/UserProfile";

type Profile = {
  label: string;
  value: string;
  secondaryInfo?: string;
  avatar: { avatarType: "preset" | "upload"; avatarValue: string; };
};

type ProfileSelectInputProps = {
  name: string;
  fieldLabel: string;
  type: "profile" | "driver";
  isLarge?: boolean;
  helperText?: string;
  placeholder?: string;
  hasError?: boolean;
  errorMessage?: string;
  profiles?: Profile[];
};

const ProfileSelectInput = ({
  name,
  fieldLabel,
  type = "profile",
  isLarge = false,
  helperText,
  hasError,
  errorMessage,
  profiles = [],
  placeholder = "Select profile...",
}: ProfileSelectInputProps) => {
  const { control } = useFormContext();
  
  // Use useController for the most direct link to RHF state
  const { field } = useController({
    name,
    control,
    defaultValue: "",
  });

  const selectedProfile = profiles.find((p) => p.value === field.value);
  const avatarSize = type === "profile" ? "medium" : "tiny";

  // Prep options for the dropdown
  const dropdownOptions = profiles.map((profile) => ({
    ...profile,
    isSelected: profile.value === field.value,
  }));

  return (
    <InputWrapper>
      <LabelRow>
        <FieldLabel>{fieldLabel}</FieldLabel>
      </LabelRow>

      {/* The 'key' prop is a crucial workaround: it forces Radix to re-sync 
          whenever the underlying RHF value changes. */}
      <Select.Root
        key={field.value} 
        value={field.value}
        onValueChange={(val) => {
          field.onChange(val); // Updates RHF
        }}
      >
        <InputContainer>
          <StyledTrigger $hasError={hasError}>
            <PlaceholderWrapper $isLarge={isLarge}>
              {selectedProfile ? (
                <UserProfile
                  size={"medium"}
                  username={selectedProfile.label}
                  avatarType={selectedProfile.avatar.avatarType}
                  avatarValue={selectedProfile.avatar.avatarValue}
                  information={selectedProfile.secondaryInfo}
                />
              ) : (
                <>
                  <Avatar size={avatarSize} avatarType="preset" avatarValue="none" />
                  <PlaceholderText>{placeholder}</PlaceholderText>
                </>
              )}
            </PlaceholderWrapper>
          </StyledTrigger>
          <IconWrapper>
            <Icon size="small">
              <DropdownIcon />
            </Icon>
          </IconWrapper>
        </InputContainer>

        <Select.Portal>
          <StyledContent position="popper" sideOffset={8}>
            {/* IMPORTANT: MenuDropdown MUST use Select.Item internally */}
            <MenuDropdown type={type} options={dropdownOptions} />
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

export default ProfileSelectInput;
