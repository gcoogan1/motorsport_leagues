import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";
import { gradientBorder } from "@/app/design/mixens/gradientBorder";
import { bottomFadeBorder } from "@/app/design/mixens/edgeFadeBorder";

const { colors, gradients, layout, borders, typography } = designTokens;

export const Container = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 640px;
  border-radius: ${borders.radius.xLarge};

  ${gradientBorder({
    gradient: gradients.base.fadeBottom20,
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
  border-top-right-radius: ${borders.radius.xLarge};
  background: ${colors.base.fadeRight10};

    ${bottomFadeBorder({
      gradient: colors.base.fadeRight20,
      width: borders.width.medium,
    })};
  
  `;

  export const HeaderTitle = styled.h2`
    ${typography.subtitle.largeItalic};
    color: ${( theme ) => theme.theme.theme.primaryA};
    flex: 2;
  `;

  export const MoreContainer = styled.div`
    position: relative;
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