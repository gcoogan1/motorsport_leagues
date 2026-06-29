import styled from "styled-components";
import { designTokens } from "@app/design/tokens";
import { gradientBorder } from "@/app/design/mixens/gradientBorder";

const { colors, layout, gradients, borders, typography } = designTokens;

export const TableWrapper = styled.div`
  display: flex;
  width: 100%;
  /* min-width: 360px; */
  max-width: 720px;
  flex-direction: column;
  align-items: center;
  border-radius: ${borders.radius.xxLarge};

  ${gradientBorder({
    gradient: gradients.base.fadeBottom10,
    width: borders.width.medium,
  })};
`;

export const TableHeader = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: ${layout.space.medium};
  border-bottom: ${borders.width.thin} solid ${colors.base.translucent10};
`;

export const TableTitle = styled.h2`
  ${typography.subtitle.medium};
  color: ${colors.text.text2};
`;

export const TableContent = styled.div`
  display: flex;
  padding: ${layout.space.medium};
  flex-direction: column;
  align-items: center;
  /* gap: ${layout.space.xSmall}; */
  align-self: stretch;
  min-width: 0;

  ${layout.mediaQueries.mobile} {
    padding: ${layout.space.medium};
  }
`;

export const TableContentHeader = styled.div`
  display: flex;
  width: 100%;
  padding: 0 ${layout.space.xSmall};
  padding-bottom: ${layout.space.xSmall};
  align-items: center;
  gap: ${layout.space.medium};
`;

export const PositionHeaderRow = styled.div`
  width: 48px;
  height: 18px;
  display: flex;
  justify-content: center;
`;

export const ParticipantHeaderRow = styled.div`
  flex: 1;
  min-width: 0;
  height: 18px;
`;

export const TimeHeaderRow = styled.div`
  width: 96px;
  height: 18px;
  flex-shrink: 0;
`;

export const RaceHeaderRow = styled.div`
  width: 48px;
  height: 18px;
  text-align: center;
  flex-shrink: 0;
`;

export const PointsHeaderRow = styled.div`
  width: 48px;
  flex-shrink: 0;
`;

export const HeaderCell = styled.div`
  ${typography.body.smallRegular};
  color: ${colors.text.text2};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const TableRows = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  min-width: 0;
`;