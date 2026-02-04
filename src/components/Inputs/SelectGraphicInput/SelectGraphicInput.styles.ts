import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { colors, layout, borders, typography } = designTokens;

export const SelectGraphicInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${layout.space.xxSmall};
`;

export const Label = styled.p`
  ${typography.body.smallBold};
  color: ${colors.text.text2};
`

export const OptionsContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: center;
  border-radius: ${borders.radius.medium};
  padding: ${layout.space.xSmall};
  background: ${colors.base.translucent10};
  gap: ${layout.space.xxxSmall};
`

export const HelperText = styled.span`
  ${typography.body.smallRegular};
  color: ${colors.text.text2};
`