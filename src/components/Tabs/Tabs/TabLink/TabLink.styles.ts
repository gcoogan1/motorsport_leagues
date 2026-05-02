import styled, { css } from "styled-components";
import { designTokens } from "@/app/design/tokens";


const { colors, gradients, layout, borders, typography } = designTokens;

export const ButtonContainer = styled.button`
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.text.text2};

  border-top-right-radius: ${borders.radius.medium};
  border-top-left-radius: ${borders.radius.medium};
  padding-top: ${layout.space.medium};
  padding-left: ${layout.space.medium};
  padding-right: ${layout.space.medium};
  background: transparent;
  cursor: pointer;

  &:hover {
    background: ${gradients.base.fadeTop10};
    color: ${colors.text.text1};
  }

  &:focus-visible {
    outline: 2px solid ${colors.utility.focus};
    outline-offset: 2px;
    color: ${colors.text.text1};
  }

  &:active {
    background: ${colors.base.translucent10};
    color: ${colors.text.text1};
  }
`;

export const ButtonTextContainer = styled.div<{ $active: boolean }>`
  display: flex;
  border-bottom: ${layout.space.thick} solid transparent;
  padding-bottom: ${layout.space.medium};

  ${({ $active }) =>
    $active &&
    css`
      border-color: ${colors.text.text1};
    `}
`;

export const ButtonText = styled.span<{ $active: boolean }>`
  ${typography.subtitle.medium};  
  color: ${({ $active }) => ($active ? colors.text.text1 : "inherit")};
`;