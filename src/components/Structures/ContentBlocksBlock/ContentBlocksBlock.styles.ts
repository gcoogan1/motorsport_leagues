import styled, { css } from "styled-components";
import { designTokens } from "@app/design/tokens";
import { gradientBorder } from "@/app/design/mixens/gradientBorder";

const { colors, gradients, layout, typography, borders } = designTokens;

export const Container = styled.div<{ $isFlipped?: boolean }>`
  display: flex;
  width: 100%;
  max-width: 960px;
  padding-top: ${layout.space.medium};
  padding-bottom: ${layout.space.medium};
  padding-right: ${layout.space.medium};
  padding-left: 0px;
  align-items: center;
  gap: ${layout.space.xLarge};
  border-radius: ${layout.space.xxLarge};
  flex-direction: row;

  ${({ $isFlipped }) =>
    $isFlipped &&
    css`
      flex-direction: row-reverse;
      padding-left: ${layout.space.medium};
      padding-right: 0px;
      ${gradientBorder({
        gradient: gradients.base.fadeRight20,
        width: borders.width.medium,
      })};
    `};

    ${gradientBorder({
      gradient: gradients.base.fadeLeft20,
      width: borders.width.medium,
    })};

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
  width: 100%;
  height: 240px;
  flex: 1 0 0;
  aspect-ratio: 32/15;
  background: linear-gradient(270deg, rgba(21, 21, 21, 0) 69.71%, #151515 100%);
  background-image: ${({ $imageSrc }) => $imageSrc ? `url(${$imageSrc})` : "none"};
  border-top-right-radius: ${borders.radius.large};
  border-bottom-right-radius: ${borders.radius.large};

  ${({ $isFlipped }) =>
    $isFlipped &&
    css`
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
      border-top-left-radius: ${borders.radius.large};
      border-bottom-left-radius: ${borders.radius.large};
      background: linear-gradient(90deg, rgba(21, 21, 21, 0) 69.71%, #151515 100%);
    `};

  ${layout.mediaQueries.mobile} {
    width: 100%;
    height: 285px;
    aspect-ratio: auto;
    background: linear-gradient(180deg, rgba(21, 21, 21, 0) 69.71%, #151515 100%);
    border-radius: ${borders.radius.large};
  }
`

export const ContentTextContainer = styled.div`
  display: flex;
  flex: 1 0 0;
  flex-direction: column;
  align-items: flex-start;
  gap: ${layout.space.xxSmall};
  flex-shrink: 0;
`;

export const ContentTitle = styled.h2`
  ${typography.title.small};
  color: ${colors.base.text1};
`;

export const ContentDescription = styled.p`
  ${typography.body.mediumBold};
  color: ${colors.base.text2};
`;
