import { AppThemeProvider } from "../AppThemeProvider";
import ThemeSetter from "./ThemeSetter";
import type { ThemeName } from "@/app/design/tokens/theme";

// Storybook decorator to wrap stories with the AppThemeProvider and set the theme
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withAppTheme = (Story: any, context: any) => {
  const themeName = context.args.themeName as ThemeName;

  return (
    <AppThemeProvider>
      <ThemeSetter themeName={themeName}>
        <Story />
      </ThemeSetter>
    </AppThemeProvider>
  );
};
