import "styled-components";
import type { designTokens } from "@/app/design/tokens";
import type { themeTokens } from "@/app/design/tokens/theme";

// Extending the DefaultTheme interface to include our design and theme tokens
// Allows for type-safe access to these tokens in styled-components
declare module "styled-components" {
  export interface DefaultTheme {
    colors: typeof designTokens.colors;
    layout: typeof designTokens.layout;
    typography: typeof designTokens.typography;
    borders: typeof designTokens.borders;
    effects: typeof designTokens.effects;
    theme: (typeof themeTokens)[keyof typeof themeTokens];
  }
}
