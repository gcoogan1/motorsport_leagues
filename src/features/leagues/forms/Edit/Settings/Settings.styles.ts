import styled from "styled-components";
import { designTokens } from "@app/design/tokens";

const { colors, typography, layout } = designTokens;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${layout.space.xSmall};
  align-self: stretch;
`

export const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${layout.space.xxLarge};
  align-self: stretch;
`

export const FormList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${layout.space.medium};
  align-self: stretch;
`

export const LoadingContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: stretch;
  
  ${typography.title.medium}
  color: ${colors.text.text1};
`