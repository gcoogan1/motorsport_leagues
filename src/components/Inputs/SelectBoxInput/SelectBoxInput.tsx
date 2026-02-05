import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { SelectBoxInputContainer } from "./SelectBoxInput.styles";
import SelectBox from "./components/SelectBox";

type SelectBoxInputProps = {
  name: string;
  options: Array<{
    label: string;
    value: string;
    helperMessage?: string;
    icon?: React.ReactNode;
    isDisabled?: boolean;
  }>;
  defaultSelected?: string;
  value?: string;
  onChange?: (value: string) => void;
};

const SelectBoxInput = ({
  name,
  options,
  defaultSelected,
  value,
  onChange,
}: SelectBoxInputProps) => {
  // Internal state to manage selection if onChange and value are not provided
  const [isInternalSelected, setIsInternalSelected] = useState<string | null>(
    defaultSelected || null,
  );


  const { setValue, register, watch } = useFormContext();

  // Register the field and set default value if provided
  useEffect(() => {
    register(name);
    if (defaultSelected) {
      setValue(name, defaultSelected);
    }
  }, [register, name, defaultSelected, setValue]);

  // Watch the selected value from the form context
  const selectedValue = watch(name);

  // Handle selection change
  const handleSelectionChange = (selectedValue: string) => {
    if (onChange) {
      onChange(selectedValue);
      setValue(name, selectedValue);
    } else {
      setIsInternalSelected(selectedValue);
    }
  };

  return (
    <SelectBoxInputContainer>
      {options.map((option) => (
        <SelectBox
          key={option.value}
          label={option.label}
          helperMessage={option.helperMessage}
          isSelected={
            selectedValue === option.value ||
            (isInternalSelected === option.value && !value)
          }
          onClick={() => handleSelectionChange(option.value)}
          icon={option.icon}
          isDisabled={option.isDisabled}
        />
      ))}
    </SelectBoxInputContainer>
  );
};

export default SelectBoxInput;
