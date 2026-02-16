import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";


const { colors, layout, borders, typography } = designTokens;

export const DropdownMenuOption = styled.div`
  width: 100%;
  padding-top: ${layout.space.small};
  padding-bottom: ${layout.space.small};
  padding-left: ${layout.space.medium};
  padding-right: ${layout.space.small};
  border-radius: ${borders.radius.large};
  color: ${colors.text.text1};
  display: flex;
  align-items: center;
  gap: ${layout.space.xxxSmall};
  background: transparent;

  &:hover {
    background-color: ${colors.base.translucent20};
    border: none;
    outline: none;
  }

  /*Focus state for Radix*/ 

  &[data-highlighted]:not(:hover) {
  outline: 2px solid ${colors.utility.focus};
  background: ${colors.base.translucent10};
  outline-offset: 2px;
}


  &:active {
    border: ${borders.width.medium} solid ${colors.base.translucent30};
    background: ${colors.base.translucent10};
  }
`;

export const OptionContent = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: ${layout.space.xSmall};
`

export const OptionTypeContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${layout.space.xSmall};
`

export const OptionLabel = styled.p`
  ${typography.body.mediumBold};
  color: ${colors.text.text1};
`

export const OptionInfo = styled.p`
  ${typography.body.smallRegular};
  color: ${colors.text.text2};
`

