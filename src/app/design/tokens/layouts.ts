// -- LAYOUTS MODULE -- //

// Types
type Space = Record<string, string>;
type MediaQueries = Record<string, string>;
type LayoutTokens = {
  layouts: {
    space: Space;
    mediaQueries: MediaQueries;
  };
};

// --- Space --- //
export const space: Space = {
  xxxSmall: "2px",
  xxSmall: "4px",
  xSmall: "8px",
  small: "12px",
  medium: "16px",
  large: "24px",
  xLarge: "32px",
  xxLarge: "64px",
  xxxLarge: "80px",
};

// --- Media Queries --- //
export const mediaQueries: MediaQueries = {
  mobile: "@media (max-width: 919px)",
  desktop: "@media (min-width: 920px)",
};

// --- Layout Tokens -- //
export const layoutTokens: LayoutTokens = {
  layouts: {
    space,
    mediaQueries,
  },
};