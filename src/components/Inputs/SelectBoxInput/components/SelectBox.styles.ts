import styled, { css } from "styled-components";
import { designTokens } from "@/app/design/tokens";
import { gradientBorder } from "@/app/design/mixens/gradientBorder";

const { colors, gradients, borders, layout, typography } = designTokens;

export const SelectBoxContainer = styled.button<{ $isSelected?: boolean }>`
  /* Reset Styles */
  appearance: none;
  border: none;
  background: none;
  padding: 0;
  font: inherit;
  color: inherit;
  z-index: 0;
  overflow: hidden;
  cursor: pointer;

  width: 100%;
  display: flex;
  border-radius: ${borders.radius.large};
  border: ${borders.width.thin} solid ${colors.base.translucent10};
  background: transparent;
  gap: ${layout.space.xSmall};
  width: 100%;
  padding: ${layout.space.medium};
  align-items: center;

  &:hover {
    border-color: ${colors.base.translucent10};
    background: ${gradients.base.fadeRight10};
  }

  &:focus-visible {
    outline: 2px solid ${colors.utility.focus};
    outline-offset: 2px;
  }

  &:active {
    background: ${colors.base.translucent10};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  ${({ $isSelected }) => $isSelected && css`
    ${gradientBorder({ gradient: gradients.base.fadeRight20, width: borders.width.medium })};
    background: ${colors.base.translucent10};

    &:hover {
      ${gradientBorder({ gradient: 'transparent', width: borders.width.medium })};
      background: ${colors.base.translucent10};
      border: ${borders.width.medium} solid ${colors.base.translucent20};
    }

    &:active {
      background: ${colors.base.translucent10};
      border: ${borders.width.medium} solid transparent;
    }
  `}
`;

export const SelectBoxContent = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  flex: 1;
  justify-items: center;
  align-items: flex-start;
  gap: ${layout.space.xSmall};
`;

export const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const Label = styled.p`
${typography.body.mediumBold}
  color: ${colors.text.text1};
`;

export const HelperMessage = styled.span`
  ${typography.body.smallRegular}
  color: ${colors.text.text2};
`;

export const IconContainer = styled.span`
  align-self: center;
`;