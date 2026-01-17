import type { PanelProviderTypes } from "@/types/panel.types";
import { createContext } from "react";

type PanelContextType = {
  openPanel: (type: Exclude<PanelProviderTypes, "none">) => void;
  closePanel: () => void;
};

export const PanelContext = createContext<PanelContextType | null>(null);