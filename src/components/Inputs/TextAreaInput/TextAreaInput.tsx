import { useFormContext } from "react-hook-form";
import Error_Outlined from "@assets/Icon/Error_Outlined.svg?react";
import {
  Count,
  ErrorText,
  HelperText,
  InputContainer,
  InputField,
  InputWrapper,
  Label,
  LabelRow,
} from "./TextAreaInput.styles";

// MUST BE WRAPPED IN REACT-HOOK-FORM FORM PROVIDER

type TextAreaInputProps = {
  name: string;
  label: string;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  showCounter?: boolean;
  helperText?: string;
  hasError?: boolean;
  errorMessage?: string;
  autoComplete?: string;
};

const TextAreaInput = ({
  name,
  label,
  placeholder,
  rows = 5,
  maxLength = 1000,
  showCounter,
  helperText,
  hasError,
  errorMessage,
  autoComplete = "on",
}: TextAreaInputProps) => {
  const { register, watch } = useFormContext();

  const value = watch(name);
  const hasValue = Boolean(value && value.length > 0);

  const count = value ? value.length : 0;

  return (
    <InputWrapper>
      <LabelRow>
        <Label>{label}</Label>
        {!!showCounter && <Count>{count}/{maxLength}</Count>}
      </LabelRow>
      <InputContainer>
        <InputField
          id={name}
          {...register(name)}
          rows={rows}
          autoComplete={autoComplete}
          placeholder={placeholder}
          maxLength={maxLength}
          $hasError={!!hasError}
          $hasValue={hasValue}
        />
      </InputContainer>
      <HelperText>{helperText}</HelperText>
      {!!hasError && (
        <ErrorText>
          <Error_Outlined width={18} height={18} /> {errorMessage}
        </ErrorText>
      )}
    </InputWrapper>
  );
};

export default TextAreaInput;
