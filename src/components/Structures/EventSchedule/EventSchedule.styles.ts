import styled from "styled-components";
import { designTokens } from "@app/design/tokens";

const { colors, gradients, layout, borders, typography } = designTokens;

export const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: ${layout.space.medium};
  border-radius: ${borders.radius.xLarge};
  gap: ${layout.space.medium};
  background: ${gradients.base.fadeRight10};
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1 0 0;
`;

export const Title = styled.h3`
  ${typography.subtitle.mediumItalic};
  color: ${colors.text.text1};
  margin: 0;
`;

export const Subtitle = styled.p`
  ${typography.body.smallRegular};
  color: ${colors.text.text2};
  margin: 0;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${layout.space.xSmall};
`;