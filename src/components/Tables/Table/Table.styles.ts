import styled from "styled-components";
import { designTokens } from "@app/design/tokens";
import { gradientBorder } from "@/app/design/mixens/gradientBorder";

const { colors, layout, gradients, borders, typography } = designTokens;

export const TableWrapper = styled.div`
  display: flex;
  width: 640px;
  min-width: 360px;
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

export const TableContent = styled.table`
  display: flex;
  padding: ${layout.space.medium};
  flex-direction: column;
  align-items: center;
  gap: ${layout.space.xSmall};
  align-self: stretch;
`;

export const TableContentHeader = styled.thead`
  display: flex;
  padding: 0 ${layout.space.xSmall};
  align-items: center;
  gap: ${layout.space.medium};
`;

export const PositionHeaderRow = styled.tr`
  width: 48px;
  height: 18px;
`;

export const ParticipantHeaderRow = styled.tr`
  flex: 1;
`;

export const TimeHeaderRow = styled.tr`
  width: 96px;
  height: 18px;
`;

export const RaceHeaderRow = styled.tr`
  width: 48px;
  height: 18px;
  text-align: center;
`;

export const PointsHeaderRow = styled.tr`
  width: 48px;
  height: 18px;
`;

export const HeaderCell = styled.td`
  ${typography.body.smallRegular};
  color: ${colors.text.text2};
`;

export const TableRows = styled.tr`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
`;