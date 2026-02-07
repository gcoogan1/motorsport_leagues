import styled from "styled-components";

import { designTokens } from "@/app/design/tokens";
import { bottomFadeBorder } from "@/app/design/mixens/edgeFadeBorder";

const { colors, gradients, layout, typography, borders } = designTokens;

export const CardListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  border-radius: ${borders.radius.xxxLarge};
  background: ${gradients.base.fadeTop10};
`;

export const HeaderContainer = styled.div`
  width: 100%;
  padding: ${layout.space.medium} 0px;
  display: flex;
  justify-content: center;
  align-items: center;

  ${bottomFadeBorder({
    gradient: gradients.base.fadeOutHorizontal10,
    width: borders.width.medium,
  })};
`;

export const Title = styled.h2`
  ${typography.title.medium};
  color: ${colors.text.text2};
  text-align: center;
`;

export const ListContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  align-content: flex-start;
  flex-wrap: wrap;
  gap: ${layout.space.xLarge};
  padding: ${layout.space.xLarge};
  border: ${borders.width.medium} solid transparent;
  border-radius: ${borders.radius.xxxLarge};
`;