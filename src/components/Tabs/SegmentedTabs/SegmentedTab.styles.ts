import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { colors, borders, layout } = designTokens;

export const SwitchContainer = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${borders.radius.round};
  background: ${colors.base.translucent10};
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};
  gap: ${layout.space.xxxSmall};
  padding: ${layout.space.xSmall};

  ${layout.mediaQueries.mobile} {
    overflow-x: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;