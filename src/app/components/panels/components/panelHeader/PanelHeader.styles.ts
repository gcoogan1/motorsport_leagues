import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";
import { gradientBorderBottom } from "@/app/design/mixens/gradientBorderBottom";

const { colors, borders, gradients, layout, typography } = designTokens;

export const PanelHeaderContainer = styled.div<{ showShadow?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  padding: ${layout.space.large};
  gap: ${layout.space.medium};
  background: ${gradients.base.fadeRight10};
  width: 432px;
  border-top-left-radius: ${borders.radius.xxLarge};
  border-top-right-radius: ${borders.radius.xxLarge};

  /* Shadow */
  overflow: visible;
  box-shadow: ${({ showShadow }) =>
  showShadow ? `0px 40px 40px 0px ${colors.base.base3}` : "none"};


  /* Gradient Border Bottom */
  ${gradientBorderBottom({
    gradient: gradients.base.fadeRight10,
    width: borders.width.thin,
  })}
`;

export const PanelTitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${layout.space.xSmall};
  flex: 1 0 0;
  color: ${colors.text.text1};
`;

export const PanelTitle = styled.h2`
  ${typography.subtitle.xLargeItalic};
  color: ${colors.text.text1};
`;
