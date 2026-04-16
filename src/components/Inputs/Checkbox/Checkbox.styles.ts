import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { colors, layout, typography, borders } = designTokens;

// Main Checkbox that wraps icon
export const CheckboxContainer = styled.button`
  // Reset default button styles
  all: unset;
  cursor: pointer;
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: transparent;
  color: ${colors.text.text1};

  &::before {
    content: "";
    position: absolute;
    width: 32px;
    height: 32px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: ${borders.radius.round};
    background: transparent;
    pointer-events: none;
  }

  &:hover::before {
    background: ${colors.base.translucent10};
  }

  &:active::before {  
    background: ${colors.base.translucent20};
  }

  &:focus-visible {
    border-radius: ${borders.radius.small};
    outline: 2px solid ${colors.utility.focus};
    outline-offset: 2px;
  } 
`;


export const CheckboxWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${layout.space.xSmall};
  /* width: 320px; */
`
  
export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
`

export const Label = styled.label`
  ${typography.body.mediumBold}
  color: ${colors.text.text1};
`

export const HelperMessage = styled.p`
  ${typography.body.smallRegular}
  color: ${colors.text.text2};
`