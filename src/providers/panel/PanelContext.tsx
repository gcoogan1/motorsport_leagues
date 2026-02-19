import type { PanelProviderTypes } from "@/types/panel.types";
import { createContext } from "react";

export type PanelState = {
  type: PanelProviderTypes;
  props?: Record<string, unknown>;
};

type PanelContextValue = {
  openPanel: (type: Exclude<PanelProviderTypes, "none">, props?: Record<string, unknown>) => void;
  closePanel: () => void;
};

export const PanelContext = createContext<PanelContextValue | null>(null);