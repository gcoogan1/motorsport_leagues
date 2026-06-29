import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { colors, gradients, layout, typography, borders } = designTokens;

export const InputWrapper = styled.div<{ $centerContent?: boolean }>`
  width: ${({ $centerContent }) => ($centerContent ? "min(100%, 240px)" : "100%")};
  position: relative;
  gap: ${layout.space.xxxSmall};
  min-width: 0;
  overflow: hidden;
  margin: ${({ $centerContent }) => ($centerContent ? "0 auto" : "0")};
`;

export const Label = styled.label`
  ${typography.body.smallBold}
  color: ${colors.text.text2};
`;


export const InputField = styled.div<{ $centerContent?: boolean }>`
  width: 100%;
  overflow: hidden;
  max-width: ${({ $centerContent }) => ($centerContent ? "240px" : "none")};
  min-width: 0;
  border-radius: ${borders.radius.medium};
  padding: ${layout.space.medium};
  border: none;
  display: flex;
  align-items: center;
  justify-content: ${({ $centerContent }) => ($centerContent ? "center" : "flex-start")};
  gap: ${layout.space.xSmall};
  background: ${gradients.base.fadeRight10};
  border: ${borders.width.thin} solid ${colors.base.translucent10};
  margin: ${({ $centerContent }) => ($centerContent ? "0 auto" : "0")};
`;

export const TextValue = styled.p`
  ${typography.body.mediumBold}
  color: ${colors.text.text1};
  min-width: 0;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const HelperText = styled.span`
  ${typography.body.smallRegular};
  color: ${colors.text.text2};
  display: flex;
  margin-top: 3px;
  overflow: hidden;
`;

