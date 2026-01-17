import type { ThemeName } from "@/app/design/tokens/theme";
import { createContext } from "react";

type ThemeContextType = {
  themeName: ThemeName;
  setThemeName: (theme: ThemeName) => void;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
