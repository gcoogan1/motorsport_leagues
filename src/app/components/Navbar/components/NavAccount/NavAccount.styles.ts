import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";
import { gradientBorder } from "@/app/design/mixens/gradientBorder";

const { gradients, colors, borders, layout, typography } = designTokens;

export const AccountWrapperButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  text-align: center;
  border: none;
  justify-content: center;
  color: ${colors.text.text2};
  cursor: pointer;
  max-width: 160px;
  border-top-left-radius: 16px;
  border-bottom-left-radius: 16px;
  padding: ${layout.space.medium};
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

export const SelectLabel = styled.p`
  ${typography.body.mediumBold};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
