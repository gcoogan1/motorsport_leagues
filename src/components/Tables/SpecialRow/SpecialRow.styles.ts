import styled from "styled-components";
import { designTokens } from "@app/design/tokens";
import { gradientBorder } from "@/app/design/mixens/gradientBorder";

const { colors, gradients, layout, borders, typography } = designTokens;

export const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding-top: ${layout.space.xSmall};
  padding-bottom: ${layout.space.xSmall};
  padding-left: ${layout.space.xLarge};
  padding-right: ${layout.space.xSmall};

  border-top-right-radius: ${borders.radius.xxLarge};
  border-bottom-right-radius: ${borders.radius.xxLarge};
  
  ${gradientBorder({
    gradient: gradients.base.fadeLeft10,
    width: `${borders.width.thick}`,
  })}
`;

export const Label = styled.h2`
  ${typography.subtitle.mediumItalic};
  color: ${colors.text.text2};
`;

export const ValueContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-right-radius: ${borders.radius.large};
  border-bottom-right-radius: ${borders.radius.large};
  padding: ${layout.space.medium} ${layout.space.xLarge};
  gap: 10px;
  background-color: ${({ theme }) => theme.theme.primaryGradientFadeLeft50};
`;

export const Value = styled.h2`
  ${typography.subtitle.largeItalic};
  color: ${({ theme }) => theme.theme.primaryA};
`;