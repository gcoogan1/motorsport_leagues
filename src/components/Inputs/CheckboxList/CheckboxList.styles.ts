import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { colors, layout, borders } = designTokens;

export const CheckboxListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  align-content: center;
  width: 100%;
  min-width: 0;
  padding: ${layout.space.medium} ${layout.space.xLarge};
  gap: ${layout.space.large};
  border-radius: ${borders.radius.round};
  border: ${borders.width.thin} solid ${colors.base.translucent10};
  cursor: pointer;

  ${layout.mediaQueries.mobile} {
    gap: ${layout.space.xSmall};
  }
`