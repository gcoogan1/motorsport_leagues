import { RowContainer } from "./FormRow.styles";

// This component does not use form; it is used for UI purposes only to layout form fields in a row. 
// It can be used within any form context and will not interfere with form state or validation.

type FormRowProps = {
  children: React.ReactNode;
}

const FormRow = ({ children }: FormRowProps) => {
  return (
    <RowContainer>{children}</RowContainer>
  )
}

export default FormRow