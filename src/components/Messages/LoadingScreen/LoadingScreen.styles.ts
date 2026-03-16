import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { colors, layout, typography } = designTokens;

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  background-color: ${colors.base.base2};
  padding: ${layout.space.xLarge};
`;

export const Text = styled.p`
  ${typography.title.medium}
  color: ${colors.text.text1};
`;
