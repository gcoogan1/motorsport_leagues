import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";


const { gradients, colors, borders, layout, typography } = designTokens;

export const SelectWrapperButton = styled.button`
  display: flex;
  align-items: center;
  text-align: center;
  border: none;
  justify-content: center;
  color: ${colors.text.text2};
  cursor: pointer;
  border-radius: ${borders.radius.round};
  padding: ${layout.space.medium};
  gap: ${layout.space.xxSmall};
  background: ${gradients.base.fadeTop10};

  /* Hover */
  &:hover {
    color: ${colors.text.text1};
    background: ${colors.base.translucent10};
  }

  /* Focus Visible */
  &:focus-visible {
    color: ${colors.text.text1};
    outline: 2px solid ${colors.utility.focus};
    outline-offset: 2px;
    background: ${colors.base.translucent10};
  }

  /* Pressed */
  &:active {
    color: ${colors.text.text1};
    box-shadow: inset 0 0 0 2px ${colors.text.text1};
    background: 'transparent';
  }

  ${layout.mediaQueries.mobile} {
    padding-right: ${layout.space.medium};
  }
`;

export const SelectLabel = styled.p`
  ${typography.body.mediumBold};
`;