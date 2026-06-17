import styled from "styled-components";
import { designTokens } from "@app/design/tokens";
import type { PositionBackground } from "./Position";

const { colors, layout, borders, typography } = designTokens;


export const PositionContainer = styled.div<{ $positionBackground: PositionBackground}>`
  width: 48px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-top-right-radius: ${borders.radius.round};
  border-bottom-right-radius: ${borders.radius.round};
  padding: ${layout.space.xxSmall} ${layout.space.medium};


  /* Position background and box shadow */
  background: ${({ $positionBackground }) => $positionBackground.background};
  ${({ $positionBackground }) => $positionBackground.boxShadow};
`;

export const PositionText = styled.p`
  ${typography.subtitle.xLargeItalic};
  color: ${colors.text.text1}
`;