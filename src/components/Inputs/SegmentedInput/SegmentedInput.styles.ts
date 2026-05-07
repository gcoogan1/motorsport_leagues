import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { colors, layout, typography, borders} = designTokens;

export const SegmentedInputContainer = styled.div`
  display: flex;
  gap: ${layout.space.xxxSmall};
  flex-direction: column;
  width: 100%;
`;

export const Label = styled.p`
  ${typography.body.smallBold}
  color: ${colors.text.text2};
`;

export const OptionsContainer = styled.div`
  display: flex;
  width: 100%;
  min-height: 52px;
  border-radius: ${borders.radius.medium};
  background: ${colors.base.translucent10};
  padding: ${layout.space.xSmall};
  gap: ${layout.space.xxxSmall};
`;

export const HelperText = styled.p`
  ${typography.body.smallRegular}
  color: ${colors.text.text2};
`;

