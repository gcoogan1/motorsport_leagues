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

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0px ${layout.space.xLarge};
  gap: ${layout.space.xxLarge};

`;