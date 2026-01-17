import { useContext } from "react";
import { PanelContext } from "./PanelContext";

// Hook for easier access
export const usePanel = () => {
  const ctx = useContext(PanelContext);
  if (!ctx) throw new Error("usePanel must be used within a PanelProvider");
  return ctx;
};
