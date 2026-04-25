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

/* Table Sections */
export const ResultHeader = styled.thead`
  display: flex;
  width: 100%;
  align-items: flex-start;
  gap: ${layout.space.xSmall};
`;

export const ParticipantHeader = styled.thead`
  display: flex;
  width: 100%;
  align-items: flex-start;
  gap: ${layout.space.xSmall};
`

export const CarHeader = styled.thead`
  display: flex;
  width: 100%;
  align-items: flex-start;
  gap: ${layout.space.xSmall};
`;


/* Result Header Columns */
export const PComlumn = styled.th`
  display: flex;
  width: 48px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  text-align: center;
`;

export const DriverColumn = styled.th`
  display: flex;
  align-items: center;
  flex: 1;
  text-align: left; 
`;

export const TimeColumn = styled.th`
  display: flex;
  width: 120px;
  align-items: center;
  flex-shrink: 0;
  text-align: left; 
`;

export const PointsColumn = styled.th`
  display: flex;
  width: 64px;
  align-items: center;
  flex-shrink: 0;
  text-align: left; 
`;

export const ExtraColumn = styled.th`
  display: flex;
  width: 44px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`

/* Result Body Cells */
export const PCell = styled.td`
  display: flex;
  width: 48px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  text-align: center;
`;

export const PText = styled.p`
  ${typography.subtitle.xLargeItalic}
  color: ${colors.text.text1};
`;

export const DriverCell = styled.td`
  display: flex;
  min-width: 88px;
  align-items: center;
  flex: 1;
  text-align: left;
`;

export const TimeCell = styled.td`
  display: flex;
  width: 120px;
  align-items: center;
  flex-shrink: 0;
  text-align: left;
`;

export const PointsCell = styled.td`
  display: flex;
  width: 64px;
  align-items: center;
  flex-shrink: 0;
  text-align: left;
`;


export const ExtraCell = styled.td`
  display: flex;
  width: 44px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;


/* Participant Header Columns */
export const NumberColumn = styled.th`
  display: flex;
  width: 48px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  text-align: center; 
  ${layout.mediaQueries.mobile} {
    width: 40px;
  }
`;

export const ParticipantColumn = styled.th`
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

export const RoleColumn = styled.th`
  display: flex;
  min-width: 0;
  align-items: center;
  flex: 1 0 0;
  text-align: left; 
`;

/* Participant Body Cells */
export const NumberCell = styled.td`
  display: flex;
  width: 48px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  text-align: center; 
  ${layout.mediaQueries.mobile} {
    width: 40px;
  }
`;

export const NumberText = styled.p`
  ${typography.subtitle.medium}
  color: ${colors.text.text2};
`;

export const ParticipantCell = styled.td`
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

export const RoleCell = styled.td`
  display: flex;
  min-width: 0;
  align-items: center;
  flex: 1 0 0;
  text-align: left; 
  ${layout.mediaQueries.mobile} {
    min-width: 80px;
    max-width: 120px;
    width: 100px;
    & > div {
      min-width: 80px;
      max-width: 120px;
      width: 100px;
    }
  }
`;  


/* Car Header Columns */
export const CategoryColumn = styled.th`
  display: flex;
  width: 88px;
  align-items: center;
  flex-shrink: 0;
  text-align: left; 
  ${layout.mediaQueries.mobile} {
    width: 36px;
  }
`;

export const ModelColumn = styled.th`
  display: flex;
  align-items: center;
  flex: 1 0 0;
  text-align: left; 
`;


/* Car Body Cells */
export const CategoryCell = styled.td`
  display: flex;
  width: 88px;
  align-items: center;
  flex-shrink: 0;
  text-align: left; 
`;

export const ModelCell = styled.td`
  display: flex;
  align-items: center;
  flex: 1 0 0;
  text-align: left; 
`;


/* Main Styles */
export const TableBody = styled.tbody`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${layout.space.xSmall};
`;

export const ColumnText = styled.span`
  ${typography.body.smallRegular}
  color: ${colors.text.text2};
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
`