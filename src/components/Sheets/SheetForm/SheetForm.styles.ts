import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";
import { topFadeBorder } from "@/app/design/mixens/edgeFadeBorder";

const { colors, gradients, layout, borders, typography } = designTokens;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: ${borders.radius.xxxLarge};
  background: ${gradients.base.fadeBottom30};
  padding: ${layout.space.xxLarge} ${layout.space.xLarge};
  gap: ${layout.space.xLarge};
`;

export const FormHeader = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
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
  align-self: stretch;
  width: 100%;
  max-width: 640px;
  gap: ${layout.space.medium};
  background: ${gradients.base.fadeTop10};
  border-radius: ${borders.radius.xLarge};
  padding: ${layout.space.large} ${layout.space.xxLarge};
  gap: ${layout.space.medium};

  ${topFadeBorder({
    gradient: gradients.base.fadeBottom10,
    width: borders.width.medium,
  })}
`;