import { ButtonLinkContainer } from './TabLink.styles'

export type TabLinkProps = {
  isSelected?: boolean;
  label?: string;
  onClick?: () => void;
  shouldExpand?: boolean;
}

const TabLink = ({ isSelected = false, label, onClick, shouldExpand, }: TabLinkProps) => {

  return (
    <ButtonLinkContainer type="button" $isSelected={isSelected} onClick={onClick} $shouldExpand={shouldExpand}>
      {label}
    </ButtonLinkContainer>
  )
}

export default TabLink