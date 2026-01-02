import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { layout } = designTokens;

export const LeftContainer = styled.div`
  flex: 1;
  align-items: center;
  gap: ${layout.space.xSmall};
  display: flex;
  justify-content: left;

  ${layout.mediaQueries.mobile} {
    flex: none;
  }
`;
export const CenterContainer = styled.div`
  flex: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${layout.space.xSmall};

  ${layout.mediaQueries.mobile} {
    justify-content: flex-start;
    align-items: flex-start;
  }
`;

export const RightContainer = styled.div`
  flex: 1;
  align-items: center;
  gap: ${layout.space.xSmall};
  display: flex;
  justify-content: right;

  ${layout.mediaQueries.mobile} {
    flex: none;
  }
`;
