import styled, { createGlobalStyle } from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { colors, layout, typography, borders, effects } = designTokens;

export const InputWrapper = styled.div<{ $hasValue?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${layout.space.xxxSmall};
  width: 100%;

  .select__control {
    min-height: 48px;
    background: ${colors.base.translucent10};
    border-radius: ${borders.radius.medium};
    padding: ${layout.space.medium};
    gap: ${layout.space.xSmall};
    color: ${colors.text.text1};
    box-shadow: inset 0 0 0 2px transparent;
    transition: background 120ms ease, box-shadow 120ms ease;

    &:hover {
      background: ${colors.base.translucent20};
    }

    &:active {
      box-shadow: inset 0 0 0 2px ${colors.text.text1};
      background: transparent;
      outline: none;
    }
  }

  .select__control.select__control--is-focused {
    background: transparent;
    outline: 2px solid ${colors.utility.focus} !important;
    outline-offset: 2px;
    box-shadow: inset 0 0 0 2px ${colors.text.text1};
  }

  .select__control.select__control--is-focused:hover {
    background: transparent;
  }

  .select__control.select__control--has-error {
    box-shadow: inset 0 0 0 2px ${colors.alert.alertA};
  }

  .select__control.select__control--is-focused.select__control--has-error {
    box-shadow: inset 0 0 0 2px ${colors.alert.alertA};
  }

  .select__value-container {
    display: flex;
    flex-wrap: wrap;
    gap: ${layout.space.xxSmall};
    padding: 0;
  }

  .select__input-container {
    order: 0;
    margin: 0;
    padding: 0;
    width: auto;
    min-width: 0;
    flex: 1 1 auto;
  }

  .select__placeholder {
    order: 0;
    ${typography.body.mediumRegular};
    color: ${colors.text.text2};
  }

  .select__add-more {
    ${typography.body.mediumRegular};
    color: ${colors.text.text2};
    margin-left: ${layout.space.xxSmall};
    white-space: nowrap;
    pointer-events: none;
  }

  .select__multi-value {
    margin: 0;
  }

  .select__error {
    ${typography.body.smallBold};
    color: ${colors.alert.alertA};
  }
`;

/* The following exports remain unchanged from your original source */
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

export const SelectMenuGlobalStyles = createGlobalStyle`
  .select__menu {
    background: ${colors.base.base3};
    border: ${borders.width.thin} solid ${colors.base.translucent10};
    border-radius: ${borders.radius.xxLarge};
    overflow: hidden;
    z-index: 9999;
    margin-top: 4px;
    ${effects.boxShadow.elevationModal};
  }

  .select__menu-list {
    display: flex;
    flex-direction: column;
    gap: ${layout.space.xxxSmall};
    padding: ${layout.space.xSmall};
  }

  .select__option {
    padding: 0;
    background: transparent;
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
  gap: ${layout.space.xxxSmall};
`;

export const OptionContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const OptionLabel = styled.span`
  ${typography.body.mediumRegular};
  color: ${colors.text.text1};
`;

export const OptionMeta = styled.span`
  ${typography.body.xSmallRegular};
  color: ${colors.text.text2};
`;

export const OptionRow = styled.div<{ $isFocused?: boolean; $isSelected?: boolean }>`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  padding: ${layout.space.small} ${layout.space.small} ${layout.space.small} ${layout.space.medium};
  border-radius: ${borders.radius.large};
  background: ${({ $isFocused }) => ($isFocused ? colors.base.translucent10 : "transparent")};
  cursor: pointer;
  color: ${colors.text.text1};  

  &:hover {
    background: ${colors.base.translucent10};
  }
`;
