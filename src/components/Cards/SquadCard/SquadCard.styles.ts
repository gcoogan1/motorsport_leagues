import styled, { css } from "styled-components";
import { designTokens } from "@/app/design/tokens";
import { gradientBorder } from "@/app/design/mixens/gradientBorder";

const { colors, gradients, layout, borders, typography } = designTokens;


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

  width: 100%;
  /* min-width: 264px; */
  max-width: 384px;
  border-radius: ${borders.radius.xLarge};
  background: ${gradients.base.fadeBottom10};
  padding: ${layout.space.small};
  gap: ${layout.space.xSmall};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  ${gradientBorder({ gradient: colors.base.translucent10, width: borders.width.thin })};

  /* Interactive States */
  &:hover {
    background: ${colors.base.translucent10};
    ${gradientBorder({ gradient: colors.base.translucent10, width: borders.width.medium })};
  }

  &:focus-visible {
    background: ${colors.base.translucent10};
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
    flex-direction: row;
    gap: ${layout.space.small};
  `}
`;

export const ImageContainer = styled.div<{ $cardSize: "small" | "medium", $imageBg?: string }>`
  width: 100%;
  max-width: 360px;
  /* min-width: 240px; */
  height: 118px;
  max-height: 118px;
  align-self: stretch;
  border-radius: ${borders.radius.medium};
  background-color: ${colors.base.translucent10};
  background-image: ${({ $imageBg }) => $imageBg ? `url(${$imageBg})` : "none"};
  background-size: cover;
  background-position: center;
  flex-shrink: 0;

  /* Small Variant Overrides */
  ${({ $cardSize }) => $cardSize === "small" && css`
    width: 116px;
    min-width: 116px;
    max-width: 116px;
    height: 58px;
    max-height: 58px;
    align-self: center;
    border-radius: ${borders.radius.small};
  `}
`;

export const TextContainer = styled.div<{ $cardSize: "small" | "medium" }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${layout.space.xxxSmall};
  text-align: left;
  flex: 1;
  
  ${({ $cardSize }) => $cardSize === "small" && css`
    align-items: flex-start;
  `}

`

export const NameText = styled.p`
  ${typography.body.mediumBold};
  color: ${colors.text.text1};
`

export const MemberCountText = styled.p`
  ${typography.body.smallRegular};
  color: ${colors.text.text2};
`