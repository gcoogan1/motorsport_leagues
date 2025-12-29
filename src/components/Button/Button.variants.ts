import { designTokens } from "@/app/design/tokens";
import type { DefaultTheme } from "styled-components";

const { colors } = designTokens;

export type ButtonVariant = "filled" | "outlined" | "ghost";
export type ButtonColor = "system" | "base" | "primary" | "danger";
export type ButtonState = "enabled" | "hovered" | "focused" | "pressed" | "loading";

// Defines the structure of individual button style items
type ButtonStyleItem = {
  background: string;
  color: string;
  boxShadow?: string;
};
// Defines the overall structure for button styles
type ButtonStyles = {
  [key in ButtonVariant]: {
    [key in ButtonColor]: {
      [key in ButtonState]: ButtonStyleItem;
    };
  };
};
// Arguments required to resolve button styles
type ButtonStyleArgs = {
  theme: DefaultTheme;
  variant: ButtonVariant;
  color: ButtonColor;
  state: ButtonState;
};


// Defines the style variants for the Button component
export const getButtonVariants = (theme: DefaultTheme): ButtonStyles => {
  return {
    filled: {
      system: {
        enabled: {
          background: colors.text.text1,
          color: colors.base.base3,
        },
        hovered: {
          background: colors.text.text2,
          color: colors.base.base3,
        },
        focused: {
          background: colors.text.text2,
          color: colors.base.base3,
        },
        pressed: {
          background: colors.text.text3,
          color: colors.base.base3,
        },
        loading: {
          background: colors.text.text3,
          color: colors.base.base3,
        },
      },
      base: {
        enabled: {
          background: colors.base.translucent10,
          color: colors.text.text1,
        },
        hovered: {
          background: colors.base.translucent20,
          color: colors.text.text1,
        },
        focused: {
          background: colors.base.translucent20,
          color: colors.text.text1,
        },
        pressed: {
          background: colors.base.translucent30,
          color: colors.text.text1,
        },
        loading: {
          background: colors.base.translucent30,
          color: colors.text.text1,
        },
      },
      primary: {
        enabled: {
          background: theme.theme.primaryA,
          color: colors.base.base3,
        },
        hovered: {
          background: theme.theme.primaryA2,
          color: colors.base.base3,
        },
        focused: {
          background: theme.theme.primaryA2,
          color: colors.base.base3,
        },
        pressed: {
          background: theme.theme.primaryA3,
          color: colors.base.base3,
        },
        loading: {
          background: theme.theme.primaryA3,
          color: colors.base.base3,
        },
      },
      danger: {
        enabled: {
          background: colors.alert.alertA,
          color: colors.text.text1,
        },
        hovered: {
          background: colors.alert.alertA2,
          color: colors.text.text1,
        },
        focused: {
          background: colors.alert.alertA2,
          color: colors.text.text1,
        },
        pressed: {
          background: colors.alert.alertA3,
          color: colors.text.text1,
        },
        loading: {
          background: colors.alert.alertA3,
          color: colors.text.text1,
        },
      },
    },
    outlined: {
      system: {
        enabled: {
          background: "transparent",
          color: colors.text.text1,
          boxShadow: `inset 0 0 0 2px ${colors.text.text1}`,
        },
        hovered: {
          background: colors.base.translucent10,
          color: colors.text.text1,
          boxShadow: `inset 0 0 0 2px ${colors.text.text1}`,
        },
        focused: {
          background: colors.base.translucent10,
          color: colors.text.text1,
          boxShadow: `inset 0 0 0 2px ${colors.text.text1}`,
        },
        pressed: {
          background: colors.base.translucent20,
          color: colors.text.text1,
          boxShadow: `inset 0 0 0 2px ${colors.text.text1}`,
        },
        loading: {
          background: colors.base.translucent20,
          color: colors.text.text1,
          boxShadow: `inset 0 0 0 2px ${colors.text.text1}`,
        },
      },
      base: {
        enabled: {
          background: "transparent",
          color: colors.text.text1,
          boxShadow: `inset 0 0 0 2px ${colors.base.translucent10}`,
        },
        hovered: {
          background: colors.base.translucent10,
          color: colors.text.text1,
          boxShadow: `inset 0 0 0 2px ${colors.base.translucent20}`,
        },
        focused: {
          background: colors.base.translucent10,
          color: colors.text.text1,
          boxShadow: `inset 0 0 0 2px ${colors.base.translucent20}`,
        },
        pressed: {
          background: colors.base.translucent20,
          color: colors.text.text1,
          boxShadow: `inset 0 0 0 2px ${colors.base.translucent20}`,
        },
        loading: {
          background: colors.base.translucent20,
          color: colors.text.text1,
          boxShadow: `inset 0 0 0 2px ${colors.base.translucent20}`,
        },
      },
      primary: {
        enabled: {
          background: "transparent",
          color: theme.theme.primaryA,
          boxShadow: `inset 0 0 0 2px ${theme.theme.primary20}`,
        },
        hovered: {
          background: theme.theme.primary10,
          color: theme.theme.primaryA,
          boxShadow: `inset 0 0 0 2px ${theme.theme.primary20}`,
        },
        focused: {
          background: theme.theme.primary10,
          color: theme.theme.primaryA,
          boxShadow: `inset 0 0 0 2px ${theme.theme.primary20}`,
        },
        pressed: {
          background: theme.theme.primary20,
          color: theme.theme.primaryA,
          boxShadow: `inset 0 0 0 2px ${theme.theme.primary20}`,
        },
        loading: {
          background: theme.theme.primary20,
          color: theme.theme.primaryA,
          boxShadow: `inset 0 0 0 2px ${theme.theme.primary20}`,
        },
      },
      danger: {
        enabled: {
          background: "transparent",
          color: colors.alert.alertA,
          boxShadow: `inset 0 0 0 2px ${colors.alert.alertA}`,
        },
        hovered: {
          background: "transparent",
          color: colors.alert.alertA2,
          boxShadow: `inset 0 0 0 2px ${colors.alert.alertA2}`,
        },
        focused: {
          background: "transparent",
          color: colors.alert.alertA2,
          boxShadow: `inset 0 0 0 2px ${colors.alert.alertA2}`,
        },
        pressed: {
          background: "transparent",
          color: colors.alert.alertA3,
          boxShadow: `inset 0 0 0 2px ${colors.alert.alertA3}`,
        },
        loading: {
          background: "transparent",
          color: colors.alert.alertA3,
          boxShadow: `inset 0 0 0 2px ${colors.alert.alertA3}`,
        },
      },
    },
    ghost: {
      system: {
        enabled: {
          background: "transparent",
          color: colors.text.text1,
        },
        hovered: {
          background: colors.base.translucent10,
          color: colors.text.text1,
        },
        focused: {
          background: colors.base.translucent10,
          color: colors.text.text1,
        },
        pressed: {
          background: colors.base.translucent20,
          color: colors.text.text1,
        },
        loading: {
          background: colors.base.translucent20,
          color: colors.text.text1,
        },
      },
      base: {
        enabled: {
          background: "transparent",
          color: colors.text.text2,
        },
        hovered: {
          background: colors.base.translucent10,
          color: colors.text.text1,
        },
        focused: {
          background: colors.base.translucent10,
          color: colors.text.text1,
        },
        pressed: {
          background: colors.base.translucent20,
          color: colors.text.text1,
        },
        loading: {
          background: colors.base.translucent20,
          color: colors.text.text1,
        },
      },
      primary: {
        enabled: {
          background: theme.theme.primaryGradientFadeRight,
          color: theme.theme.primaryA,
        },
        hovered: {
          background: theme.theme.primary30,
          color: theme.theme.primaryA,
        },
        focused: {
          background: theme.theme.primary30,
          color: theme.theme.primaryA,
        },
        pressed: {
          background: theme.theme.primary20,
          color: theme.theme.primaryA,
        },
        loading: {
          background: theme.theme.primary20,
          color: theme.theme.primaryA,
        },
      },
      danger: {
        enabled: {
          background: "transparent",
          color: colors.alert.alertA,
        },
        hovered: {
          background: "transparent",
          color: colors.alert.alertA2,
        },
        focused: {
          background: "transparent",
          color: colors.alert.alertA2,
        },
        pressed: {
          background: "transparent",
          color: colors.alert.alertA3,
        },
        loading: {
          background: "transparent",
          color: colors.alert.alertA3,
        },
      },
    },
  };
};

// Resolves the button styles based on variant, color, and state
// Used in Button.styles.ts
export const resolveButtonStyles = ({
  theme,
  variant,
  color,
  state,
}: ButtonStyleArgs): ButtonStyleItem => {
  const variants = getButtonVariants(theme);

  return variants[variant][color][state];
};
