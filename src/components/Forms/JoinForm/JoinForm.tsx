import type { FormEventHandler } from "react";
import ProfileSelectInput from "@/components/Inputs/ProfileSelectInput/ProfileSelectInput";
import TextInput from "@/components/Inputs/TextInput/TextInput";
import Error_Outlined from "@assets/Icon/Error_Outlined.svg?react";
import Button from "@/components/Button/Button";
import {
  FormWrapper,
  FormHeader,
  HeaderTitle,
  HeaderSubtitle,
  FormInputs,
  OptionsContainer,
  ErrorText,
} from "./JoinForm.styles";
import CheckboxItem from "@/components/Inputs/CheckboxItem/CheckboxItem";

export type CheckboxOption = {
  id?: string;
  name?: string;
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  helperMessage?: string;
  onChange?: (checked: boolean) => void;
};

export type JoinProfileOption = {
  label: string;
  value: string;
  secondaryInfo?: string;
  avatar: {
    avatarType: "preset" | "upload";
    avatarValue: string;
  };
};

type JoinFormProps = {
  options: CheckboxOption[];
  profiles: JoinProfileOption[];
  optionValues?: Record<string, boolean>;
  optionsError?: string;
  profileError?: string;
  contactInfoError?: string;
  onOptionChange: (
    optionKey: string,
    checked: boolean,
    option: CheckboxOption,
  ) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  submitLabel?: string;
};

const JoinForm = ({
  options,
  profiles,
  optionValues = {},
  optionsError,
  profileError,
  contactInfoError,
  onOptionChange,
  onSubmit,
  submitLabel = "Request To Join",
}: JoinFormProps) => {
  return (
    <FormWrapper onSubmit={onSubmit}>
      <FormHeader>
        <HeaderTitle>Join Form</HeaderTitle>
        <HeaderSubtitle>Please fill out the form below</HeaderSubtitle>
      </FormHeader>
      <FormInputs>
        <OptionsContainer>
          {options.map((option, index) => {
            const optionKey = option.name ?? option.id ?? `option_${index}`;

            return (
              <CheckboxItem
                key={optionKey}
                name={optionKey}
                label={option.label}
                checked={optionValues[optionKey] ?? option.defaultChecked ?? option.checked ?? false}
                defaultChecked={option.defaultChecked}
                helperMessage={option.helperMessage}
                onChange={(checked) => onOptionChange(optionKey, checked, option)}
              />
            );
          })}

          {optionsError && (
            <ErrorText><Error_Outlined width={18} height={18} /> {optionsError}</ErrorText>
          )}
        </OptionsContainer>

        <ProfileSelectInput
          name="profile_joining"
          type="profile"
          fieldLabel="Select Your Profile"
          isLarge
          profiles={profiles}
          hasError={!!profileError}
          errorMessage={profileError}
        />

        <TextInput
          name="contactInfo"
          label="Contact Information"
          placeholder="Discord, Email, etc."
          helperText="Enter a way to be contacted by the League Director(s)."
          showCounter
          maxLength={64}
          hasError={!!contactInfoError}
          errorMessage={contactInfoError}
        />

        <Button color="primary" fullWidth type="submit">{submitLabel}</Button>
      </FormInputs>
    </FormWrapper>
  );
};

export default JoinForm;
