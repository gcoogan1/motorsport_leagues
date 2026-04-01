import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { colors, layout, typography } = designTokens;

export const SegmentedInputContainer = styled.div`
  display: flex;
  gap: ${layout.space.xxxSmall};
  flex-direction: column;
`;

export const Label = styled.p`
  ${typography.body.smallBold}
  color: ${colors.text.text2};
`;

export const OptionsContainer = styled.div`
  display: flex;
  border-radius: ${layout.space.medium};
  background: ${colors.base.translucent10};
  padding: ${layout.space.xSmall};
  gap: ${layout.space.xxxSmall};
`;

export const HelperText = styled.p`
  ${typography.body.smallRegular}
  color: ${colors.text.text2};
`;

