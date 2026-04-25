import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { colors, layout, typography } = designTokens;

export const ToggleContainer = styled.div`
  display: flex;
  width: 100%;
  min-width: 0;
  align-items: flex-start;
  gap: ${layout.space.xSmall};
  ${layout.mediaQueries.mobile} {
    gap: ${layout.space.xxxSmall};
  }
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1 0 0;
`;

export const Label = styled.span`
  ${typography.body.mediumBold};
  color: ${colors.text.text1};
  
`;

export const HelperMessage = styled.span`
  ${typography.body.smallRegular};
  color: ${colors.text.text2};
`;