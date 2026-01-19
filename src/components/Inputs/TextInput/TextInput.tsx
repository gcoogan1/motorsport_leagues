import { useFormContext } from "react-hook-form";
import Error_Outlined from "@assets/Icon/Error_Outlined.svg?react";
import {
  Count,
  ErrorText,
  HelperText,
  IconWrapper,
  InputField,
  InputWrapper,
  Label,
  LabelRow,
} from "./TextInput.styles";

// MUST BE WRAPPED IN REACT-HOOK-FORM FORM PROVIDER

type TextInputProps = {
  name: string;
  label: string;
  icon?: React.ReactNode;
  placeholder?: string;
  maxLength?: number;
  showCounter?: boolean;
  helperText?: string;
  hasError?: boolean;
  errorMessage?: string;
};

const TextInput = ({
  name,
  label,
  icon,
  placeholder,
  maxLength = 1000,
  showCounter,
  helperText,
  hasError,
  errorMessage,
}: TextInputProps) => {
  const { register, watch } = useFormContext();

  const value = watch(name);
  const hasValue = Boolean(value && value.length > 0);

  const count = value ? value.length : 0;
  const hasIcon = !!icon;

  return (
    <InputWrapper $hasValue={hasValue}>
      <LabelRow>
        <Label>{label}</Label>
        {!!showCounter && <Count>{count}/999</Count>}
      </LabelRow>
      <InputField
        id={name}
        {...register(name)}
        type="text"
        placeholder={placeholder}
        maxLength={maxLength}
        $hasError={!!hasError}
        $hasValue={hasValue}
        $hasIcon={hasIcon}
        />
        {icon && <IconWrapper $hasValue={hasValue}>{icon}</IconWrapper>}
      <HelperText>{helperText}</HelperText>
      {!!hasError && (
        <ErrorText>
          <Error_Outlined width={18} height={18} /> {errorMessage}
        </ErrorText>
      )}
    </InputWrapper>
  );
};

export default TextInput;
