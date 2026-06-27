import styled, { css } from "styled-components";
import { designTokens } from "@app/design/tokens";
import { gradientBorder } from "@/app/design/mixens/gradientBorder";

const { colors, gradients, layout, typography, borders } = designTokens;

export const Container = styled.div<{ $isFlipped?: boolean }>`
  display: flex;
  width: 100%;
  max-width: 960px;
  overflow: hidden;
  padding-top: ${layout.space.medium};
  padding-bottom: ${layout.space.medium};
  padding-right: ${layout.space.medium};
  padding-left: 0px;
  align-items: center;
  gap: ${layout.space.xLarge};
  border-radius: ${borders.radius.xxLarge};
  flex-direction: row-reverse;

  ${gradientBorder({
      gradient: gradients.base.fadeLeft20,
      width: borders.width.medium,
    })};

  ${({ $isFlipped }) =>
    $isFlipped &&
    css`
      flex-direction: row;
      padding-left: ${layout.space.medium};
      padding-right: 0px;
      ${gradientBorder({
        gradient: gradients.base.fadeRight20,
        width: borders.width.medium,
      })};
    `};


  ${layout.mediaQueries.mobile} {
    flex-direction: column;
    padding: ${layout.space.medium};
    gap: ${layout.space.medium};
    max-width: 640px;
    
    ${gradientBorder({
      gradient: gradients.base.fadeBottom20,
      width: borders.width.medium,
    })};
  }
`;

export const ImageContainer = styled.div<{ $imageSrc?: string, $isFlipped?: boolean }>`
  position: relative;
  overflow: hidden;
  flex: 1;
  width: auto;
  aspect-ratio: 32/15;
  min-width: 0;
  background-image: ${({ $imageSrc }) => ($imageSrc ? `url(${$imageSrc})` : "none")};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-top-left-radius: ${borders.radius.large};
  border-bottom-left-radius: ${borders.radius.large};
  
  &::before {
    background: linear-gradient(90deg, rgba(21, 21, 21, 0) 69.71%, #151515 100%);
  }
  
  ${({ $isFlipped }) =>
    !$isFlipped &&
  css`
  border-top-right-radius: ${borders.radius.large};
  border-bottom-right-radius: ${borders.radius.large};
      &::before {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: linear-gradient(270deg, rgba(21, 21, 21, 0) 69.71%, #151515 100%);
      }

    `};

  ${layout.mediaQueries.mobile} {
    width: 100%;
    height: 285px;
    min-height: 285px;
    flex: 0 0 auto;
    aspect-ratio: auto;
    border-radius: ${borders.radius.large};

    &::before {
      background: linear-gradient(180deg, rgba(21, 21, 21, 0) 69.71%, #151515 100%);
    }
  }
`

export const ContentTextContainer = styled.div`
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  justify-content: center;
  gap: ${layout.space.xxSmall};
`;

export const ContentTitle = styled.h2`
  ${typography.title.small};
  color: ${colors.text.text1};
`;

export const ContentDescription = styled.p`
  ${typography.body.mediumBold};
  color: ${colors.text.text2};
`;
