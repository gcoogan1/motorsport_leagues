import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { layout, colors } = designTokens;

export const PageWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${layout.space.xxxLarge} ${layout.space.medium};
  background-color: ${colors.base.base2};
`;
