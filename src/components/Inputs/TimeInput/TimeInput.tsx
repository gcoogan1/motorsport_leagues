import { useFormContext } from "react-hook-form";
import TimeIcon from "@assets/Icon/Time.svg?react";
import { ErrorText, HelperText, IconWrapper, InputContainer, InputField, InputWrapper, Label, LabelRow } from "./TimeInput.styles";

// MUST BE WRAPPED IN REACT-HOOK-FORM FORM PROVIDER

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
  const { register, watch, setValue } = useFormContext();

  const value = watch(name);
  const hasValue = Boolean(value && value.length > 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, ""); // Only digits

    // Format as HH:MM.MMM (max 7 digits: 2+2+3)
    if (input.length > 7) {
      input = input.slice(0, 7);
    }

    let formatted = "";
    if (input.length >= 1) {
      formatted = input.slice(0, 2); // HH
    }
    if (input.length >= 3) {
      formatted = input.slice(0, 2) + ":" + input.slice(2, 4); // HH:MM
    }
    if (input.length >= 5) {
      formatted = input.slice(0, 2) + ":" + input.slice(2, 4) + "." + input.slice(4, 7); // HH:MM.MMM
    }

    setValue(name, formatted);
  };

  return (
    <InputWrapper $hasValue={hasValue}>
        <LabelRow>
            {label && <Label>{label}</Label>}
          </LabelRow>
      <InputContainer>
        <InputField
          {...register(name)}
          type="time"
          placeholder={placeholder}
          value={value || "12:00"}
          onChange={handleChange}
          maxLength={8}
          inputMode="numeric"
          $hasError={!!hasError}
          $hasValue={hasValue}
        />
        <IconWrapper $hasValue={hasValue}><TimeIcon /></IconWrapper>
      </InputContainer>
      {helperText && <HelperText>{helperText}</HelperText>}
      {hasError && errorMessage && <ErrorText>{errorMessage}</ErrorText>}
    </InputWrapper>
  );
};

export default TimeInput;
