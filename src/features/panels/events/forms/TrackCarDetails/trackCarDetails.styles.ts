import styled from "styled-components";
import { designTokens } from "@app/design/tokens";

const { colors, layout, typography } = designTokens;

export const TableWrapper = styled.table`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-width: 0;
  gap: ${layout.space.xSmall};
  border-collapse: collapse;
`;

export const TableBody = styled.tbody`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${layout.space.xSmall};
`;

export const ColumnText = styled.span`
  ${typography.body.smallRegular} color: ${colors.text.text2};
`;

export const TableRow = styled.tr`
  display: flex;
  width: 100%;
  min-width: 0;
  align-items: center;
  gap: ${layout.space.xSmall};
  align-self: stretch;
  ${layout.mediaQueries.mobile} {
    gap: ${layout.space.xxxSmall};
  }
`;

export const ExtraCell = styled.td`
  display: flex;
  width: 44px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

export const CategoryHeader = styled.thead`
  display: flex;
  width: 100%;
  align-items: flex-start;
  gap: ${layout.space.xSmall};
`;

export const CategoryCell = styled.td`
  display: flex;
  min-width: 120px;
  width: 100%;
  max-width: 240px;
  align-items: center;
  flex: 1 0 0;
  text-align: left;
  ${layout.mediaQueries.mobile} {
    min-width: 0;
    max-width: none;
    flex: 1 1 0;
  }
`;

export const CategoryColumn = styled.th`
  display: flex;
  min-width: 120px;
  max-width: 240px;
  align-items: center;
  flex: 1 0 0;
  text-align: left;
  ${layout.mediaQueries.mobile} {
    min-width: 0;
    max-width: none;
    flex: 1 1 0;
  }
`;

