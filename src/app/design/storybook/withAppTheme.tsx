import { AppThemeProvider } from "../AppThemeProvider";
import ThemeSetter from "./ThemeSetter";
import type { ThemeName } from "@/app/design/tokens/theme";

// Storybook decorator to wrap stories with the AppThemeProvider and set the theme
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withAppTheme = (Story: any, context: any) => {
  // Default to "yellow" theme if none is provided
  const themeName = context.args.themeName as ThemeName || "yellow"; 

  return (
    <AppThemeProvider>
      <ThemeSetter themeName={themeName}>
        <Story />
      </ThemeSetter>
    </AppThemeProvider>
  );
};
