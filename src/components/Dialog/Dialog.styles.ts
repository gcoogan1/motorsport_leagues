import styled, { type RuleSet } from "styled-components";
import { designTokens } from "@/app/design/tokens";


const { colors, layout, borders, typography } = designTokens;

/* Places the dialog container at the center of the screen */
export const DialogViewport = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 200px ${layout.space.large};
  z-index: 1000;
`;


export const DialogWrapper = styled.div<{ $typeStyle: RuleSet<object> }>`
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  width: 100%;
  max-width: 480px;
  border-radius: ${borders.radius.xxLarge};
  background: ${colors.base.base3};

  ${({ $typeStyle }) => $typeStyle}
`;

export const DialogHeader = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: ${layout.space.xLarge};
  gap: ${layout.space.xSmall};
`;

export const DialogTitle = styled.h2`
  ${typography.title.small};
  color: ${colors.text.text1};
`;

export const DialogSubtitle = styled.p`
  ${typography.body.mediumRegular};
  color: ${colors.text.text2};
`;

export const DialogActions = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding-bottom: ${layout.space.xLarge};
  padding-right: ${layout.space.xLarge};
  padding-left: ${layout.space.xLarge};
  gap: ${layout.space.xSmall};
`;