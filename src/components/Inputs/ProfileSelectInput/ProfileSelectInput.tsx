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
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";
import MenuDropdown from "@/components/Dropdowns/MenuDropdown/MenuDropdown";
import UserProfile from "@/components/Users/Profile/UserProfile";

// MUST BE WRAPPED IN REACT-HOOK-FORM FORM PROVIDER
// Type Profile and isLarge should be used together to determine avatar size and layout in the dropdown options. "profile" type will use medium avatars and "driver" type will use tiny avatars.

type Profile = {
  label: string;
  value: string;
  secondaryInfo?: string;
  avatar: {
    avatarType: "preset" | "upload";
    avatarValue: string;
  };
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
  const { setValue, watch, register } = useFormContext();
  const selectedValue = watch(name);

  useEffect(() => {
    register(name);
  }, [register, name]);

  const selectedProfile = profiles.find((p) => p.value === selectedValue);
  const avatarSize = type === "profile" ? "medium" : "tiny";

  // Map profiles to match the Options type expected by MenuDropdown
  const dropdownOptions = profiles.map((profile) => ({
    ...profile,
    isSelected: profile.value === selectedValue,
  }));

  return (
    <InputWrapper>
      <LabelRow>
        <FieldLabel>{fieldLabel}</FieldLabel>
      </LabelRow>
      <Select.Root
        value={selectedValue || ""}
        onValueChange={(value) => setValue(name, value)}
      >
        <InputContainer>
          <StyledTrigger $hasError={hasError}>
            <PlaceholderWrapper $isLarge={isLarge}>
              {selectedProfile?.label ? (
                <UserProfile
                  size={"medium"}
                  username={selectedProfile.label}
                  avatarType={selectedProfile.avatar.avatarType}
                  avatarValue={selectedProfile.avatar.avatarValue}
                  information={selectedProfile.secondaryInfo}
                />
              ) : (
                <>
                  <Avatar
                    size={avatarSize}
                    avatarType={"preset"}
                    avatarValue={"none"}
                  />
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
