import { useState } from "react";
import CheckedIcon from "@assets/Icon/Checkbox_Checked.svg?react";
import UncheckedIcon from "@assets/Icon/Checkbox_Unchecked.svg?react";
import { CheckboxContainer, CheckboxWrapper, HelperMessage, Label, TextContainer } from "./Checkbox.styles";

export type CheckboxOption = {
  name?: string;
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  helperMessage?: string;
  onChange?: (checked: boolean) => void;
};

type CheckboxProps = CheckboxOption;

const Checkbox = ({ name, label, checked, defaultChecked, helperMessage, onChange }: CheckboxProps) => {
  const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);

  const isChecked = checked ?? internalChecked;

  const handleToggle = () => {
    const next = !isChecked;
    if (checked === undefined) {
      setInternalChecked(next);
    }
    onChange?.(next);
  };

  return (
    <CheckboxWrapper>
      <CheckboxContainer
        type="button"
        role="checkbox"
        aria-checked={isChecked}
        onClick={handleToggle}
      >
        {name && (
          <input type="hidden" name={name} value={isChecked ? "true" : "false"} readOnly />
        )}
        {isChecked ? <CheckedIcon /> : <UncheckedIcon />}
      </CheckboxContainer>
      <TextContainer>
        <Label onClick={handleToggle}>{label}</Label>
        {helperMessage && <HelperMessage>{helperMessage}</HelperMessage>}
      </TextContainer>
    </CheckboxWrapper>
  );
};

export default Checkbox;