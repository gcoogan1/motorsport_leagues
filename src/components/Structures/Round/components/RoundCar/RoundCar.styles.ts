import styled from "styled-components";

import { designTokens } from "@/app/design/tokens";


const { layout, gradients, borders } = designTokens;

export const CarContainer = styled.div<{ imageUrl: string }>`
  display: flex;
  width: 384px;
  height: 216px;
  min-width: 344px;
  max-width: 384px;
  min-height: 193.5px;
  max-height: 216px;
  padding: ${layout.space.small};
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  aspect-ratio: 16/9;
  border-radius: ${borders.radius.xxLarge};
  border: ${borders.width.medium} solid ${gradients.base.fadeTop10};
  background: url(${props => props.imageUrl}) lightgray 50% / cover no-repeat;

  ${layout.mediaQueries.mobile} {
    width: 100%;
    min-width: 0;
    height: auto;
    min-height: 0;
    box-sizing: border-box;
  }
`;

export const ActionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  align-content: flex-start;
  row-gap: ${layout.space.xxxSmall};
  align-self: stretch;
  flex-wrap: wrap;

  ${layout.mediaQueries.mobile} {
    width: 100%;
    justify-content: center;
  }
`