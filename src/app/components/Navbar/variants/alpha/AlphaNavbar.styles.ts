import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { layout } = designTokens;

export const LeftContainer = styled.div`
  flex: 1;
  align-items: center;
  gap: ${layout.space.xSmall};
  display: flex;
  justify-content: center;
  align-items: flex-start;
  align-self: stretch;
`;