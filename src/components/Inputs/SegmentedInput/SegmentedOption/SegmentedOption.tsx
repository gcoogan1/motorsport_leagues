import { OptionContainer, OptionLabel } from "./SegmentedOption.styles";

type SegmentedOptionProps = {
  label: string;
  value: string;
  isSelected?: boolean;
  onClick: (value: string) => void;
};

const SegmentedOption = ({ label, value, isSelected, onClick }: SegmentedOptionProps) => {
  return (
    <OptionContainer $isSelected={isSelected} onClick={() => onClick(value)}>
      <OptionLabel>{label}</OptionLabel>
    </OptionContainer>
  )
}

export default SegmentedOption