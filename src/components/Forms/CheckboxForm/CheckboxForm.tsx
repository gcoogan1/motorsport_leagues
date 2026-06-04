import Checkbox from "@/components/Inputs/Checkbox/Checkbox";
import { CheckboxContainer, FormList, FormWrapper } from "./CheckboxForm.styles";

type CheckboxFormProps = {
  checkbox: {
    name?: string;
    label: string;
    checked?: boolean;
    onChange?: () => void;
  },
  children?: React.ReactNode;
}

const CheckboxForm = ({ checkbox, children  }: CheckboxFormProps) => {
  return (
    <FormWrapper 
      onSubmit={(e) => e.preventDefault()} 
      $isSelected={checkbox.checked ?? false}>
      <CheckboxContainer isSelected={checkbox.checked ?? false}>
        <Checkbox 
          name={checkbox.name}
          label={checkbox.label}
          checked={checkbox.checked}
          onChange={checkbox.onChange}
        />
      </CheckboxContainer>
      {checkbox.checked && (
        <FormList>
          {children}
        </FormList>
      )}
    </FormWrapper>
  )
}

export default CheckboxForm