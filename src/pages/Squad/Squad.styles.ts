import styled from "styled-components";

import { designTokens } from "@/app/design/tokens";

const { colors, layout } = designTokens;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
  flex: 1;
  background-color: ${colors.base.base2};
`;

export const Contents = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: ${layout.space.xxLarge} ${layout.space.xLarge};
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  gap: ${layout.space.xxLarge};
`;
