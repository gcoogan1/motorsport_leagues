import { usePanel } from "@/providers/panel/PanelProvider";
import PanelHeader from "../PanelHeader/PanelHeader";
import { PanelBody, PanelWrapper } from "./PanelLayout.styles";

type PanelLayoutProps = {
  children?: React.ReactNode;
  panelTitle?: string;
  panelTitleIcon?: React.ReactNode;
};

const PanelLayout = ({
  children,
  panelTitle,
  panelTitleIcon,
}: PanelLayoutProps) => {
  const { closePanel } = usePanel();
  return (
    <PanelWrapper>
      <PanelHeader
        panelTitle={panelTitle}
        panelTitleIcon={panelTitleIcon}
        onClose={closePanel}
      />
      <PanelBody>{children}</PanelBody>
    </PanelWrapper>
  );
};

export default PanelLayout;
