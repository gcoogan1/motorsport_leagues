import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { layout } = designTokens;

export const SelectBoxInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${layout.space.xSmall};
  width: 100%;
`;