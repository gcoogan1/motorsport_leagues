import React from "react";
import { panelVariants} from "@/features/panels/panel.variants";
import { createPortal } from "react-dom";
import { Overlay, PanelContainer } from "./Panel.styles";
import type { PanelProviderTypes } from "@/types/panel.types";


type PanelProps = {
  panel: PanelProviderTypes;
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
