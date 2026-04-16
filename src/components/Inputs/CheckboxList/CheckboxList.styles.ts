import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { colors, layout, borders } = designTokens;

export const CheckboxListContainer = styled.div`
  display: inline-flex;
  padding: ${layout.space.medium} ${layout.space.xLarge};
  justify-content: center;
  align-items: center;
  align-content: center;
  gap: ${layout.space.xSmall} ${layout.space.large};
  flex-wrap: wrap;
  border-radius: ${borders.radius.round};
  border: ${borders.width.thin} solid ${colors.base.translucent10};
`