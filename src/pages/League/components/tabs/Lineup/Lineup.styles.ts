import styled, { css } from "styled-components";

import { designTokens } from "@/app/design/tokens";

const { layout } = designTokens;

export const LineupContainer = styled.div<{ $isEmpty: boolean, isDriversTab?: boolean }>`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: flex-start;
  align-content: flex-start;
  align-self: stretch;
  flex-wrap: wrap;
  gap: ${layout.space.xxLarge};

  ${(props) => props.$isEmpty && css`
    justify-content: center;
    align-items: center;
    text-align: center;
    align-content: center;
  `}

  ${layout.mediaQueries.mobile} {
    ${(props) => props.isDriversTab && css`
        gap: ${layout.space.xLarge};
    `}
    gap: ${layout.space.xLarge};
  }
`;

export const DriverColumns = styled.div`
  display: flex;
  width: 100%;
  align-items: flex-start;
  gap: ${layout.space.xxLarge};

  ${layout.mediaQueries.mobile} {
    display: none;
  }
`;

export const MobileDriverLineup = styled(LineupContainer)`
  display: none;

  ${layout.mediaQueries.mobile} {
    display: flex;
    gap: ${layout.space.xSmall};
  }
`;


export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${layout.space.xxLarge};
  flex: 1 0 0;

  ${layout.mediaQueries.mobile} {
    display: none;
  }
`;

export const RightColumn = styled.div`
  display: flex;
  padding-top: ${layout.space.xxLarge};
  flex-direction: column;
  align-items: flex-start;
  gap: ${layout.space.xxLarge};
  flex: 1 0 0;

  ${layout.mediaQueries.mobile} {
    display: none;
  }
`;