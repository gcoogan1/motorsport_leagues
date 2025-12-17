import { css } from "styled-components";

// -- TYPOGRAPHY MODULE -- /

// Types
type FontType = {
  fontSize: string;
  fontFamily: string;
  fontWeight: number;
  lineHeight: string;
  fontStyle?: string;
  textTransform?: string;
};
export type FontTheme = {
  typography: {
    body: Record<string, FontType>;
    subtitle: Record<string, FontType>;
    title: Record<string, FontType>;
  };
};

// Helper
// Create CSS snippet for font styles
export const fontCSS = (font: FontType) => css`
  font-size: ${font.fontSize};
  font-family: ${font.fontFamily};
  font-weight: ${font.fontWeight};
  line-height: ${font.lineHeight};
  font-style: ${font.fontStyle || "normal"};
  text-transform: ${font.textTransform || "none"};
`;


// --- Typography Tokens -- //
export const typographyTokens: FontTheme = {
  typography: {
    body: {
      tinyRegular: {
        fontSize: "10px",
        fontFamily: "Quantico, sans-serif",
        fontWeight: 400,
        lineHeight: "14px",
      },
      tinyBold: {
        fontSize: "10px",
        fontFamily: "Quantico, sans-serif",
        fontWeight: 700,
        lineHeight: "14px",
      },
      smallRegular: {
        fontSize: "13px",
        fontFamily: "Quantico, sans-serif",
        fontWeight: 400,
        lineHeight: "18px",
      },
      smallBold: {
        fontSize: "13px",
        fontFamily: "Quantico, sans-serif",
        fontWeight: 700,
        lineHeight: "20px",
      },
      mediumRegular: {
        fontSize: "15px",
        fontFamily: "Quantico, sans-serif",
        fontWeight: 400,
        lineHeight: "20px",
      },
      mediumBold: {
        fontSize: "15px",
        fontFamily: "Quantico, sans-serif",
        fontWeight: 700,
        lineHeight: "20px",
      },
    },
    subtitle: {
      small: {
        fontSize: "13px",
        fontFamily: "Quantico, sans-serif",
        fontWeight: 400,
        lineHeight: "18px",
        textTransform: "uppercase",
      },
      smallItalic: {
        fontSize: "13px",
        fontFamily: "Quantico, sans-serif",
        fontWeight: 700,
        lineHeight: "18px",
        fontStyle: "italic",
        textTransform: "uppercase",
      },
      medium: {
        fontSize: "15px",
        fontFamily: "Quantico, sans-serif",
        fontWeight: 700,
        lineHeight: "20px",
        textTransform: "uppercase",
      },
      mediumItalic: {
        fontSize: "15px",
        fontFamily: "Quantico, sans-serif",
        fontWeight: 700,
        lineHeight: "20px",
        fontStyle: "italic",
        textTransform: "uppercase",
      },
      large: {
        fontSize: "17px",
        fontFamily: "Quantico, sans-serif",
        fontWeight: 700,
        lineHeight: "22px",
        textTransform: "uppercase",
      },
      largeItalic: {
        fontSize: "17px",
        fontFamily: "Quantico, sans-serif",
        fontWeight: 700,
        lineHeight: "22px",
        fontStyle: "italic",
        textTransform: "uppercase",
      },
      xLargeItalic: {
        fontSize: "22px",
        fontFamily: "Quantico, sans-serif",
        fontWeight: 700,
        lineHeight: "28px",
        fontStyle: "italic",
        textTransform: "uppercase",
      },
    },
    title: {
      xSmall: {
        fontSize: "17px",
        fontFamily: "Zen Dots, sans-serif",
        fontWeight: 400,
        lineHeight: "22px",
      },
      small: {
        fontSize: "22px",
        fontFamily: "Zen Dots, sans-serif",
        fontWeight: 400,
        lineHeight: "28px",
      },
      medium: {
        fontSize: "28px",
        fontFamily: "Zen Dots, sans-serif",
        fontWeight: 400,
        lineHeight: "36px",
      },
      large: {
        fontSize: "36px",
        fontFamily: "Zen Dots, sans-serif",
        fontWeight: 400,
        lineHeight: "44px",
      },
    },
  },
};
