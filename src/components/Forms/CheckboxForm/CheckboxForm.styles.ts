import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";


const { colors, layout, gradients, borders } = designTokens;

export const FormWrapper = styled.div< { $isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${layout.space.medium};
  border-radius: ${borders.radius.xLarge};
  align-items: center;
  background: ${({ $isSelected }) =>    $isSelected ? gradients.base.fadeBottom10 : "transparent"};
  border: ${borders.width.thin} solid ${colors.base.translucent10};
`

export const CheckboxContainer = styled.div<{ isSelected: boolean }>`
  display: flex;
  padding: ${layout.space.medium};
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
  border-bottom: ${({ isSelected }) => isSelected ? `${borders.width.thin} solid ${colors.base.translucent10}` : `none`};
`

export const FormList = styled.form`
  display: flex;
  padding: ${layout.space.medium};
  flex-direction: column;
  align-items: flex-start;
  gap: ${layout.space.xSmall};
  width: 100%;
  align-self: stretch;
`