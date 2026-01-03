import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { colors, gradients, borders, layout, typography } = designTokens;

export const Option = styled.button`
  /* Button reset */ 
  all: unset;
  box-sizing: border-box;
  width: 100%;

  /* Default Layout */
  display: flex;
  padding: ${layout.space.medium};
  align-items: center;
  gap: ${layout.space.medium};
  color: ${colors.text.text2};
  cursor: pointer;
  background: transparent;

  /* Hover */
  &:hover {
    background: ${gradients.base.fadeRight10};
  }

  /* Focus Visible */
  &:focus-visible {
    outline: 1px solid ${colors.utility.focus};
    outline-offset: -1px;
    background: ${colors.base.translucent10};
  }

  /* Active */
  &:active {
    background: ${colors.base.translucent10};
  }

  /* Match parent radius */
  &:first-child {
    border-top-left-radius: ${borders.radius.xLarge};
    border-top-right-radius: ${borders.radius.xLarge};
  }

  &:last-child {
    border-bottom-left-radius: ${borders.radius.xLarge};
    border-bottom-right-radius: ${borders.radius.xLarge};
  }

  /* If there's only one item */
  &:only-child {
    border-radius: ${borders.radius.xLarge};
  }
`;

export const OptionTextContainer = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
`;

export const OptionTitle = styled.h3`
  ${typography.body.mediumBold};
  color: ${colors.text.text1};
`;

export const OptionHelper = styled.p`
  ${typography.body.smallRegular};
  color: ${colors.text.text2};
`;
