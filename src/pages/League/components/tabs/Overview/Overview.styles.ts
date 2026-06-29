import styled from "styled-components";

import { designTokens } from "@/app/design/tokens";

const { layout } = designTokens;

export const OverviewContainer = styled.div`
  display: flex;
  max-width: 960px;
  flex-direction: column;
  align-items: center;
  gap: ${layout.space.xxLarge};
`;

export const ContentBlocksContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${layout.space.xxLarge};
  align-self: stretch;
`;