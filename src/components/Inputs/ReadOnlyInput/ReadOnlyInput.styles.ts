import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { colors, gradients, layout, typography, borders } = designTokens;

export const InputWrapper = styled.div`
  width: 100%;
  position: relative;
  gap: ${layout.space.xxxSmall};
`;

export const Label = styled.label`
  ${typography.body.smallBold}
  color: ${colors.text.text2};
`;


export const InputField = styled.div`
  width: 100%;
  border-radius: ${borders.radius.medium};
  padding: ${layout.space.medium};
  border: none;
  display: flex;
  align-items: center;
  gap: ${layout.space.xSmall};
  background: ${gradients.base.fadeRight10};
  border: ${borders.width.thin} solid ${colors.base.translucent10};
`;

export const TextValue = styled.p`
  ${typography.body.mediumBold}
  color: ${colors.text.text1};
`

export const HelperText = styled.span`
  ${typography.body.smallRegular};
  color: ${colors.text.text2};
  display: flex;
  margin-top: 3px;
`;

