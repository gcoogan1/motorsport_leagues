import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";
import { gradientBorder } from "@/app/design/mixens/gradientBorder";

const { gradients, colors, borders, layout, typography } = designTokens;

export const NotificationWrapper = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  text-align: center;
  border: none;
  justify-content: center;
  color: ${colors.text.text2};
  cursor: pointer;
  border-top-left-radius: 16px;
  border-bottom-left-radius: 16px;
  padding: ${layout.space.small} ${layout.space.medium};
  gap: ${layout.space.xxSmall};
  background: transparent;

  /* Gradient Border */
  ${gradientBorder({
    gradient: gradients.base.fadeRight20,
    width: borders.width.thin,
  })}

  /* Hover */
  &:hover {
    color: ${colors.text.text1};
    background: ${gradients.base.fadeRight20};
  }

  /* Focus Visible */
  &:focus-visible {
    border-radius: ${borders.radius.xLarge};
    color: ${colors.text.text1};
    outline: 2px solid ${colors.utility.focus};
    outline-offset: 2px;
    background: ${colors.base.translucent10};
  }

  /* Pressed */
  &:active {
    border-radius: ${borders.radius.xLarge};
    color: ${colors.text.text1};
    box-shadow: inset 0 0 0 2px ${colors.text.text1};
    background: "transparent";
  }
`;

export const CountBadge = styled.span`
  display: flex;
  height: 20px;
  min-width: 20px;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0 ${layout.space.xxSmall};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: ${borders.radius.round};
  position: absolute;
  left: -5px;
  top: -8px;
  background: ${colors.alert.alertA};
`;

export const CountText = styled.p`
  ${typography.body.tinyBold};
  color: ${colors.text.text1};
`;
