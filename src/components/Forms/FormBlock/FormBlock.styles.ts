import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";
import { gradientBorder } from "@/app/design/mixens/gradientBorder";

const { colors, gradients, layout, borders, typography } = designTokens;

export const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 480px;
  border-radius: ${borders.radius.xxxLarge};
  background: ${colors.base.base1};

  /* Gradient Border */
  ${gradientBorder({
    gradient: gradients.base.fadeBottom20,
    width: borders.width.medium,
  })}
`;

export const FormHeader = styled.div`
  position: relative;
  flex-direction: column;
  align-items: center;
  padding: ${layout.space.medium} ${layout.space.xxLarge};
  gap: ${layout.space.xSmall};
  border-bottom-left-radius: ${borders.radius.round};
  border-bottom-right-radius: ${borders.radius.round};

  /* Allow width to be determined by content */
  display: inline-flex;
  width: fit-content;
  align-self: center;


  /* Rounded Gradient Border Effect */
  ${gradientBorder({
    gradient: gradients.base.fadeTop20,
    width: borders.width.medium,
  })}
`;

export const HeaderTitle = styled.h3`
  ${typography.subtitle.mediumItalic};
  color: ${colors.text.text3};
`;

export const FormBody = styled.div<{ $isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding: ${({ $isMobile }) =>
    $isMobile
      ? `${layout.space.xxLarge} ${layout.space.xLarge}`
      : `${layout.space.xxLarge}`};
  gap: ${layout.space.xLarge};
`;

export const BodyHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${layout.space.xxxSmall};
`;

export const BodyTitle = styled.h2`
  ${typography.title.small};
  color: ${colors.text.text1};
  text-transform: capitalize;
`;

export const BodySubtitle = styled.p`
  ${typography.body.mediumRegular};
  color: ${colors.text.text2};
`;

export const BodyInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${layout.space.medium};
  width: 100%;
`;

export const FormActions = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${layout.space.large} ${layout.space.xLarge};
  gap: ${layout.space.medium};
  border-top: ${borders.width.medium} solid ${colors.base.translucent10};
  border-bottom: ${borders.width.medium} solid ${colors.base.translucent10};
  border-bottom-left-radius: ${borders.radius.xxxLarge};
  border-bottom-right-radius: ${borders.radius.xxxLarge};
`;

export const SecondaryButtonContainer = styled.div`
  flex: 1;
`;
