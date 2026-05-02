import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";


const { layout } = designTokens;

export const TabsContainer = styled.div`
  display: flex;
  max-width: 1200px;
  align-items: center;
  width: 100%;

  ${layout.mediaQueries.mobile} {
    max-width: 919px;
    width: 100%;
    min-width: 360px;
    flex-direction: column-reverse;
    gap: ${layout.space.xSmall};
  }
`
