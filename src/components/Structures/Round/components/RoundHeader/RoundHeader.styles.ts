import styled from "styled-components";

import { designTokens } from "@/app/design/tokens";

const { colors, layout, borders, typography } = designTokens;

export const HeaderContainer = styled.div`
  display: flex;
  width: 100%;
  min-width: 296px;
  min-height: 100px;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  row-gap: 8px;
  overflow: hidden;
  padding-top: ${layout.space.large};
  padding-bottom: ${layout.space.large};
  padding-left: ${layout.space.xLarge};
  padding-right: ${layout.space.large};
  background: ${({ theme }) => theme.theme.primaryGradientFadeRight};
  border-bottom: ${borders.width.medium} solid ${colors.base.base4};
  border-top-left-radius: ${borders.radius.xxLarge};
  border-top-right-radius: ${borders.radius.xxLarge};

  ${layout.mediaQueries.mobile} {
    flex-direction: column;
    align-items: flex-start;
  };
`

export const TextContainer = styled.div`
  display: flex;
  justify-content: center;
  justify-content: left;
  align-items: center;
  gap: 10px;
`

export const Title = styled.h1`
  ${typography.title.medium};
  color: ${({ theme }) => theme.theme.primaryA};

  ${layout.mediaQueries.mobile} {
    ${typography.title.small};
  }
`

export const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${layout.space.xSmall};
`