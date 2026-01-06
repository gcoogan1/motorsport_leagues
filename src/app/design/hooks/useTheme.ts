import { useContext } from "react";
import { ThemeContext } from "../../../providers/theme/AppThemeProvider";

// Custom hook to access theme context
export const useAppTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useAppTheme must be used inside AppThemeProvider");
  }
  return ctx;
};
