import { useState } from "react";
import {
  HelperText,
  Label,
  OptionsContainer,
  SegmentedInputContainer,
} from "./SegmentedInput.styles";
import SegmentedOption from "./SegmentedOption/SegmentedOption";

type SegmentedOptionItem = {
  label: string;
  value: string;
};

type SegmentedInputProps = {
  name?: string;
  inputLabel: string;
  options: SegmentedOptionItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  helperMessage?: string;
};

const SegmentedInput = ({
  name,
  options,
  inputLabel,
  value,
  defaultValue,
  onChange,
  helperMessage,
}: SegmentedInputProps) => {
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? options[0]?.value ?? "",
  );

  const selectedValue = value ?? internalValue;

  const handleSelect = (nextValue: string) => {
    if (value === undefined) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
  };

  return (
    <SegmentedInputContainer>
      <Label>{inputLabel}</Label>
      {name && <input type="hidden" name={name} value={selectedValue} readOnly />}
      <OptionsContainer>
        {options.map((option) => (
          <SegmentedOption
            key={option.value}
            label={option.label}
            value={option.value}
            isSelected={selectedValue === option.value}
            onClick={handleSelect}
          />
        ))}
      </OptionsContainer>
      {helperMessage && <HelperText>{helperMessage}</HelperText>}
    </SegmentedInputContainer>
  );
};

export default SegmentedInput;