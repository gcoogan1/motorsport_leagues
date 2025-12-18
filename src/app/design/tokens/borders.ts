// --- BORDER MODULE --- //

// Types
type BorderTokens = {
  width: Record<string, string>;
  radius: Record<string, string>;
}

// --- Border Tokens -- //
export const borderTokens: BorderTokens = {
  width: {
    thin: "1px",
    medium: "2px",
    thick: "4px",
  },
  radius: {
    small: "4px",
    medium: "8px",
    large: "12px",
    xLarge: "16px",
    xxLarge: "20px",
    xxxLarge: "40px",
    round: "999px",
  },
};