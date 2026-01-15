import Panel from "@/components/Panels/Panel";
import { createContext, useContext, useState, type ReactNode } from "react";


export type PanelType = "none" | "ACCOUNT";

type PanelContextType = {
  openPanel: (type: Exclude<PanelType, "none">) => void;
  closePanel: () => void;
};

const PanelContext = createContext<PanelContextType | null>(null);

// Hook for easier access
export const usePanel = () => {
  const ctx = useContext(PanelContext);
  if (!ctx) throw new Error("usePanel must be used within a PanelProvider");
  return ctx;
};

export const PanelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [panel, setPanel] = useState<PanelType>("none");

  const openPanel = (type: Exclude<PanelType, "none">) => setPanel(type);
  const closePanel = () => setPanel("none");

  return (
    <PanelContext.Provider value={{ openPanel, closePanel }}>
      {children}
      <Panel panel={panel} onClose={closePanel} />
    </PanelContext.Provider>
  );
};
