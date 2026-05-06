import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { colors, layout, typography } = designTokens;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 400px;
  gap: ${layout.space.xxSmall};

  `;

export const Title = styled.h2`
  ${typography.title.small};
  margin: 0;
  color: ${colors.text.text1};
`;

export const Message = styled.p`
  ${typography.body.mediumRegular};
  margin: 0;
  color: ${colors.text.text2};
`;