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