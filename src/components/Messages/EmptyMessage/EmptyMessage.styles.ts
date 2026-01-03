import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";
import { topFadeBorder } from "@/app/design/mixens/edgeFadeBorder";
import { gradientBorder } from "@/app/design/mixens/gradientBorder";

const { colors, gradients, typography, layout, borders } = designTokens;

export const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  padding: ${layout.space.xxLarge} ${layout.space.medium};
  gap: ${layout.space.large};
`;

export const GraphicContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${layout.space.medium};
  border-radius: ${borders.radius.xxLarge};
  ${gradientBorder({
    gradient: gradients.base.fadeOutHorizontal10,
    width: borders.width.thin,
  })}
`;

export const IconWrapper = styled.div`
  color: ${colors.base.translucent20};
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 100%;
    height: 100%;
  }
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${layout.space.xxSmall};
  width: 100%;
`;
export const Title = styled.h2`
  ${typography.title.xSmall}
  color: ${colors.text.text2};
  text-align: center;
`;
export const Subtitle = styled.p`
  ${typography.body.mediumItalic}
  color: ${colors.text.text3};
  text-align: center;
`;

export const ActionsContainer = styled.div`
  ${topFadeBorder({
    gradient: gradients.base.fadeOutHorizontal10,
    width: borders.width.thin,
  })}
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding-top: ${layout.space.medium};
  gap: ${layout.space.xSmall};
`;
