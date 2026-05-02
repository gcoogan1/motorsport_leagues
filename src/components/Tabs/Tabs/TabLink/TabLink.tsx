import { ButtonContainer, ButtonTextContainer, ButtonText } from "./TabLink.styles";

type TabLinkProps = {
  label?: string;
  active?: boolean;
  onClick?: () => void;
};

const TabLink = ({ label, active = false, onClick }: TabLinkProps) => {
  return (
    <ButtonContainer onClick={onClick}>
      <ButtonTextContainer $active={active}>
        <ButtonText $active={active}>{label}</ButtonText>
      </ButtonTextContainer>
    </ButtonContainer>
  )
}

export default TabLink