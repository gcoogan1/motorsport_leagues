import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { colors, layout, typography, borders } = designTokens;

export const IconWrapper = styled.span<{ $hasValue?: boolean }>`
  position: absolute;
  left: ${layout.space.xSmall};
  margin-top: ${layout.space.small};
  pointer-events: none;
  display: flex;
  color: ${({ $hasValue }) =>
    $hasValue ? colors.text.text1 : colors.text.text2};
  width: 20px;
  height: 20px;
`;

export const InputWrapper = styled.div<{ $hasValue?: boolean }>`
  min-width: 320px;
  width: 100%;
  position: relative;
  /* When the input is focused, change the icon color */
  &:focus-within ${IconWrapper} {
    color: ${colors.text.text1};
  }
  /* When the input is active, change the icon color */
  &:active ${IconWrapper} {
    color: ${({ $hasValue }) =>
      $hasValue ? colors.text.text1 : colors.text.text2};
  }
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

export const Count = styled.span`
  ${typography.body.tinyRegular}
  color: ${colors.text.text3};
`;

export const InputField = styled.input<{
  $hasError: boolean;
  $hasValue: boolean;
  $hasIcon?: boolean;
}>`
  width: 100%;
  border-radius: ${borders.radius.medium};
  padding-top: ${layout.space.medium};
  padding-bottom: ${layout.space.medium};
  padding-left: ${({ $hasIcon }) =>
    $hasIcon ? `36px` : layout.space.medium};
  padding-right: ${layout.space.medium};
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

    // Text is too long style
    padding-right: 28px;
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
  ${typography.body.tinyRegular}
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
