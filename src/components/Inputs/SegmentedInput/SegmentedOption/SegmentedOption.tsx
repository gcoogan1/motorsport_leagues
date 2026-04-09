import { OptionContainer, OptionLabel } from "./SegmentedOption.styles";

type SegmentedOptionProps = {
  label: string;
  value: string | number;
  isSelected?: boolean;
  onClick: (value: string | number) => void;
};

const SegmentedOption = ({ label, value, isSelected, onClick }: SegmentedOptionProps) => {
  return (
    <OptionContainer type="button" $isSelected={isSelected} onClick={() => onClick(value)}>
      <OptionLabel>{label}</OptionLabel>
    </OptionContainer>
  )
}

export default SegmentedOption