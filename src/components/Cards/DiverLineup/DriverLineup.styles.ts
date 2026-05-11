import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";
import { gradientBorder } from "@/app/design/mixens/gradientBorder";

const { colors, gradients, layout, borders, typography } = designTokens;

export const DriverLineupWrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  max-width: 480px;
  width: 100%;
  border-radius: ${borders.radius.xxLarge};
  padding: ${layout.space.medium};
  ${({ theme }) => gradientBorder({ gradient: theme.theme.primaryGradientFadeBottom30, width: borders.width.medium })};
`

export const CardTitle = styled.div`
  position: absolute;
  left: 20px;
  top: -9px;
  display: flex;
  padding: 0 ${layout.space.xSmall};
  align-items: center;
  gap: 10px;
  background: ${colors.base.base2};
`;

export const TitleText = styled.p`
  ${typography.title.smallBold};
  ${({ theme }) => `color: ${theme.theme.primary30};`};
  margin: 0;
`;

export const DriverButton = styled.button`
  display: flex;
  align-items: start;
  width: 100%;
  gap: ${layout.space.small};
  padding: ${layout.space.small} ${layout.space.medium};
  border-radius: ${borders.radius.large};
  background: transparent;
  border: none;
  cursor: pointer;

  &:hover {
    background: ${gradients.base.fadeRight10};
  }

  &:focus-visible {
    background: ${gradients.base.fadeRight10};
    outline: 2px solid ${colors.utility.focus} !important;
    outline-offset: 2px;
    z-index: 2;
  }

  &:active {
    background: ${colors.base.translucent10};
  }

`;