import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { colors, layout, typography, borders } = designTokens;

export const InputWrapper = styled.div`
  width: 100%;
`;

export const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const InputField = styled.input`
  width: 100%;
  height: 52px;
  box-sizing: border-box;
  border-radius: ${borders.radius.medium};
  padding: ${layout.space.medium};
  border: none;
  background: ${colors.base.translucent10};
  color: ${colors.text.text1};
  text-align: center;
  font-size: 16px;

  &::placeholder {
    ${typography.body.mediumRegular}
    color: ${colors.text.text2};
  }

  &:hover {
    background: ${colors.base.translucent20};
  }

  &:focus-visible {
    background: transparent;
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
