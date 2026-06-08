import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { layout } = designTokens;

export const ListContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 960px;
  flex-direction: column;
  align-items: center;
  gap: ${layout.space.large};
`;

export const GroupsGrid = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${layout.space.medium};
`;