import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";


const { layout } = designTokens;

export const TabsContainer = styled.div`
  display: flex;
  max-width: 1200px;
  align-items: center;
  width: 100%;
  position: relative;
  min-width: 0;

  ${layout.mediaQueries.mobile} {
    display: grid;
    grid-template-columns: 100%;
    gap: ${layout.space.xSmall};
    justify-items: center;
  }
`;

export const SeasonSelectWrapper = styled.div`
  position: absolute;
  right: 0;
  top: 8px;

  ${layout.mediaQueries.mobile} {
    position: static; 
    grid-row: 1;
    align-self: center;
  }
`;
