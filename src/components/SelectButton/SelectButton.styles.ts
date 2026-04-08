import styled, { createGlobalStyle } from "styled-components";
import { designTokens } from "@app/design/tokens";

const { colors, borders, layout, typography, effects } = designTokens;

export const SelectButtonWrapper = styled.div`
  .select__control {
    min-height: 0;
    border: none;
    background: ${colors.base.translucent10};
    color: ${colors.text.text1};
    cursor: pointer;
    padding-top: ${layout.space.xxSmall};
    padding-bottom: ${layout.space.xxSmall};
    padding-left: ${layout.space.medium};
    padding-right: ${layout.space.xSmall};
    border-radius: ${borders.radius.round};
    gap: ${layout.space.xxSmall};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: auto;

    &:hover {
      background: ${colors.base.translucent20};
    }

    &:active {
      box-shadow: inset 0 0 0 2px ${colors.text.text1};
      background: transparent;
      outline: none;
    }
  }

  .select__control.select__control--is-focused:not(:active) {
    background: ${colors.base.translucent20};
    outline: 2px solid ${colors.utility.focus} !important;
    outline-offset: 2px;
  }
  
  .select__control.select__control--is-focused:not(:active):hover {
    background: ${colors.base.translucent20};
  }

  .select__value-container {
    display: flex;
    align-items: center;
    padding: 0;
    gap: ${layout.space.xxSmall};
  }

  .select__single-value,
  .select__placeholder {
    ${typography.body.mediumBold} margin: 0;
    white-space: nowrap;
  }

  .select__single-value {
    color: ${colors.text.text1};
  }

  .select__placeholder {
    color: ${colors.text.text1};
  }

  .select__input-container {
    margin: 0;
    padding: 0;
  }

  .select__indicator {
    padding: 0;
    color: inherit;
  }

  .select__indicators {
    display: flex;
    align-items: center;
  }

  .select__menu {
    min-width: 220px;
  }
`;

export const SelectMenuGlobalStyles = createGlobalStyle`
  .select__menu {
    background: ${colors.base.base3};
    border: ${borders.width.thin} solid ${colors.base.translucent10};
    border-radius: ${borders.radius.xxLarge};
    overflow: hidden;
    z-index: 9999;
    margin-top: 6px;
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

export const OptionRow = styled.div<
  { $isFocused?: boolean; $isSelected?: boolean }
>`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  padding: ${layout.space.small} ${layout.space.small} ${layout.space
    .small} ${layout.space.medium};
  border-radius: ${borders.radius.large};
  background: ${(
    { $isFocused },
  ) => ($isFocused ? colors.base.translucent10 : "transparent")};
  cursor: pointer;
  color: ${colors.text.text1};

  &:hover {
    background: ${colors.base.translucent10};
  }
`;
