import styled from "styled-components";
import { designTokens } from "@app/design/tokens";
import { bottomFadeBorder } from "@/app/design/mixens/edgeFadeBorder";

const { colors, gradients, layout, typography, borders } = designTokens;

export const ChampPointsContainer = styled.div`
  display: flex;
  width: 960px;
  max-width: 960px;
  padding: ${layout.space.xxLarge} 0;
  justify-content: center;
  align-items: flex-start;
  align-content: flex-start;
  gap: ${layout.space.xxLarge};
  flex-wrap: wrap;
`;

// Detail Blocks
export const DetailBlocksContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 280px;
  padding: ${layout.space.xLarge} 0;
  flex-direction: column;
  align-items: flex-start;
  gap: ${layout.space.xxLarge};
  flex-shrink: 0;
`;

export const DetailBlockContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${layout.space.xSmall};
  align-self: stretch;
`

export const Detail = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
`;

export const NumberText = styled.h2`
  ${typography.title.medium};
  color: ${( theme ) => theme.theme.theme.primaryA};
`;

export const TitleText = styled.h3`
  ${typography.subtitle.medium};
  color: ${colors.base.text1};
`;

export const DescriptionText = styled.p`
  ${typography.body.mediumRegular};
  color: ${colors.base.text2};
`;

// Champ Points Table
export const TableContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 280px;
  flex-direction: column;
  align-items: flex-start;
  flex-shrink: 0;
`;

export const TableHeader = styled.div`
  display: flex;
  padding: 0 ${layout.space.small};
  align-items: flex-start;
  align-self: stretch;
  background: ${gradients.base.fadeBottom10};
  border-bottom: ${borders.width.medium} solid transparent;
`;

export const Headers = styled.div`
  display: flex;
  padding: ${layout.space.large} 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1 0 0;
`;

export const HeaderText = styled.h3`
  ${typography.subtitle.medium};
  color: ${colors.base.text2};
`;

export const TableBody = styled.div`
  display: flex;
  padding: ${layout.space.xSmall} ${layout.space.small};
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
`;

export const TableRow = styled.div`
  display: flex;
  align-items: center;
  align-self: stretch;

  ${bottomFadeBorder({
    gradient: gradients.base.fadeOutHorizontal10,
    width: borders.width.medium,
  })};
`;

export const RowContent = styled.div`
  display: flex;
  padding: ${layout.space.xSmall} 0;
  text-align: center;
  justify-content: center;
  align-items: center;
  flex: 1 0 0;
`;

export const RowText = styled.p`
  ${typography.body.mediumBold};
  color: ${colors.base.text1};
`;