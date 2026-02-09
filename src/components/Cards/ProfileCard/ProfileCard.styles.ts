import styled, { css } from "styled-components";
import { designTokens } from "@/app/design/tokens";
import { gradientBorder } from "@/app/design/mixens/gradientBorder";

const { colors, gradients, layout, borders, typography } = designTokens;

// "Dumb" Sub-components (No props) -> props used in ClickableWrapper ONLY; this is because they affect too many children
// used to avoid too many prop drilling and styled-component re-renders

export const Frame = styled.div`
  position: absolute;
  width: 100%;
  height: 40px;
  top: 0;
  border-top-right-radius: ${borders.radius.large};
  border-top-left-radius: ${borders.radius.large};
  border-bottom-left-radius: ${borders.radius.round};
  background: ${gradients.base.fadeRight10};
`;

export const Content = styled.div`
  position: relative;
  z-index: 1;
  border-radius: ${borders.radius.large};
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
  padding: ${layout.space.small} ${layout.space.medium};
  gap: ${layout.space.xxSmall};
`;

export const AvatarWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${gradients.base.fadeTop10};
  gap: 10px;
  padding: ${layout.space.xxSmall};
  border-radius: ${borders.radius.round};
`;

export const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${layout.space.xxxSmall};
`;

export const Username = styled.h3`
  ${typography.title.xSmall}
  color: ${colors.text.text1};
`;

export const UserGame = styled.p`
  ${typography.body.smallBold}
  color: ${colors.text.text2};
`;

// Centralized "Smart" Wrapper
export const ClickableWrapper = styled.button<{ $cardSize: "small" | "medium" }>`
  /* Reset Styles */
  appearance: none;
  border: none;
  background: none;
  padding: 0;
  font: inherit;
  color: inherit;
  z-index: 0;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  width: 100%;
  min-width: 264px;
  max-width: 384px;
  border-radius: ${borders.radius.large};
  background: ${gradients.base.fadeTop10};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex-shrink: 0;
  
  ${gradientBorder({ gradient: gradients.base.fadeTop10, width: borders.width.thin })}

  /* Interactive States */
  &:hover {
    background: ${colors.base.translucent10};
    ${gradientBorder({ gradient: colors.base.translucent10, width: borders.width.thin })};
  }

  &:focus-visible {
    background: ${colors.base.translucent10};
    ${gradientBorder({ gradient: colors.base.translucent10, width: borders.width.thin })};
    outline: 2px solid ${colors.utility.focus};
    outline-offset: 2px;
  }

  &:active {
    background: ${colors.base.translucent10};
    ${gradientBorder({ gradient: colors.base.translucent30, width: borders.width.medium })};
  } 

  /* Small Variant Overrides (Targeting Children) */
  ${({ $cardSize }) => $cardSize === "small" && css`
    border-radius: ${borders.radius.medium};

    ${Frame} {
      width: 64px;
      height: 100%;
      left: 0;
      border-bottom-right-radius: ${borders.radius.round};
      border-bottom-left-radius: ${borders.radius.medium};
    }

    ${Content} {
      flex-direction: row;
      padding: ${layout.space.small} ${layout.space.medium};
      gap: ${layout.space.small};
    }

    ${TextContent} {
      align-items: flex-start;
    }

    ${Username} {
      ${typography.body.mediumBold}
      text-transform: capitalize;
    }

    ${UserGame} {
      ${typography.body.smallRegular}
    }
  `}
`;
