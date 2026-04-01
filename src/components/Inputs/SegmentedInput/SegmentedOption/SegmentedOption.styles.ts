import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { colors, layout, typography, borders } = designTokens;

export const OptionContainer = styled.button<{ $isSelected?: boolean }>`
  // remove default button styles
  all: unset;
  min-width: 0;
  flex-shrink: 0;
  
  
  display: flex;
  align-items: center;
  padding: ${layout.space.xxSmall} ${layout.space.small};
  gap: ${layout.space.xxSmall};
  border-radius: ${borders.radius.small};
  background: ${({ $isSelected }) => ($isSelected ? colors.text.text1 : 'transparent')};
  color: ${({ $isSelected }) => ($isSelected ? colors.base.base3 : colors.text.text2)};
  cursor: pointer;

  &:hover {
    background: ${({ $isSelected }) => ($isSelected ? colors.text.text1 : colors.base.translucent10)};
      color: ${({ $isSelected }) => ($isSelected ? colors.base.base3 : colors.text.text1)};
  }

  &:active {
    background: ${({ $isSelected }) => ($isSelected ? colors.text.text1 : colors.base.translucent10)};
      color: ${({ $isSelected }) => ($isSelected ? colors.base.base3 : colors.text.text1)};
  }

  &:focus {
    outline: 2px solid ${colors.utility.focus};
    outline-offset: 2px;
    background: ${({ $isSelected }) => ($isSelected ? colors.text.text1 : colors.base.translucent20)};
    color: ${({ $isSelected }) => ($isSelected ? colors.base.base3 : colors.text.text1)};
  }
`;

export const OptionLabel = styled.p`
  ${typography.body.mediumBold};
  color: inherit;
`;