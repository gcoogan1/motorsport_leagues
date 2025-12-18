import { css } from "styled-components";

import { colorTokens, withOpacity } from "./color";

// -- EFFECTS MODULE -- /

// Types
type EffectTokens = {
  effects: {
    opacity: Record<number, number>;
    boxShadow: Record<string, string>;
  };
};

// --- Effects Tokens -- //
export const effectsTokens: EffectTokens = {
  effects: {
    opacity: {
      10: 0.1,
      20: 0.2,
      30: 0.3,
      40: 0.4,
      50: 0.5,
      60: 0.6,
      70: 0.7,
      80: 0.8,
      90: 0.9,
      100: 1.0,
    },
    boxShadow: {
      glowWhite: "0px 0px 20px 0px rgba(255, 255, 255, 0.2)",
      coverBaseTop: `0px -40px 40px 0px  ${colorTokens.colors.base.base3}`,
      coverBaseDown: `0px 40px 40px 0px  ${colorTokens.colors.base.base3}`,
      glowGoldRight: `10px 0px 20px 0px ${withOpacity(
        colorTokens.colors.position.gold,
        20
      )}`,
      glowSilverRight: `10px 0px 20px 0px ${withOpacity(
        colorTokens.colors.position.silver,
        20
      )}`,
      glowBronzeRight: `10px 0px 20px 0px ${withOpacity(
        colorTokens.colors.position.bronze,
        20
      )}`,
    },
  },
};

// Opacity helper
const opacityCSS = Object.fromEntries(
  Object.entries(effectsTokens.effects.opacity).map(([key, value]) => [
    `opacity${key}`,
    css`opacity: ${value};`,
  ])
);

// Box-shadow helper
const boxShadowCSS = Object.fromEntries(
  Object.entries(effectsTokens.effects.boxShadow).map(([key, value]) => [
    key,
    css`box-shadow: ${value};`,
  ])
);

// Export CSS helpers
export const effectsCSS = {
  opacity: opacityCSS as Record<string, ReturnType<typeof css>>,
  boxShadow: boxShadowCSS as Record<string, ReturnType<typeof css>>,
};
