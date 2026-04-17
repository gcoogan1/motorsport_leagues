import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";
import { gradientBorder } from "@/app/design/mixens/gradientBorder";

const { gradients, layout, borders } = designTokens;

export const ItemContainer = styled.div`
  ${gradientBorder({ gradient: gradients.base.fadeTop10, width: borders.width.thin })};
  display: flex;
  width: 320px;
  padding: ${layout.space.small} ${layout.space.medium};
  flex-direction: column;
  align-items: center;
  border-bottom-left-radius: ${borders.radius.large};
  border-bottom-right-radius: ${borders.radius.large};
`