import Icon from "@/components/Icon/Icon";
import { LinkContainer, LinkLabel } from "./ManageMenuLink.styles";

type ManageMenuLinkProps = {
  id?: string;
  controlsId?: string;
  label: string;
  isSelected?: boolean;
  icon?: React.ReactNode;
  onClick: () => void;
};

const ManageMenuLink = ({ id, controlsId, label, icon, isSelected, onClick }: ManageMenuLinkProps) => {
  return (
    <LinkContainer
      id={id}
      type="button"
      role="tab"
      aria-selected={isSelected}
      aria-controls={controlsId}
      $isSelected={isSelected}
      onClick={onClick}
    >
      {icon && <Icon size="medium">{icon}</Icon>}
      <LinkLabel>{label}</LinkLabel>
    </LinkContainer>
  )
}

export default ManageMenuLink