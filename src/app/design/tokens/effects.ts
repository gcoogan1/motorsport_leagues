import { css } from "styled-components";

import { colorTokens, withOpacity } from "./color";

// -- EFFECTS MODULE -- /

// Create CSS snippet for opacity style
export const opacityCSS = (opacity: number) => css`
  opacity: ${opacity};
`;

// Create CSS snippet for box-shadow style
export const boxShadowCSS = (shadow: string) => css`
  box-shadow: ${shadow};
`;


// --- Effects Tokens -- //
export const effectsTokens = {
  effects: {
    opacity: {
      opacity10: 0.1,
      opacity20: 0.2,
      opacity30: 0.3,
      opacity40: 0.4,
      opacity50: 0.5,
      opacity60 : 0.6,
      opacity70: 0.7,
      opacity80: 0.8,
      opacity90: 0.9,
      full: 1.0,
    },
    boxShadow: {
      glowWhite: "0px 0px 20px 0px rgba(255, 255, 255, 0.2)",
      coverBaseTop: `0px -40px 40px 0px  ${colorTokens.colors.base.base3}`,
      coverBaseDown: `0px 40px 40px 0px  ${colorTokens.colors.base.base3}`,
      glowGoldRight: `10px 0px 20px 0px ${withOpacity(colorTokens.colors.position.gold, 20)}`,
      glowSilverRight: `10px 0px 20px 0px ${withOpacity(colorTokens.colors.position.silver, 20)}`,
      glowBronzeRight: `10px 0px 20px 0px ${withOpacity(colorTokens.colors.position.bronze, 20)}`,
    },
  },
};