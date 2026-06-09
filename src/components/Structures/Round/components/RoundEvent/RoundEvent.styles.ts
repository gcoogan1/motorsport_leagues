import styled, { css } from "styled-components";

import { designTokens } from "@/app/design/tokens";

const { colors, layout, borders, typography } = designTokens;

export const EventContainer = styled.div`
  position: relative;
  overflow: hidden;
  background-origin: border-box;
  display: flex;
  width: 100%;
  min-width: 792px;
  max-width: 896px;
  padding: ${layout.space.xLarge};
  align-items: flex-start;
  align-content: flex-start;
  gap: ${layout.space.large};
  flex-wrap: wrap;
  border-top-left-radius: ${borders.radius.xxLarge};
  border-bottom-left-radius: ${borders.radius.xxLarge};

  ${({ theme }) =>
    css`
      background: ${theme.theme.primaryGradientFadeRight50};

      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: ${borders.width.medium};
        background: ${theme.theme.primaryGradientFadeBottom30};
        pointer-events: none;
      }
    `};
    
  ${layout.mediaQueries.mobile} {
    width: 100%;
    min-width: 0;
    max-width: 100%;
    box-sizing: border-box;
    padding: ${layout.space.large};
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${layout.space.medium};
  flex: 1 0 0;

  ${layout.mediaQueries.mobile} {
    width: 100%;
    min-width: 0;
    align-items: center;
  }
`;

export const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${layout.space.xSmall};
  align-self: stretch;

  ${layout.mediaQueries.mobile} {
    align-items: center;
  }
`;

export const AboutContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${layout.space.xxxSmall};
  align-self: stretch;

  ${layout.mediaQueries.mobile} {
    align-items: center;
  }
`;
export const EventName = styled.h4`
  ${typography.subtitle.largeItalic} color: ${({ theme }) =>
    theme.theme.primaryA};
`;

export const EventDate = styled.p`
  ${typography.subtitle.largeItalic} color: ${colors.text.text2};
`;

export const TrackName = styled.h2`
  ${typography.title.medium} color: ${colors.text.text1};
`;

export const SessionsContainer = styled.div`
  display: flex;
  align-items: flex-start;
  align-content: flex-start;
  align-self: stretch;
  gap: ${layout.space.xSmall};
  flex-wrap: wrap;

  ${layout.mediaQueries.mobile} {
    justify-content: center;
  }
`;

export const SessionContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${layout.space.xxSmall};
  color: ${colors.text.text2};
`;

export const SessionDivider = styled.p`
  ${typography.body.mediumBold} 
  color: ${colors.base.base4};
`;

export const AboutTextContainer = styled.div`
  display: flex;
  gap: ${layout.space.xxxSmall};
  flex-direction: column;
  align-items: flex-start;
`;

export const RaceTime = styled.p`
  ${typography.body.mediumBold} color: ${colors.text.text2};
`;

export const ButtonsContainer = styled.div`
  display: flex;
  align-content: center;
  align-items: center;
  align-self: stretch;
  flex-wrap: wrap;
  gap: ${layout.space.xSmall};

  ${layout.mediaQueries.mobile} {
    width: 100%;
    justify-content: center;
  }
`;
