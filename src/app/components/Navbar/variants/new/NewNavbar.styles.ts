import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { layout } = designTokens;

export const LeftContainer = styled.div`
  flex: 1;
  align-items: center;
  gap: ${layout.space.xSmall};
  display: flex;
  justify-content: left;
`;

export const RightContainer = styled.div`
  flex: 1;
  align-items: center;
  gap: ${layout.space.xSmall};
  display: flex;
  justify-content: right;
`;

export const AccountMenuContainer = styled.div`
  position: relative;
`;