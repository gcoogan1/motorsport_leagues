import styled, { css } from "styled-components";

import { designTokens } from "@/app/design/tokens";

const { layout } = designTokens;

export const LineupContainer = styled.div<{ $isEmpty: boolean }>`
  display: flex;
  width: 100%;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
  gap: ${layout.space.xxLarge};

  ${(props) => props.$isEmpty && css`
    justify-content: center;
    align-items: center;
    text-align: center;
    align-content: center;
  `}
`;