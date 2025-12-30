import Icon from "@/components/Icon/Icon";
import Button from "@/components/Button/Button";
import CloseIcon from "@assets/Icon/Close.svg?react";
import { PanelHeaderContainer, PanelTitle, PanelTitleContainer } from "./PanelHeader.styles";


type PanelHeaderProps = {
  panelTitle?: string;
  panelTitleIcon?: React.ReactNode;
  showShadow?: boolean;
  onClose?: () => void;
}

const PanelHeader = ({ panelTitle, panelTitleIcon, showShadow, onClose }: PanelHeaderProps) => {
const handleOnClick = () => {
  if (onClose) {
    onClose();
  }
}

  return (
    <PanelHeaderContainer showShadow={showShadow}>
      <PanelTitleContainer>
        <Icon size="xLarge">{panelTitleIcon}</Icon>
        <PanelTitle>{panelTitle}</PanelTitle>
      </PanelTitleContainer>
        <Button
          color="base"
          size="small"
          iconOnly
          rounded
          icon={{ left: <CloseIcon /> }}
          onClick={handleOnClick}
        />
    </PanelHeaderContainer>
  )
}

export default PanelHeader