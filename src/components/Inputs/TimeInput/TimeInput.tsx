import { useFormContext } from "react-hook-form";
import TimeIcon from "@assets/Icon/Time.svg?react";
import {
  ErrorText,
  HelperText,
  IconWrapper,
  InputContainer,
  InputField,
  InputWrapper,
  Label,
  LabelRow,
} from "./TimeInput.styles";

type TimeInputProps = {
  name: string;
  label: string;
  placeholder?: string;
  helperText?: string;
  hasError?: boolean;
  errorMessage?: string;
};

const TimeInput = ({
  name,
  label,
  placeholder = "12:00",
  helperText,
  hasError,
  errorMessage,
}: TimeInputProps) => {
  const { register, watch } = useFormContext();

  const value = watch(name);
  const hasValue = Boolean(value);

  return (
    <InputWrapper $hasValue={hasValue}>
      <LabelRow>
        {label && <Label>{label}</Label>}
      </LabelRow>

      <InputContainer>
        <InputField
          type="time"
          placeholder={placeholder}
          {...register(name)}
          $hasError={!!hasError}
          $hasValue={hasValue}
        />

        <IconWrapper $hasValue={hasValue}>
          <TimeIcon />
        </IconWrapper>
      </InputContainer>

      {helperText && <HelperText>{helperText}</HelperText>}
      {hasError && errorMessage && <ErrorText>{errorMessage}</ErrorText>}
    </InputWrapper>
  );
};

export default TimeInput;