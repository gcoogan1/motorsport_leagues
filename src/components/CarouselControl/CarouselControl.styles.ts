import styled from "styled-components";
import { designTokens } from "@app/design/tokens";

const { colors, layout, borders } = designTokens;

export const ControlWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${layout.space.small};
`;

export const Indicators = styled.div`
  display: flex;
  align-items: center;
  gap: ${layout.space.xxSmall};
`;

export const Indicator = styled.button<{ $isActive: boolean }>`
  width: ${({ $isActive }) =>
    $isActive ? "20px" : "8px"};

  height: 8px;
  padding: 0;
  border: none;
  border-radius: ${borders.radius.round};

  background: ${({ $isActive }) =>
    $isActive
      ? colors.text.text1
      : colors.base.translucent10};

  transition:
    width 180ms ease,
    background 180ms ease,
    transform 180ms ease;

  cursor: pointer;

  &:hover {
    transform: scale(1.05);
  }

  &:focus-visible {
    outline: 2px solid ${colors.utility.focus};
    outline-offset: 2px;
  }
`;