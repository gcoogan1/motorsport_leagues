import Panel from "@/components/Panels/Panel";
import type { PanelProviderTypes } from "@/types/panel.types";
import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { PanelContext, type PanelState } from "./PanelContext";


export const PanelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [panel, setPanel] = useState<PanelState>({ type: "none" });
  const outsidePanelCloseHandlerRef = useRef<(() => void) | null>(null);

  const setOutsidePanelCloseHandler = useCallback((handler: (() => void) | null) => {
    outsidePanelCloseHandlerRef.current = handler;
  }, []);

  const openPanel = useCallback((type: Exclude<PanelProviderTypes, "none">, props?: Record<string, unknown>) => {
    outsidePanelCloseHandlerRef.current = null;
    setPanel({ type, props });
  }, []);
  
  const closePanel = useCallback(() => {
    outsidePanelCloseHandlerRef.current = null;
    setPanel({ type: "none" });
  }, []);

  const handleOutsidePanelClose = useCallback(() => {
    if (outsidePanelCloseHandlerRef.current) {
      outsidePanelCloseHandlerRef.current();
      return;
    }

    closePanel();
  }, [closePanel]);

  const contextValue = useMemo(
    () => ({ openPanel, closePanel, setOutsidePanelCloseHandler }),
    [openPanel, closePanel, setOutsidePanelCloseHandler],
  );

  return (
    <PanelContext.Provider value={contextValue}>
      {children}
      <Panel panel={panel.type} panelProps={panel.props} onClose={handleOutsidePanelClose} />
    </PanelContext.Provider>
  );
};
