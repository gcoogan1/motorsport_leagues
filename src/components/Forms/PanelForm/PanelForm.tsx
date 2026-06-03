import Checkbox from "@/components/Inputs/Checkbox/Checkbox";
import { FormHeader, FormTitle, FormWrapper, InputContainer } from "./PanelForm.styles"

type CheckboxOption = {
  name?: string;
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  helperMessage?: string;
  onChange?: (checked: boolean) => void;
}

type PanelFormProps = {
  title: string;
  hasMultiple?: boolean;
  children?: React.ReactNode;
  checkboxOption?: CheckboxOption;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
};

const PanelForm = ({ title, children, checkboxOption, hasMultiple, onSubmit }: PanelFormProps) => {
  return (
    <FormWrapper onSubmit={onSubmit}>
      <FormHeader>
        <FormTitle>{title}</FormTitle>
        {checkboxOption && (
          <Checkbox
            name={checkboxOption.name}
            label={checkboxOption.label}
            checked={checkboxOption.checked}
            defaultChecked={checkboxOption.defaultChecked}
            helperMessage={checkboxOption.helperMessage}
            onChange={checkboxOption.onChange}
          />
        )}
      </FormHeader>
      <InputContainer hasMultiple={hasMultiple}>
        {children}
      </InputContainer>
    </FormWrapper>
  )
}

export default PanelForm