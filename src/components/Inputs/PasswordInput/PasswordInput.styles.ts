import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { colors, layout, typography, borders } = designTokens;

export const ButtonWrapper = styled.span`
  position: absolute;
  right: ${layout.space.xSmall};
  margin-top: ${layout.space.xSmall};
  display: flex;
`;

export const InputWrapper = styled.div<{ $hasValue?: boolean }>`
  width: 100%;
  position: relative;
`;

export const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${layout.space.xxxSmall};
`;

export const Label = styled.label`
  ${typography.body.smallBold}
  color: ${colors.text.text2};
`;

export const InputField = styled.input<{
  $hasError: boolean;
  $hasValue: boolean;
}>`
  width: 100%;
  border-radius: ${borders.radius.medium};
  padding: ${layout.space.medium};
  border: none;
  display: flex;
  align-items: center;
  gap: ${layout.space.xSmall};
  background: ${colors.base.translucent10};
  color: ${({ $hasValue }) =>
    $hasValue ? colors.text.text1 : colors.text.text2};
  box-shadow: ${({ $hasError }) =>
    $hasError
      ? `inset 0 0 0 2px ${colors.alert.alertA}`
      : `inset 0 0 0 2px transparent`};

  // Password is too long style
  padding-right: 72px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;

  &::placeholder {
    ${typography.body.mediumRegular}
  }

  &:hover {
    background: ${colors.base.translucent20};
  }

  &:focus-visible {
    background: transparent;
    outline: 2px solid ${colors.utility.focus};
    outline-offset: 2px;
    color: ${colors.text.text1};
    box-shadow: inset 0 0 0 2px ${colors.text.text1};
  }

  &:active {
    box-shadow: inset 0 0 0 2px ${colors.text.text1};
    background: transparent;
    outline: none;
  }
`;

export const HelperText = styled.span`
  ${typography.body.smallRegular}
  color: ${colors.text.text2};
  display: flex;
  margin-top: 3px;
`;

export const ErrorText = styled.span`
  ${typography.body.smallBold}
  color: ${colors.alert.alertA};
  display: flex;
  align-items: center;
  gap: ${layout.space.xxxSmall};
`;
