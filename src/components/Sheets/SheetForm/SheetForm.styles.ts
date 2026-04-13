import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";
import { gradientBorder } from "@/app/design/mixens/gradientBorder";

const { colors, gradients, layout, borders, typography } = designTokens;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  border-radius: ${borders.radius.xxxLarge};
  background: ${({ theme }) => theme.theme.primaryGradientFadeBottom30};
  padding: ${layout.space.xxLarge} ${layout.space.xLarge};
  gap: ${layout.space.xLarge};
`;

export const FormHeader = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  align-self: stretch;
  gap: ${layout.space.medium};
`;

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
`

export const Name = styled.h2`
  ${typography.subtitle.mediumItalic};
  color: ${({ theme }) => theme.theme.primary30};
  margin: 0;
`;

export const Header = styled.p`
  ${typography.title.medium};
  color: ${colors.text.text1};
  margin: 0;
`;

export const BlockContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: center;
  justify-content: center;
  width: 100%;
  max-width: 640px;
  gap: ${layout.space.medium};
  background: ${gradients.base.fadeTop10};
  border-radius: ${borders.radius.xLarge};
  padding: ${layout.space.large} ${layout.space.xxLarge};
  gap: ${layout.space.medium};

  ${gradientBorder({
    gradient: gradients.base.fadeBottom10,
    width: borders.width.medium,
  })}

  ${layout.mediaQueries.mobile} {
    padding: ${layout.space.large};
  }
`;

export const BlockHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
  text-align: center;
`;

export const BlockHeader = styled.h3`
  ${typography.subtitle.medium};
  color: ${({ theme }) => theme.theme.primaryA};
  margin: 0;
`;

export const BlockDescription = styled.p`
  ${typography.body.mediumRegular};
  color: ${colors.text.text2};
  margin: 0;
`;

export const BlockContents = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${layout.space.xSmall};
  align-self: stretch;
`;

export const DetailsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
  justify-content: center;
  text-align: center;
`;

export const DetailsTitle = styled.h3`
  ${typography.subtitle.largeItalic};
  color: ${({ theme }) => theme.theme.primaryA};
  margin: 0;
`;

export const DetailsContent = styled.p`
  ${typography.body.smallRegular};
  color: ${colors.text.text2};
  margin: 0;
`;

export const FormList = styled.div`
  display: flex;
  max-width: 640px;
  flex-direction: column;
  gap: ${layout.space.medium};
  align-self: center;
`;

export const ButtonContainer = styled.div`
  position: absolute;
  right: 24px;
  top: 24px;
`;