import { useState } from "react";
import { SelectBoxInputContainer } from "./SelectBoxInput.styles";
import SelectBox from "./components/SelectBox";

// TODO: Move isSelected state management to parent component via onChange and value props

type SelectBoxInputProps = {
  options: Array<{ label: string; value: string; helperMessage?: string, icon?: React.ReactNode }>;
  defaultSelected?: string;
}

const SelectBoxInput = ({ options, defaultSelected }: SelectBoxInputProps) => {
  const [isSelected, setIsSelected] = useState<string | null>(defaultSelected || null);


  return (
    <SelectBoxInputContainer>
      {options.map((option) => (
        <SelectBox
          key={option.value}
          label={option.label}
          helperMessage={option.helperMessage}
          isSelected={isSelected === option.value}
          onClick={() => setIsSelected(option.value)}
          icon={option.icon}
        />
      ))}
    </SelectBoxInputContainer>
  )
}

export default SelectBoxInput