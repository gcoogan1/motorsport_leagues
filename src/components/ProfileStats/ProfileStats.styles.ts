import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";
import { bothFadeBorders } from "@/app/design/mixens/edgeFadeBorder";

const { colors, gradients, layout, borders, typography } = designTokens;

export const ProfileStatsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${layout.space.xLarge} 0;
  column-gap: ${layout.space.xxxLarge};
  row-gap: 16px;
  flex-wrap: wrap;
  

  //-- Faded Top and Bottom Borders -- //
  ${bothFadeBorders({ gradient: gradients.base.fadeOutHorizontal10, width: borders.width.medium })}

  ${layout.mediaQueries.mobile} {
    flex-direction: column;
    column-gap: ${layout.space.medium};
  }
`;

export const ProfileStat = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${layout.space.small};
`;

export const StatNumber = styled.h3`
  ${typography.title.large};
  color: ${colors.text.text1};
`;

export const StatLabelsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

export const StatLabel = styled.p`
  ${typography.subtitle.smallItalic};
  color: ${colors.text.text2};
`;