import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";
import { gradientBorder } from "@/app/design/mixens/gradientBorder";

const { colors, gradients, layout, borders } = designTokens;

export const RulesContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 640px;
  flex-direction: column;
  align-items: center;
  align-self: center;
  border-top-right-radius: ${borders.radius.xLarge};
  border-top-left-radius: ${borders.radius.xLarge};

  ${gradientBorder({
    gradient: gradients.base.fadeBottom10,
    width: borders.width.medium,
  })}
`;

export const TextContainer = styled.div`
  display: flex;
  padding: ${layout.space.xLarge};
  flex-direction: column;
  gap: ${layout.space.xLarge};
  align-self: stretch;
`;

export const RulesContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${colors.text.text1};

    img {
    max-width: 100%;
    height: auto;
    display: block;
  }
`;