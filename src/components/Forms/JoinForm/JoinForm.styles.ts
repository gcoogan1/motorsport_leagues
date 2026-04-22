import styled from "styled-components";

import { designTokens } from "@/app/design/tokens";

const { colors, layout, borders, typography } = designTokens;

export const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: ${borders.radius.xLarge};
  border: ${borders.width.thin} solid ${colors.base.translucent10};
`;

export const FormHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${layout.space.xLarge};
  gap: ${layout.space.xxxSmall};
  border: ${borders.width.thin} solid ${colors.base.translucent10};
  background: ${({ theme }) => theme.theme.primaryGradientFadeRight50};
  border-top-right-radius: ${borders.radius.xLarge};
  border-top-left-radius: ${borders.radius.xLarge};
`;

export const HeaderTitle = styled.h3`
${typography.subtitle.mediumItalic};
  color: ${({ theme }) => theme.theme.primaryA};
`;

export const HeaderSubtitle = styled.p`
  ${typography.body.mediumRegular};
  color: ${colors.text.text2};
`;

export const FormInputs = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding: ${layout.space.xLarge};
  gap: ${layout.space.xLarge};
`;

export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${layout.space.medium};
  align-self: stretch;
`;

export const ErrorText = styled.span`
  ${typography.body.smallBold}
  color: ${colors.alert.alertA};
  display: flex;
  gap: ${layout.space.xxxSmall};
`;