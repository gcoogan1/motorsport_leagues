import { useState } from "react";
import Checkbox from "../Checkbox/Checkbox";
import { CheckboxContainer } from "./Checkbox.styles";

type CheckboxItemProps = {
  name?: string;
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  helperMessage?: string;
  onChange?: (checked: boolean) => void;
};

const CheckboxItem = ({
  name,
  label,
  checked,
  defaultChecked,
  helperMessage,
  onChange,
}: CheckboxItemProps) => {
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
    <CheckboxContainer $isChecked={isChecked}>
      <Checkbox
        name={name}
        label={label}
        checked={isChecked}
        defaultChecked={defaultChecked}
        helperMessage={helperMessage}
        onChange={handleToggle}
      />
    </CheckboxContainer>
  );
};

export default CheckboxItem;
