import styled, { css } from "styled-components";
import { designTokens } from "@/app/design/tokens";
import { gradientBorder } from "@/app/design/mixens/gradientBorder";
import { bottomFadeBorder } from "@/app/design/mixens/edgeFadeBorder";

const { gradients, layout, borders, typography } = designTokens;

export const Container = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 640px;
  border-radius: ${borders.radius.xLarge};

  ${gradientBorder({
    gradient: gradients.base.fadeBottom10,
    width: borders.width.medium,
  })};

`;


export const Header = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  padding: ${layout.space.medium} ${layout.space.xLarge};
  gap: ${layout.space.xSmall};
  border-top-left-radius: ${borders.radius.xLarge};
  

  ${( theme ) => css`
    background: ${theme.theme.theme.primaryGradientFadeRight50};

    ${bottomFadeBorder({
      gradient: theme.theme.theme.primaryGradientFadeRight50,
      width: borders.width.medium,
    })};
  `}
  `;

  export const HeaderTitle = styled.h2`
    ${typography.subtitle.largeItalic};
    color: ${( theme ) => theme.theme.theme.primaryA};
    flex: 2;
  `;

  export const ButtonContainer = styled.div`
    display: flex;
    align-items: center;
    gap: ${layout.space.xSmall};
  `;

  export const ContentContainer = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: self-start;
    align-self: stretch;
    padding: ${layout.space.xLarge};
    gap: ${layout.space.medium};
  `;