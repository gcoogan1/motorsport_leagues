import * as Select from "@radix-ui/react-select";
import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";


const { colors, layout, borders, typography } = designTokens;

export const DropdownMenuOption = styled.div`
  width: 100%;
  box-sizing: border-box;
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
  border: ${borders.width.medium} solid transparent;

  &:hover {
    background-color: ${colors.base.translucent20};
    border-color: transparent;
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
  margin: 0;
  text-transform: capitalize;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;

  ${layout.mediaQueries.mobile} {
    max-width: 120px;
  }
`

export const OptionInfo = styled.p`
  ${typography.body.smallRegular};
  color: ${colors.text.text2};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;

  ${layout.mediaQueries.mobile} {
    max-width: 120px;
  }
`

export const OptionIndicator = styled(Select.ItemIndicator)`
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  line-height: 0;
  flex-shrink: 0;
`;

