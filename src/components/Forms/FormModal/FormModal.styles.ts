import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";
import { topFadeBorder } from "@/app/design/mixens/edgeFadeBorder";


const { colors, gradients, layout, borders, typography } = designTokens;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: ${layout.space.xxxLarge} ${layout.space.medium};
`;

export const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 480px;
  border-radius: ${borders.radius.xxxLarge};
  background: ${colors.base.base3};
  overflow: hidden;

  /* Gradient Border */
  ${topFadeBorder({
    gradient: gradients.base.fadeOutHorizontal80,
    width: borders.width.medium,
  })}
`;

export const FormBody = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  border-radius: ${borders.radius.xxxLarge};
  padding: ${layout.space.xLarge};
  gap: ${layout.space.large};
`;

export const BodyHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${layout.space.xxxSmall};
`;

export const BodyTitle = styled.h2`
  ${typography.title.small};
  color: ${colors.text.text1};
`;

export const BodySubtitle = styled.p`
  ${typography.body.mediumRegular};
  color: ${colors.text.text2};
`;

export const BodyInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${layout.space.medium};
`;

export const FormActions = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${layout.space.large} ${layout.space.xLarge};
  gap: ${layout.space.medium};
  border-top: ${borders.width.medium} solid ${colors.base.translucent10};
  border-bottom: ${borders.width.medium} solid ${colors.base.translucent10};
  border-bottom-left-radius: ${borders.radius.xxxLarge};
  border-bottom-right-radius: ${borders.radius.xxxLarge};
`;

export const SecondaryButtonContainer = styled.div`
  flex: 1;
`;
