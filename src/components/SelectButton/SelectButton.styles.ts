import styled from "styled-components";
import { designTokens } from "@app/design/tokens";

const { colors, borders, layout, typography } = designTokens;

export const SelectButtonWrapper = styled.div`
  .select__control {
    min-height: 0;
    border: ${borders.width.thick} solid transparent;
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
    box-shadow: none;
    transition: background 120ms ease, box-shadow 120ms ease, border-color 120ms ease;

    &:hover {
      background: ${colors.base.translucent20};
    }

    &:active {
      box-shadow: inset 0 0 0 2px ${colors.text.text1};
      background: transparent;
    }
  }

  .select__control.select__control--is-focused {
    background: transparent;
    outline: 2px solid ${colors.utility.focus};
    outline-offset: 2px;
    box-shadow: inset 0 0 0 2px ${colors.text.text1};
  }

  .select__control.select__control--is-focused:hover {
    background: transparent;
  }

  .select__value-container {
    display: flex;
    align-items: center;
    padding: 0;
    gap: ${layout.space.xxSmall};
  }

  .select__single-value,
  .select__placeholder {
    ${typography.body.mediumBold}
    margin: 0;
    white-space: nowrap;
  }

  .select__single-value {
    color: ${colors.text.text1};
  }

  .select__placeholder {
    color: ${colors.text.text2};
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