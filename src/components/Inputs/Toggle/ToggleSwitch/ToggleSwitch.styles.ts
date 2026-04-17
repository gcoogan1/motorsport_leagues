import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { colors, layout, borders } = designTokens;

export const ToggleSwitchWrapper = styled.div<{ $isOn: boolean }>`
  display: flex;
  width: 36px;
  height: 20px;
  padding: ${layout.space.xxxSmall};
  align-items: center;
  border-radius: ${borders.radius.round};
  background: ${({ $isOn }) => $isOn ? colors.utility.success : colors.text.text3};
  cursor: pointer;

  &:hover {
    background: ${({ $isOn }) => $isOn ? colors.utility.success : colors.text.text2};
  }

  &:active {
    background: ${({ $isOn }) => $isOn ? colors.utility.success : colors.text.text2};
  }

  &:focus-visible {
    outline: 2px solid ${colors.utility.focus};
    outline-offset: 2px;
    background: ${({ $isOn }) => $isOn ? colors.utility.success : colors.text.text2};
  }
`;

export const ToggleThumb = styled.div<{ $isOn: boolean }>`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  border-radius: ${borders.radius.round};
  background: ${colors.text.text1};
  transition: transform 0.2s ease-in-out;
  transform: ${({ $isOn }) => $isOn ? "translateX(16px)" : "translateX(0)"};
`;
