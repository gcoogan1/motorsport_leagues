import styled, { css } from "styled-components";
import { designTokens } from "@app/design/tokens";

const { colors, borders, layout, typography } = designTokens;

export const LinkContainer = styled.button<{ $isSelected?: boolean }>`
  appearance: none;
  border: none;
  margin: 0;
  font: inherit;
  text-align: left;

  display: flex;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  width: 100%;
  max-width: 240px;
  padding: ${layout.space.medium} ${layout.space.xLarge};
  gap: ${layout.space.xSmall};
  background: transparent;
  color: ${colors.text.text1};
  cursor: pointer;

  ${({ $isSelected, theme }) =>
    $isSelected &&
    css`
      background: ${theme.theme.primaryGradientFadeLeft};
      box-shadow:
        inset 0 0 0 0 ${theme.theme.primary20},
        inset - ${borders.width.thick} 0 0 0 ${theme.theme.primaryA};
      color: ${theme.theme.primaryA};
    `};

  &:hover {
    background: ${({ $isSelected, theme }) =>
      $isSelected
        ? theme.theme.primaryGradientFadeLeft
        : theme.theme.primaryGradientFadeLeft50};
  }

  &:active {
    background: ${({ $isSelected, theme }) =>
      $isSelected
        ? theme.theme.primary30
        : theme.theme.primaryGradientFadeLeft};
  }

  &:focus-visible {
    outline: 2px solid ${colors.utility.focus};
    outline-offset: 2px;
  }
`;

export const LinkLabel = styled.p`
  ${typography.body.mediumBold} color: inherit;
  margin: 0;
`;
