import { useFormContext } from "react-hook-form";
import {
  ErrorText,
  HelperText,
  InputContainer,
  InputField,
  InputWrapper,
  Label,
  LabelRow,
} from "./RaceTimeInput.styles";

type TimeInputProps = {
  name: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  hasError?: boolean;
  errorMessage?: string;
};

const RaceTimeInput = ({
  name,
  label,
  placeholder = "00:00.000",
  helperText,
  hasError,
  errorMessage,
}: TimeInputProps) => {
  const { register, watch, setValue } = useFormContext();
  const value = watch(name);
  const hasValue = Boolean(value);

  // This handles the 00:00.000 formatting
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 1. Remove all non-digits
    let digits = e.target.value.replace(/\D/g, "");

    // 2. Limit the total number of digits to 7
    if (digits.length > 7) {
      digits = digits.slice(0, 7);
    }

    // 3. Rebuild the string with correct punctuation
    let formatted = "";
    if (digits.length > 0) {
      // Add minutes
      formatted += digits.substring(0, 2);
    }
    if (digits.length > 2) {
      // Add colon and seconds
      formatted += ":" + digits.substring(2, 4);
    }
    if (digits.length > 4) {
      // Add period and milliseconds
      formatted += "." + digits.substring(4, 7);
    }

    // 4. Update the react-hook-form state
    setValue(name, formatted, { shouldValidate: true });
  };

  return (
    <InputWrapper $hasValue={hasValue}>
      <LabelRow>
        {label && <Label>{label}</Label>}
      </LabelRow>
      <InputContainer>
        <InputField
          type="text"
          placeholder={placeholder}
          {...register(name)}
          onChange={handleInputChange} // Overrides default onChange
          $hasError={!!hasError}
          $hasValue={hasValue}
        />
      </InputContainer>
      {helperText && <HelperText>{helperText}</HelperText>}
      {hasError && errorMessage && <ErrorText>{errorMessage}</ErrorText>}
    </InputWrapper>
  );
};

export default RaceTimeInput;
