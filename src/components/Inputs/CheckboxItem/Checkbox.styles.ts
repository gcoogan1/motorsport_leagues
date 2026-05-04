import styled, { css } from "styled-components";
import { designTokens } from "@/app/design/tokens";
import { gradientBorder } from "@/app/design/mixens/gradientBorder";

const { colors, gradients, layout, borders } = designTokens;

export const CheckboxContainer = styled.div<{ $isChecked?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: ${layout.space.medium};
  border-radius: ${borders.radius.medium};
  cursor: pointer;

   /* Gradient Border */
    ${gradientBorder({
      gradient: gradients.base.fadeRight10,
      width: borders.width.thin,
    })}

    
  ${({ $isChecked }) =>
    $isChecked &&
    css`
    background: ${colors.base.translucent10};
    ${gradientBorder({
      gradient: gradients.base.translucent10,
      width: borders.width.thin,
    })}

  `};
`;