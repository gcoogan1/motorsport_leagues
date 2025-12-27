import styled from "styled-components";
import { NavLink } from "react-router";
import { designTokens } from "@/app/design/tokens";

const { gradients, colors, borders, layout } = designTokens;

export const BrandWrapperLink = styled(NavLink)`
  display: flex;
  align-items: center;
  text-decoration: none;
  justify-content: center;
  color: ${colors.text.text1};
  border: none;
  background: transparent;
  width: 196px;
  height: 52px;
  border-radius: ${borders.radius.medium};

  /* Hover */
  &:hover {
    background: ${gradients.base.fadeTop10};
  }

  /* Focus Visible */
  &:focus-visible {
    outline: 2px solid ${colors.utility.focus};
    outline-offset: 2px;
    background: ${gradients.base.fadeTop10};
  }

  /* Pressed */
  &:active {
    border: ${borders.width.medium} solid ${colors.text.text1};
  }

  ${layout.mediaQueries.mobile} {
    width: 50px;
    height: 50px;
  }
`;