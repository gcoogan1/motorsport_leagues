import { useFormContext } from "react-hook-form";
import { InputContainer, InputField, InputWrapper } from "./TimeInput.styles";

// MUST BE WRAPPED IN REACT-HOOK-FORM FORM PROVIDER

type TimeInputProps = {
  name: string;
  placeholder?: string;
  helperText?: string;
  hasError?: boolean;
  errorMessage?: string;
};

const TimeInput = ({
  name,
  placeholder = "00:00.000",
  helperText,
  hasError,
  errorMessage,
}: TimeInputProps) => {
  const { register, watch, setValue } = useFormContext();

  const value = watch(name);

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
    <InputWrapper>
      <InputContainer>
        <InputField
          {...register(name)}
          type="text"
          placeholder={placeholder}
          value={value || ""}
          onChange={handleChange}
          maxLength={8}
          inputMode="numeric"
        />
      </InputContainer>
      {helperText && <div>{helperText}</div>}
      {hasError && errorMessage && <div>{errorMessage}</div>}
    </InputWrapper>
  );
};

export default TimeInput;
