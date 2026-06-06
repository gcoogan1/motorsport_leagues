import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { layout } = designTokens;

export const RowContainer = styled.div`
  display: flex;
  width: 100%;
  min-width: 360px;
  align-items: flex-start;
  align-content: flex-start;
  gap: ${layout.space.medium};

  ${layout.mediaQueries.mobile} {
    flex-wrap: wrap;
  }
`;