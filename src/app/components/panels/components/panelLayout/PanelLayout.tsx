import PanelHeader from "../panelHeader/PanelHeader";
import { PanelBody, PanelWrapper } from "./PanelLayout.styles";

type PanelLayoutProps = {
  children?: React.ReactNode;
  panelTitle?: string;
  panelTitleIcon?: React.ReactNode;
  onClose?: () => void;
};

const PanelLayout = ({
  children,
  panelTitle,
  onClose,
  panelTitleIcon,
}: PanelLayoutProps) => {
  return (
    <PanelWrapper>
      <PanelHeader
        panelTitle={panelTitle}
        panelTitleIcon={panelTitleIcon}
        onClose={onClose}
      />
      <PanelBody>{children}</PanelBody>
    </PanelWrapper>
  );
};

export default PanelLayout;
