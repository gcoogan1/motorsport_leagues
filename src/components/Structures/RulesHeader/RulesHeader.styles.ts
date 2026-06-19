import styled, { css } from "styled-components";

import { designTokens } from "@/app/design/tokens";
import { bottomFadeBorder } from "@/app/design/mixens/edgeFadeBorder";

const { colors, gradients, layout, typography, borders } = designTokens;

export const Container = styled.div`
  display: flex;
  flex: 1 0 0;
  width: 100%;
  max-width: 640px;
  padding: ${layout.space.xLarge};
  align-items: flex-start;
  align-content: flex-start;
  gap: ${layout.space.medium} ${layout.space.xLarge};
  flex-wrap: wrap;
  border-top-right-radius: ${borders.radius.xLarge};
  border-top-left-radius: ${borders.radius.xLarge};

  ${bottomFadeBorder({
    gradient: gradients.base.fadeRight10,
    width: borders.width.medium,
  })};

  ${(theme) =>
    css`
      background: ${theme.theme.theme.primaryGradientFadeRight50};
    `};
`;

export const TextContainer = styled.div`
  display: flex;
  min-width: 220px;
  flex-direction: column;
  align-items: flex-start;
  gap: ${layout.space.xSmall};
  flex: 1 0 0;
`;

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${layout.space.xxxSmall};
`;

export const SubTitle = styled.div`
  ${typography.subtitle.mediumItalic};
  color: ${({ theme }) => theme.theme.primary30};
`;

export const Title = styled.div`
  ${typography.title.medium};
  color: ${colors.text.text1};
`;

export const Time = styled.div`
  ${typography.body.tinyRegular};
  color: ${colors.text.text2};
`;
