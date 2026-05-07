import styled from "styled-components";
import { designTokens } from "@app/design/tokens";

const { layout } = designTokens;

export const ListContainer = styled.div`
  display: flex;
  max-width: 360px;
  align-items: center;
  flex-direction: column;
  align-self: center;
  width: 100%;
  gap: ${layout.space.medium};
`;

export const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  gap: ${layout.space.xSmall};
  align-items: flex-start;
  align-content: flex-start;
  align-self: stretch;
  
  ${layout.mediaQueries.mobile} {
    flex-direction: column;
  }
`;