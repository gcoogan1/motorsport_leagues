import styled from "styled-components";

import { designTokens } from "@/app/design/tokens";
import { bottomFadeBorder } from "@/app/design/mixens/edgeFadeBorder";

const { colors, gradients, layout, borders, typography } = designTokens;

export const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: ${borders.radius.xLarge};
  border: ${borders.width.thin} solid ${colors.base.translucent10};
`;

export const FormHeader = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  align-self: stretch;
  flex-wrap: wrap;
  padding: ${layout.space.medium};
  gap: ${layout.space.xSmall};
  background: ${({ theme }) => theme.theme.primaryGradientFadeRight50};
    border-top-left-radius: ${borders.radius.xLarge};

  ${bottomFadeBorder({
    width: borders.width.thin,
    gradient: gradients.base.fadeRight10,
  })}
`;

export const FormTitle = styled.h3`
  ${typography.subtitle.medium};
  color: ${colors.text.text1};
  flex: 1 0 auto;
  margin: 0;
`;

export const InputContainer = styled.div<{ hasMultiple?: boolean }>`
  display: flex;
  flex-direction: ${({ hasMultiple }) => (hasMultiple ? "column" : "row")};
  align-items: flex-start;
  align-self: stretch;
  gap: ${layout.space.medium};
  padding: ${layout.space.medium};
`;