import type { ThemeName } from "@/app/design/tokens/theme";
import { createContext } from "react";

type ThemeContextType = {
  themeName: ThemeName;
  setThemeName: (theme: ThemeName) => void;
  overrideThemeName: ThemeName | null;
  setOverrideThemeName: (theme: ThemeName | null) => void;
  clearOverrideThemeName: () => void;
  activeThemeName: ThemeName;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
