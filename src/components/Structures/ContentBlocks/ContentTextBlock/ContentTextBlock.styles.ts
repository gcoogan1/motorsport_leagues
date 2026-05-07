import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { colors, layout, typography } = designTokens;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 0 0 400px;
  min-width: 0;
  gap: ${layout.space.xxSmall};

  ${layout.mediaQueries.mobile} {
    flex: 1 1 auto;
    width: 100%;
  }
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
