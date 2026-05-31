import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { colors, gradients, layout, typography, effects, borders } =
  designTokens;

export const CalendarContainer = styled.div`
  position: relative;
`;

export const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${layout.space.xxxSmall};
`;

export const Label = styled.label`
  ${typography.body.smallBold} color: ${colors.text.text2};
`;

export const DateInputWrapper = styled.div<{
  $focused?: boolean;
  $hasError?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${colors.base.translucent10};
  padding-top: ${layout.space.medium};
  padding-bottom: ${layout.space.medium};
  padding-left: ${layout.space.medium};
  padding-right: ${layout.space.small};
  height: 52px;
  border-radius: ${borders.radius.medium};
  gap: ${layout.space.xSmall};

  transition: 0.2s ease;

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
    color: ${colors.text.text1};
    box-shadow: inset 0 0 0 2px ${colors.text.text1};
  }

  &:active {
    box-shadow: inset 0 0 0 2px ${colors.text.text1};
    background: transparent;
    outline: none;
  }
`;

export const DateInput = styled.input`
  width: 112px;
  background: transparent;
  border: none;
  ${typography.body.mediumBold};
  outline: none;
  color: ${colors.text.text1};
  cursor: pointer;

  &::placeholder {
    ${typography.body.mediumRegular};
  }
`;

export const IconButton = styled.button`
  border: none;
  display: flex;
  background: transparent;
  color: ${colors.text.text1};
  cursor: pointer;
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

// -- CalendarStyles -- //
export const CalendarPopover = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 100;
  border-radius: ${borders.radius.xxLarge};
  padding: ${layout.space.small};
  border: ${borders.width.thin} solid ${colors.base.translucent10};
  background: ${colors.base.base3};

  ${effects.boxShadow.elevationModal} .rdp {
    margin: 0;
  }

  .rdp-months {
    width: 100%;
  }

  .rdp-caption {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: space-between;
    padding-left: ${layout.space.xSmall};
    ${typography.subtitle.medium};
    color: ${colors.text.text1};
  }

  .custom-nav {
    position: absolute;
    right: 0;
    top: -6px;
    z-index: 10;
    display: flex;
  }

  .rdp-day {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    ${typography.body.medium};
    color: ${colors.text.text1};
    border-radius: ${borders.radius.round};
    transition: 0.2s ease;
  }

  .rdp-day:hover {
    background: ${colors.base.translucent10};
  }

  .rdp-day button:active {
    border: ${borders.width.medium} solid ${colors.text.text1};
  }

  .rdp-day button:focus-visible {
    outline: ${borders.width.medium} solid ${colors.utility.focus};
    outline-offset: 2px;
  }

  .rdp-day_selected {
    background: ${colors.text.text1} !important;
    color: ${colors.base.base3} !important;
  }

  .rdp-day_today {
    background: ${gradients.base.fadeBottom10} !important;
    color: ${colors.text.text1} !important;
  }

  .rdp-day_today:hover {
    background: ${colors.base.translucent10} !important;
  }

  .rdp-day_today button:active {
    border: ${borders.width.medium} solid ${colors.text.text1};
  }

  .rdp-day_today button:focus-visible {
    outline: ${borders.width.medium} solid ${colors.utility.focus};
    outline-offset: 2px;
  }

  .rdp-day_outside {
    color: ${colors.text.text3};
    ${typography.body.mediumRegular};
  }

  .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
    background: ${colors.base.translucent10};
  }

  .rdp {
    width: 100%;
  }

  .rdp-months {
    width: 100%;
  }

  .rdp-month {
    width: 100%;
  }

  .rdp-table {
    width: 100%;
    max-width: 100%;
  }

  .rdp-weekdays,
  .rdp-week {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    color: ${colors.text.text2};
  }

  .rdp-day {
    width: 32px;
    height: 32px;

    margin: 0 auto;
  }

  .rdp-root {
    --rdp-day-width: 32px;
    --rdp-day-height: 32px;
    --rdp-day_button-width: 32px;
    --rdp-day_button-height: 32px;
    --rdp-months-gap: 8px;
  }
`;
