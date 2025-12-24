import { createContext, useState, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { designTokens } from "@/app/design/tokens";
import { themeTokens } from "@/app/design/tokens/theme";
import type { ThemeName } from "@/app/design/tokens/theme";

type ThemeContextType = {
  themeName: ThemeName;
  setThemeName: (theme: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// This provider wraps the app and provides theme context
export const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {

  // Store active theme in state (default to localStorage or "yellow")
  const [themeName, setThemeName] = useState<ThemeName>(() => {
    return (localStorage.getItem("theme") as ThemeName) || "yellow";
  });

  // Persist theme changes to localStorage
  useEffect(() => {
    localStorage.setItem("theme", themeName);
  }, [themeName]);

  // Inject theme into styled-components ThemeProvider
  return (
    <ThemeContext.Provider value={{ themeName, setThemeName }}>
      <ThemeProvider
        theme={{
          ...designTokens,
          theme: themeTokens[themeName],
        }}
      >
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export { ThemeContext };