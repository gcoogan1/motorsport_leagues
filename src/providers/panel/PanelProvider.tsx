import Panel from "@/components/Panels/Panel";
import type { PanelProviderTypes } from "@/types/panel.types";
import { useState, type ReactNode } from "react";
import { PanelContext, type PanelState } from "./PanelContext";


export const PanelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [panel, setPanel] = useState<PanelState>({ type: "none" });
  const [outsidePanelCloseHandler, setOutsidePanelCloseHandlerState] = useState<(() => void) | null>(null);

  const setOutsidePanelCloseHandler = (handler: (() => void) | null) => {
    setOutsidePanelCloseHandlerState(() => handler);
  };

  const openPanel = (type: Exclude<PanelProviderTypes, "none">, props?: Record<string, unknown>) => {
    setOutsidePanelCloseHandlerState(null);
    setPanel({ type, props });
  };
  
  const closePanel = () => {
    setOutsidePanelCloseHandlerState(null);
    setPanel({ type: "none" });
  };

  const handleOutsidePanelClose = () => {
    if (outsidePanelCloseHandler) {
      outsidePanelCloseHandler();
      return;
    }

    closePanel();
  };

  return (
    <PanelContext.Provider value={{ openPanel, closePanel, setOutsidePanelCloseHandler }}>
      {children}
      <Panel panel={panel.type} panelProps={panel.props} onClose={handleOutsidePanelClose} />
    </PanelContext.Provider>
  );
};
