import Panel from "@/components/Panels/Panel";
import type { PanelProviderTypes } from "@/types/panel.types";
import { useState, type ReactNode } from "react";
import { PanelContext, type PanelState } from "./PanelContext";


export const PanelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [panel, setPanel] = useState<PanelState>({ type: "none" });

  const openPanel = (type: Exclude<PanelProviderTypes, "none">, props?: Record<string, unknown>) => 
    setPanel({ type, props });
  
  const closePanel = () => setPanel({ type: "none" });

  return (
    <PanelContext.Provider value={{ openPanel, closePanel }}>
      {children}
      <Panel panel={panel.type} panelProps={panel.props} onClose={closePanel} />
    </PanelContext.Provider>
  );
};
