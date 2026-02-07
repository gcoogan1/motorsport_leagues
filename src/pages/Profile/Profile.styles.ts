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

export const Content = styled.div`
  width: 100%;
  padding: ${layout.space.xxLarge} ${layout.space.xLarge};
  gap: ${layout.space.xxLarge};
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  gap: 64px;
`;

export const ListContainer = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  align-self: stretch;
  width: 100%;
  gap: ${layout.space.xxLarge};
`;