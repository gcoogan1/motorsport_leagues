import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { colors, layout, typography, borders } = designTokens;

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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Count = styled.span`
  ${typography.body.tinyRegular}
  color: ${colors.text.text3};
`;

export const InputContainer = styled.div<{
  $hasError: boolean;
  $hasValue: boolean;
}>`
  width: 100%;
  height: 52px;
  box-sizing: border-box;
  border-radius: ${borders.radius.medium};
  padding: 0 ${layout.space.medium};
  background: ${colors.base.translucent10};

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${layout.space.small};

  color: ${({ $hasValue }) =>
    $hasValue ? colors.text.text1 : colors.text.text2};

  box-shadow: ${({ $hasError }) =>
    $hasError
      ? `inset 0 0 0 2px ${colors.alert.alertA}`
      : `inset 0 0 0 2px transparent`};

  &:hover {
    background: ${colors.base.translucent20};
  }

  &:focus-within {
    background: transparent;
    outline: 2px solid ${colors.utility.focus};
    outline-offset: 2px;
    box-shadow: inset 0 0 0 2px ${colors.text.text1};
  }

  &:active {
    background: transparent;
    box-shadow: inset 0 0 0 2px ${colors.text.text1};
  }
`;

export const NumberInputWrapper = styled.div`
  position: relative;
  flex: 1;
  width: 100%;
`;

export const NumberInput = styled.input<{ $hasValue: boolean; $isFocused: boolean }>`
  width: 100%;
  border: none;
  background: transparent;
  text-align: center;

  ${typography.body.mediumRegular};

  color: ${({ $isFocused, $hasValue }) =>
    $isFocused ? ($hasValue ? colors.text.text1 : colors.text.text2) : "transparent"};
  caret-color: ${colors.text.text1};

  outline: none;

  /* Stop Safari zoom */
  font-size: 16px;

  /* Remove native arrows */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    margin: 0;
  }

  &::placeholder {
    color: ${colors.text.text3};
  }
`;

export const NumberValue = styled.span<{ $hasValue: boolean }>`
  ${typography.body.mediumRegular};
  color: ${({ $hasValue }) =>
    $hasValue ? colors.text.text1 : colors.text.text2};
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  user-select: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${layout.space.xSmall};
`;

export const IncrementButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: ${borders.radius.small};
  border: none;

  display: flex;
  align-items: center;
  justify-content: center;

  background: ${colors.base.translucent20};
  color: ${colors.text.text1};

  cursor: pointer;

  ${typography.body.mediumBold};

  transition:
    background 0.2s ease,
    transform 0.1s ease;

  &:hover {
    background: ${colors.base.translucent30};
  }

  &:active {
    transform: scale(0.96);
  }

  &:focus-visible {
    outline: 2px solid ${colors.utility.focus};
    outline-offset: 2px;
  }
`;

export const HelperText = styled.span`
  ${typography.body.smallRegular};
  color: ${colors.text.text2};
  display: flex;
  margin-top: 4px;
`;

export const ErrorText = styled.span`
  ${typography.body.smallBold};
  color: ${colors.alert.alertA};
  display: flex;
  margin-top: 4px;
  gap: ${layout.space.xxxSmall};
`;