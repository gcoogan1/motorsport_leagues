import styled from "styled-components"

import { designTokens } from "@app/design/tokens/index";
import ML_Horizontal from "@assets/Logos/MS/ML_Horizontal.svg?react";

const { borders, layout, colors } = designTokens;

export const Wrapper = styled.div`
  display: flex;
  width: 100%;
  padding: ${layout.space.xxxLarge} 0px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-top-width: ${borders.width.thin};
  border-top-style: solid;
  border-color: ${colors.base.translucent10};
  background: ${colors.base.base1};
`

export const Container = styled.div`
  display: flex;
  width: 100%;
  max-width: 960px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: ${layout.space.xxxLarge} 0px;
  background: ${colors.base.base1};
`

export const Logo = styled<typeof ML_Horizontal>(ML_Horizontal)`
  width: 198px;
  height: 40px;
  color: ${colors.text.text3};
`;