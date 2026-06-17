import { Container, Label, ValueContainer, Value } from "./SpecialRow.styles";
type SpecialRowProps = {
  label: string;
  value: string | number;
};

const SpecialRow = ({ label, value }: SpecialRowProps) => {
  return (
    <Container>
      <Label>{label}</Label>
      <ValueContainer>
        <Value>{value}</Value>
      </ValueContainer>
    </Container>
  )
}

export default SpecialRow