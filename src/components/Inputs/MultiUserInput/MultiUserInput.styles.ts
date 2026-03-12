import styled, { createGlobalStyle, css } from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { colors, layout, typography, borders } = designTokens;

export const FieldWrapper = styled.div`
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

  .select__control--is-focused {
    background: transparent;
    outline: 2px solid ${colors.utility.focus};
    outline-offset: 2px;
    box-shadow: inset 0 0 0 2px ${colors.text.text1};
  }

  .select__control.select__control--has-error {
    box-shadow: inset 0 0 0 2px ${colors.alert.alertA};
  }

  .select__control--is-focused.select__control--has-error {
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

// Global styles for the portaled menu — must be global because menuPortalTarget={document.body}
// renders the dropdown outside FieldWrapper, so scoped styles won't reach it
export const MultiSelectMenuGlobalStyles = createGlobalStyle`
  .select__menu {
    background: ${colors.base.base3};
    border-radius: 12px;
    overflow: hidden;
    z-index: 9999;
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

export const Label = styled.label`
  ${typography.body.smallBold};
  color: ${colors.text.text2};
`;

export const HelperText = styled.span`
  ${typography.body.smallRegular};
  color: ${colors.text.text2};
`;

export const OptionRow = styled.div<{ $isFocused?: boolean; $isSelected?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${layout.space.xSmall};
  width: 100%;
  box-sizing: border-box;
  padding-top: ${layout.space.small};
  padding-bottom: ${layout.space.small};
  padding-left: ${layout.space.medium};
  padding-right: ${layout.space.small};
  border-radius: ${borders.radius.large};
  border: ${borders.width.medium} solid transparent;
  background: transparent;

  ${({ $isFocused }) =>
    $isFocused &&
    css`
      background: ${colors.base.translucent10};
      outline: 2px solid ${colors.utility.focus};
      outline-offset: 2px;
    `}

  ${({ $isSelected }) =>
    $isSelected &&
    css`
      background: ${colors.base.translucent10};
      border-color: ${colors.base.translucent30};
    `}

  &:hover {
    background: ${colors.base.translucent20};
    border-color: transparent;
  }

  &:active {
    border: ${borders.width.medium} solid ${colors.base.translucent30};
    background: ${colors.base.translucent10};
  }
`;

export const OptionText = styled.div`
  display: flex;
  flex-direction: column;
`;

export const OptionLabel = styled.span`
  ${typography.body.mediumBold};
  color: ${colors.text.text1};
  margin: 0;
`;

export const OptionMeta = styled.span`
  ${typography.body.smallRegular};
  color: ${colors.text.text2};
  margin: 0;
`;

export const ErrorText = styled.span`
  ${typography.body.smallBold}
  color: ${colors.alert.alertA};
  display: flex;
  gap: ${layout.space.xxxSmall};
  margin-top: 4px;
`;
