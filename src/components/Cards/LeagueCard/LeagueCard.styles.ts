import styled, { css } from "styled-components";
import { designTokens } from "@/app/design/tokens";
import { gradientBorder } from "@/app/design/mixens/gradientBorder";

const { colors, layout, borders, typography } = designTokens;


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
  box-sizing: border-box;

  width: 100%;
  /* min-width: 264px; */
  max-width: 384px;
  border-bottom-left-radius: ${borders.radius.xxLarge};
  border-bottom-right-radius: ${borders.radius.xxLarge};
  background: ${({ theme }) => theme.theme.primaryGradientFadeTop10};
  padding: ${layout.space.small};
  gap: ${layout.space.small};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  flex-shrink: 0;
  ${({ theme }) => gradientBorder({ gradient: theme.theme.primaryGradientFadeTop10, width: borders.width.medium })};

  /* Interactive States */
  &:hover {
    border-radius: ${({ $cardSize }) => $cardSize === "medium" ? borders.radius.xxLarge : borders.radius.medium};
    ${({ theme }) => gradientBorder({ gradient: theme.theme.primary30, width: borders.width.medium })};
  }

  &:focus-visible {
    border-radius: ${({ $cardSize }) => $cardSize === "medium" ? borders.radius.xxLarge : borders.radius.medium};
    ${({ theme }) => gradientBorder({ gradient: theme.theme.primary30, width: borders.width.medium })};
    outline: 2px solid ${colors.utility.focus};
    outline-offset: 2px;
  }

  &:active {
    border-radius: ${({ $cardSize }) => $cardSize === "medium" ? borders.radius.xxLarge : borders.radius.medium};
    background: ${colors.base.translucent10};
    ${({ theme }) => gradientBorder({ gradient: theme.theme.primaryA, width: borders.width.medium })};
  } 

  /* Small Variant Overrides (Targeting Children) */
  ${({ $cardSize }) => $cardSize === "small" && css`
    border-radius: ${borders.radius.medium};
    flex-direction: row;
    align-items: center;

    ${layout.mediaQueries.mobile} {
      flex-direction: column;
    }
  `}
`;


export const ImageContainer = styled.div<{ $cardSize: "small" | "medium", $imageBg?: string }>`
  width: 100%;
  max-width: 360px;
  height: 160px;
  align-self: stretch;
  border-radius: ${borders.radius.medium};
  background-color: ${colors.base.translucent10};
  background-image: ${({ $imageBg }) => $imageBg ? `url(${$imageBg})` : "none"};
  background-size: cover;
  background-position: center;
  flex-shrink: 0;

  /* Small Variant Overrides */
  ${({ $cardSize }) => $cardSize === "small" && css`
    width: 180px;
    height: 80px;
    align-self: center;
    border-radius: ${borders.radius.small};

    ${layout.mediaQueries.mobile} {
      align-self: flex-start;
    }
  `}
`;

export const IndicatorsContainer = styled.div`
  display: flex;
  padding: ${layout.space.xSmall};
  justify-content: flex-end;
  border-radius: inherit;
  align-items: center;
  gap: ${layout.space.xxSmall};
  align-self: stretch;
  background: ${({ theme }) => theme.theme.primaryGradientFadeLeft};
  flex-wrap: wrap;
`

export const TextContainer = styled.div<{ $cardSize: "small" | "medium" }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px ${layout.space.small};
  gap: ${layout.space.xxSmall};
  text-align: left;
  align-self: stretch;
  flex: 1;
  width: 100%;
  
  ${({ $cardSize }) => $cardSize === "small" && css`
    display: flex;
    min-width: 80px;
    padding: 0px;
    flex: 1 0 0;
  `}
`

export const LeagueName = styled.h3<{ $cardSize: "small" | "medium" }>`
  ${typography.title.xSmall};
  color: ${colors.text.text1};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  
  ${({ $cardSize }) => $cardSize === "small" && css`
    max-width: 120px;
    ${typography.body.mediumBold};
  `}

  ${layout.mediaQueries.mobile} {
    max-width: 100%;
  }
`

/* Details Section for Medium Size */
export const LeagueInfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${layout.space.xSmall};
  align-self: stretch;
  color: ${colors.text.text2};
`

export const LeagueInfoContent = styled.div`
  display: flex;
  gap: ${layout.space.xxSmall};
`

export const LeagueInfoText = styled.p`
  ${typography.body.smallBold};
  color: ${colors.text.text2};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const Divider = styled.div`
  width: 1px;
  height: 24px;
  background: ${colors.base.translucent10};
`


/* Squad Info for Small Size */
export const SquadInfoText = styled.p`
  ${typography.body.smallRegular};
  color: ${colors.text.text2};

  ${layout.mediaQueries.mobile} {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`
