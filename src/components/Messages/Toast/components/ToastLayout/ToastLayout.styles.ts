import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";
import { gradientBorder } from "@/app/design/mixens/gradientBorder";

const { colors, gradients, layout, typography, borders } = designTokens;

/* Places the toast container at the bottom right of the screen */
export const ToastViewport = styled.div`
  position: fixed;
  z-index: 9999;
  pointer-events: none;
  right: 40px;
  bottom: 40px;

  /* Mobile */
  ${layout.mediaQueries.mobile} {
    right: 20px;
    bottom: 20px;
  }
`;

export const ToastContainer = styled.div<{ $bg: string }>`
  width: 360px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${layout.space.xSmall};
  padding-top: ${layout.space.xSmall};
  padding-bottom: ${layout.space.xSmall};
  padding-right: ${layout.space.xSmall};
  padding-left: ${layout.space.medium};
  border-radius: ${borders.radius.large};
  background: ${({ $bg }) => $bg};

  /* Graduent Border */
  ${gradientBorder({
    gradient: gradients.base.fadeOutHorizontal20,
    width: "1px",
  })}

  /* Mobile */
  ${layout.mediaQueries.mobile} {
    width: 320px;
  }
`;

export const ContentContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: ${layout.space.xSmall} 0;
  gap: ${layout.space.xxSmall};
    color: ${colors.text.text1};
`;

export const MessageText = styled.p`
  ${typography.body.mediumBold};
  color: ${colors.text.text1};
`;
