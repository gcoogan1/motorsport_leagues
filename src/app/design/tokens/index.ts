import { colorTokens } from "./color";
import { typographyCSS } from "./typography";
import { borderTokens } from "./borders";
import { effectsCSS } from "./effects";
import { layoutTokens } from "./layouts";
import { themeTokens } from "./theme";

// -- DESIGN TOKENS MODULE -- //

// NOTES: typographyCSS, effectsCSS are imported helpers and not raw tokens. 
// They are to be used directly in styled-components because they return CSS snippets.

// --- Design Tokens --- //
export const designTokens = {
  colors: colorTokens.colors,
  gradients: colorTokens.gradients,
  theme: themeTokens,
  typography: typographyCSS,
  borders: {
    radius: borderTokens.radius,
    width: borderTokens.width,
  },
  effects: {
    opacity: effectsCSS.opacity,
    boxShadow: effectsCSS.boxShadow,
  },
  layout: layoutTokens.layouts,
};
