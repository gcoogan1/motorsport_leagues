import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { colors, typography, layout } = designTokens;

export const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  align-self: center;
  padding: ${layout.space.xxLarge} ${layout.space.medium};
  gap: ${layout.space.large};
`;

export const TextContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: ${layout.space.xxSmall};
  width: 100%;
`;

export const Title = styled.h2`
  ${typography.title.small}
  color: ${colors.text.text2};
  text-align: center;
`;