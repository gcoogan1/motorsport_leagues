import styled from "styled-components";

import { designTokens } from "@/app/design/tokens";
import ML_Gold_Icon from "@assets/Logos/MS/ML_Gold_Icon.svg?react";

const { colors, layout, theme, typography, borders } = designTokens;

export const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding: ${layout.space.xxxLarge};
  background-color: ${colors.base.base2};

  ${layout.mediaQueries.mobile} {
    padding: ${layout.space.xxLarge};
  }
`;

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${layout.space.medium};
  background: ${theme.yellow.primaryGradientFadeTop10};
  border-bottom-right-radius: ${borders.radius.xxxLarge};
  border-bottom-left-radius: ${borders.radius.xxxLarge};
`;

export const Logo = styled(ML_Gold_Icon)`
  width: 120px;
  height: 120px;
`;

export const SubTitle = styled.h2`
  ${typography.subtitle.largeItalic};
  background: ${theme.yellow.primaryGradientFadeBottom};
  text-align: center;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  display: inline-block;
`;