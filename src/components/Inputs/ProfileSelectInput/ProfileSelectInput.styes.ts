import * as SelectPrimitive from "@radix-ui/react-select";
import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { colors, layout, typography, borders } = designTokens;

export const IconWrapper = styled.span`
  position: absolute;
  right: ${layout.space.small};
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  color: ${colors.text.text2};
  pointer-events: none;
`;

export const InputWrapper = styled.div`
  width: 100%;
`;

export const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${layout.space.xxxSmall};
`;

export const FieldLabel = styled.label`
  ${typography.body.smallBold}
  color: ${colors.text.text2};
`;

export const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const PlaceholderWrapper = styled.div<{ $isLarge: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ $isLarge }) => ($isLarge ? layout.space.xSmall : layout.space.xxSmall)};
  color: ${colors.text.text2};
`;

export const PlaceholderText = styled.span`
  ${typography.body.mediumRegular}
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
  gap: ${layout.space.xxxSmall};
  margin-top: 4px;
`;

export const StyledTrigger = styled(SelectPrimitive.Trigger)<{
  $hasError?: boolean
}>`
  width: 100%;
  border-radius: ${borders.radius.medium};
  padding: ${layout.space.medium};
  border: none;
  background: ${colors.base.translucent10};
  color: ${colors.text.text2};
  display: flex;
  align-items: center;
  cursor: pointer;

  box-shadow: ${({ $hasError }) =>
    $hasError
      ? `inset 0 0 0 2px ${colors.alert.alertA}`
      : `inset 0 0 0 2px transparent`};

  &:hover {
    background: ${colors.base.translucent20};
  }

  &:focus-visible {
    outline: 2px solid ${colors.utility.focus};
    outline-offset: 2px;
    box-shadow: inset 0 0 0 2px ${colors.text.text1};
  }

  &:active {
    box-shadow: inset 0 0 0 2px ${colors.text.text1};
    background: transparent;
    outline: none;
  }
`;

export const StyledContent = styled(SelectPrimitive.Content)`
  width: var(--radix-select-trigger-width);
  max-width: var(--radix-select-trigger-width);
`;

export const StyledViewport = styled(SelectPrimitive.Viewport)``;