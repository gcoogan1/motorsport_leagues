import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { layout, colors, gradients, borders, typography } = designTokens;

export const PageWrapper = styled.div`
  display: flex;
  width: 100%;
  flex: 1;
  padding: ${layout.space.xxxLarge};
  background-color: ${colors.base.base2};
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${layout.space.xLarge};
  gap: ${layout.space.xLarge};
  width: 100%;
  border-top-left-radius: ${borders.radius.xxxLarge};
  border-top-right-radius: ${borders.radius.xxxLarge};
  background: ${gradients.base.fadeBottom10};
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${layout.space.xSmall};
  text-align: center;
`;

export const Title = styled.h1`
  ${typography.title.large}
  color: ${colors.text.text1};

  ${layout.mediaQueries.mobile} {
    ${typography.title.medium}
  }
`;

export const Description = styled.p`
  ${typography.body.mediumRegular}
  color: ${colors.text.text2};
`;