import { ButtonLinkContainer } from './TabLink.styles'

export type TabLinkProps = {
  isSelected?: boolean;
  label?: string;
  onClick?: () => void;
  shouldExpand?: boolean;
  shouldShrink?: boolean;
}

const TabLink = ({ isSelected = false, label, onClick, shouldExpand, shouldShrink = false }: TabLinkProps) => {

  return (
    <ButtonLinkContainer type="button" $isSelected={isSelected} onClick={onClick} $shouldExpand={shouldExpand} $shouldShrink={shouldShrink}>
      {label}
    </ButtonLinkContainer>
  )
}

export default TabLink