import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { colors, borders, layout } = designTokens;

export const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${borders.radius.round};
  background: ${colors.base.translucent10};
  gap: ${layout.space.xSmall};
  padding: ${layout.space.xSmall};
  width: 100%;

  ${layout.mediaQueries.mobile} {
    overflow-x: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;