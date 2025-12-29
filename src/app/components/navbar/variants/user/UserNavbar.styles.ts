import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { layout } = designTokens;

export const LeftContainer = styled.div<{ $isWrapped: boolean }>`
  flex: 1;
  align-items: center;
  gap: ${layout.space.xSmall};
  display: flex;
  justify-content: ${({ $isWrapped }) => ($isWrapped ? "center" : "left")};
`;

export const CenterContainer = styled.div`
  flex: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${layout.space.xSmall};

  ${layout.mediaQueries.mobile} {
    justify-content: left;
  }
`;

export const RightContainer = styled.div`
  flex: 1;
  align-items: center;
  gap: ${layout.space.xSmall};
  display: flex;
  justify-content: right;
`;

export const MobileRightContainer = styled.div`
  flex: 2;
  align-items: center;
  gap: ${layout.space.xSmall};
  display: flex;
  justify-content: space-between;
`;
