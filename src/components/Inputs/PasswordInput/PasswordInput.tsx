import { useFormContext } from "react-hook-form";
import Error_Outlined from "@assets/Icon/Error_Outlined.svg?react";
import {
  ErrorText,
  HelperText,
  ButtonWrapper,
  InputField,
  InputWrapper,
  Label,
  LabelRow,
  InputContainer,
} from "./PasswordInput.styles";
import Button from "@/components/Button/Button";
import { useState } from "react";

// MUST BE WRAPPED IN REACT-HOOK-FORM FORM PROVIDER

type PasswordInputProps = {
  name: string;
  label: string;
  placeholder?: string;
  helperText?: string;
  hasError?: boolean;
  errorMessage?: string;
  autoComplete?: string;
};

const PasswordInput = ({
  name,
  label,
  placeholder,
  helperText,
  hasError,
  errorMessage,
  autoComplete,
}: PasswordInputProps) => {
  const { register, watch } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);

  const value = watch(name);
  const hasValue = Boolean(value && value.length > 0);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <InputWrapper $hasValue={hasValue}>
      <LabelRow>
        <Label>{label}</Label>
      </LabelRow>
      <InputContainer>
        <InputField
          id={name}
          type={showPassword ? "text" : "password"}
          {...register(name)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          $hasError={!!hasError}
          $hasValue={hasValue}
        />
        <ButtonWrapper>
          <Button
            size="small"
            color="base"
            variant="ghost"
            onClick={toggleShowPassword}
            ariaLabel={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </Button>
        </ButtonWrapper>
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

export default PasswordInput;
