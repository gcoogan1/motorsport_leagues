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
  color: ${colors.text.text1};
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

  > span {
    flex: 0 0 auto;
  }
`;

export const OptionTextContainer = styled.div`
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  overflow: hidden;
`;

export const OptionTitle = styled.h3`
  ${typography.body.mediumBold};
  color: ${colors.text.text1};
  text-transform: capitalize;
`;

export const OptionHelper = styled.p`
  ${typography.body.smallRegular};
  color: ${colors.text.text2};
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
