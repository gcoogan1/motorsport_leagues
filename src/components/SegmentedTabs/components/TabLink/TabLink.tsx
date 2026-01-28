import { ButtonLinkContainer } from './TabLink.styles'

export type TabLinkProps = {
  isSelected?: boolean;
  label?: string;
  onClick?: () => void;
  shouldExpand?: boolean;
  isPrimary?: boolean;
}

const TabLink = ({ isSelected = false, label, onClick, shouldExpand, isPrimary = false }: TabLinkProps) => {

  return (
    <ButtonLinkContainer $isSelected={isSelected} onClick={onClick} $shouldExpand={shouldExpand} $isPrimary={isPrimary}>
      {label}
    </ButtonLinkContainer>
  )
}

export default TabLink