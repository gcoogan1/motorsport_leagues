import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";
import { topFadeBorder } from "@/app/design/mixens/edgeFadeBorder";
import { gradientBorder } from "@/app/design/mixens/gradientBorder";

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
  max-height: 640px;
  border-radius: ${borders.radius.xxxLarge};
  background: ${colors.base.base3};
  padding: ${layout.space.xLarge};
  overflow: hidden;
  position: relative;

  ${topFadeBorder({
    gradient: gradients.base.fadeOutHorizontal80,
    width: borders.width.medium,
  })};
`;

export const ButtonWrapper = styled.div`
  position: absolute;
  left: 16px;
  top: 16px;
`;

export const FormHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${layout.space.xxxSmall};
  padding: 16px 0;
`;

export const FormTitle = styled.h2`
  ${typography.title.small};
  color: ${colors.text.text1};
`;

export const FormSubtitle = styled.p`
  ${typography.body.mediumRegular};
  color: ${colors.text.text2};
`;

export const FormBody = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: ${layout.space.medium};
  min-height: 0;
`;

export const ListContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: ${layout.space.xSmall};
  border-radius: ${borders.radius.large};
  padding: ${layout.space.xLarge};
  flex: 1;
  min-height: 0;

  ${gradientBorder({
    gradient: gradients.base.fadeBottom10,
    width: borders.width.medium,
  })};
`;

export const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-self: stretch;
  gap: ${layout.space.xSmall};
  border: ${borders.width.medium} solid transparent;
  border-radius: ${borders.radius.large};
  overflow-y: auto;
  flex: 1;
  min-height: 0;
`;
