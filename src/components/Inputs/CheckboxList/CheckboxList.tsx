import type { CheckboxOption } from "../Checkbox/Checkbox";
import Checkbox from "../Checkbox/Checkbox";
import { CheckboxListContainer } from "./CheckboxList.styles";


type CheckboxListProps = {
  options: CheckboxOption[];
  selectedValues: string[];
  onChange: (selectedValues: string[]) => void;
};

const CheckboxList = ({ options, selectedValues, onChange }: CheckboxListProps) => {
  return (
    <CheckboxListContainer>
      {options.map((option) => (
        <Checkbox
          key={option.name}
          {...option}
          checked={selectedValues.includes(option.name ?? "")}
          onChange={(checked) => {
            const nextSelectedValues = checked
              ? [...selectedValues, option.name ?? ""]
              : selectedValues.filter((value) => value !== option.name);
            onChange(nextSelectedValues);
          }}
        />
      ))}
    </CheckboxListContainer>
  )
}

export default CheckboxList