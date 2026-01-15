import React from "react";
import { panelVariants} from "@/features/panels/panel.variants";
import type { PanelType } from "@/providers/panel/PanelProvider";
import { createPortal } from "react-dom";
import { Overlay, PanelContainer } from "./Panel.styles";


type PanelProps = {
  panel: PanelType;
  onClose: () => void;
};

const Panel: React.FC<PanelProps> = ({ panel, onClose }) => {
  if (panel=== "none") return null;

  return createPortal(
    <>
      {/* Clicking overlay closes the panel */}
      <Overlay onClick={onClose} />

      {/* Right side panel */}
      <PanelContainer>
        {React.createElement(panelVariants[panel])}
      </PanelContainer>
    </>,
    document.body
  );
};

export default Panel;
