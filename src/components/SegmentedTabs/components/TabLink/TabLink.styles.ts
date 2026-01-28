import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { colors, layout, borders, typography, effects } = designTokens;

export const ButtonLinkContainer = styled.button<
  { $isSelected: boolean; $shouldExpand?: boolean }
>`
  padding: ${layout.space.small} ${layout.space.large};
  border: none;
  border-radius: ${borders.radius.round};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${layout.space.xSmall};
  cursor: pointer;

  // Dynamic flex based on expansion and primary props
  ${({ $shouldExpand }) => {

    return `
    flex: ${$shouldExpand ? "3 1 0%" : "1 1 0%"};
    `;
  }} min-width: max-content;

  background: ${({ $isSelected }) =>
    $isSelected ? colors.text.text1 : "transparent"};

  color: ${({ $isSelected }) =>
    $isSelected ? colors.base.base3 : colors.text.text2};
  ${typography.subtitle.medium} // -- Box shadow for selected state -- //
  ${({ $isSelected }) =>
    $isSelected && effects.boxShadow.glowWhite}  // Hover state
    &:hover {
    background: ${({ $isSelected }) =>
      $isSelected ? colors.text.text2 : colors.base.translucent10};
  }

  // Focus state
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.utility.focus};
    outline-offset: 2px;
  }

  // Pressed state
  &:active {
    background: ${({ $isSelected }) =>
      $isSelected ? colors.text.text3 : colors.base.translucent20};
  }
`;
