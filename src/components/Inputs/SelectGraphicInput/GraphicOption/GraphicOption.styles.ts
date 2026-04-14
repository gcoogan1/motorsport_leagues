import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { colors, layout, borders } = designTokens;

export const GraphicContainer = styled.button<{ isSelected: boolean }>`
  /* Reset Styles */
  appearance: none;
  border: none;
  background: none;
  padding: 0;
  font: inherit;
  color: inherit;
  z-index: 0;
  overflow: hidden;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${borders.radius.round};
  /* width: 64px;
  height: 64px; */
  padding: ${layout.space.xSmall};
  gap: 10px;
  
  border-width: ${borders.width.medium};
  border-style: solid;
  border-color: ${({ isSelected }) =>
    isSelected ? colors.text.text1 : 'transparent'};
`

export const Graphic = styled.div<{ $swatchColor?: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${borders.radius.round};
  background: ${({ $swatchColor }) => $swatchColor ?? colors.base.translucent10};
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`
