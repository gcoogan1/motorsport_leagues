import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";
import { gradientBorder } from "@/app/design/mixens/gradientBorder";

const { gradients, layout, borders } = designTokens;


export const PanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const SecondaryContainer = styled.div`
  display: flex;
  padding: ${layout.space.medium} ${layout.space.xLarge};
  flex-direction: column;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  border-bottom-left-radius: ${borders.radius.xxLarge};
  border-bottom-right-radius: ${borders.radius.xxLarge};

  ${gradientBorder({
    gradient: gradients.base.fadeTop10,
    width: borders.width.thin,
  })}
`;