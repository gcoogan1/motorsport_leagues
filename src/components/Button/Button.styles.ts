import styled, { css, type DefaultTheme, keyframes } from "styled-components";
import { designTokens } from "@/app/design/tokens";
import type {
  ButtonColor,
  ButtonState,
  ButtonVariant,
} from "./Button.variants";
import { resolveButtonStyles } from "./Button.variants";

const { layout, borders, typography } = designTokens;

// Spinner animation for loading state
const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const Spinner = styled.span`
  width: 20px;
  height: 20px;
  border: 3px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 2s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

// Generates the CSS styles for a given button state using the variant resolver from Button.variants.ts
const buttonStateStyles = ({
  theme,
  variant,
  color,
  state,
  isLoading,
}: {
  theme: DefaultTheme;
  variant: ButtonVariant;
  color: ButtonColor;
  state: ButtonState;
  isLoading?: boolean;
}) => {
  // If button is loading, always use the "loading" state styles
  const resolvedState = isLoading ? "loading" : state;

  const styles = resolveButtonStyles({
    theme,
    variant,
    color,
    state: resolvedState,
  });

  const boxShadow = styles.boxShadow
    ? `box-shadow: ${styles.boxShadow};`
    : "box-shadow: none;";

  return `
    background: ${styles.background};
    color: ${styles.color};
    ${boxShadow}
  `;
};

// Styled button component with dynamic styles based on props
export const StyledButton = styled.button<{
  $variant: ButtonVariant;
  $color: ButtonColor;
  $size: "small" | "medium";
  $rounded: boolean;
  $isLoading?: boolean;
  $fullWidth?: boolean;
}>`
  // -- Basic button styles -- //

  ${typography.body.mediumBold} display: inline-flex;
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
  align-items: center;
  border: none;
  justify-content: center;
  gap: ${layout.space.xxSmall};
  cursor: pointer;
  outline: none;
  border-radius: ${({ $rounded }) =>
    $rounded ? borders.radius.round : borders.radius.medium};
  padding: ${({ $size }) => {
    return $size === "small"
      ? `${layout.space.xSmall} ${layout.space.small}`
      : `${layout.space.medium}`;
  }};

  // -- Make Loading Icon Spin -- //
  ${({ $isLoading }) =>
    $isLoading &&
    css`
      pointer-events: none;

      svg {
        animation: ${spin} 2s linear infinite;
      }
    `} 
    
  
    // -- Dynamic styles based on button state -- //
  // Note: Theme is automatically provided by styled-components useing the ThemeProvider in App.tsx
  // Enabled state (default)
  ${({ theme, $variant, $color, $isLoading }) =>
    buttonStateStyles({
      theme,
      variant: $variant,
      color: $color,
      state: "enabled",
      isLoading: $isLoading,
    })}  // Hover state
    &:hover {
    ${({ theme, $variant, $color, $isLoading }) =>
      buttonStateStyles({
        theme,
        variant: $variant,
        color: $color,
        state: "hovered",
        isLoading: $isLoading,
      })};
  }

  // Focus state
  &:focus-visible {
    ${({ theme, $variant, $color, $isLoading }) =>
      buttonStateStyles({
        theme,
        variant: $variant,
        color: $color,
        state: "focused",
        isLoading: $isLoading,
      })} outline: 2px solid ${({ theme }) => theme.colors.utility.focus};
    outline-offset: 2px;
  }

  // Pressed state
  &:active {
    ${({ theme, $variant, $color, $isLoading }) =>
      buttonStateStyles({
        theme,
        variant: $variant,
        color: $color,
        state: "pressed",
        isLoading: $isLoading,
      })};
  }
`;
