import Panel from "@/components/Panels/Panel";
import type { PanelProviderTypes } from "@/types/panel.types";
import { useState, type ReactNode } from "react";
import { PanelContext } from "./PanelContext";


export const PanelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [panel, setPanel] = useState<PanelProviderTypes>("none");

  const openPanel = (type: Exclude<PanelProviderTypes, "none">) => setPanel(type);
  const closePanel = () => setPanel("none");

  return (
    <PanelContext.Provider value={{ openPanel, closePanel }}>
      {children}
      <Panel panel={panel} onClose={closePanel} />
    </PanelContext.Provider>
  );
};
