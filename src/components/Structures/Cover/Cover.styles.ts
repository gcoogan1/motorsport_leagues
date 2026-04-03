import styled from "styled-components";
import { designTokens } from "@app/design/tokens";

const { colors, layout, typography } = designTokens;

export const CoverWrapper = styled.div<{ $backgroundImageUrl?: string }>`
	display: flex;
  max-width: 1200px;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
	background: "transparent";
  gap: ${layout.space.large};

  ${layout.mediaQueries.mobile} {
    max-width: 360px;
  }
`;

export const CoverContainer = styled.div<{ $backgroundImageUrl?: string }>`
  width: 100%;
  height: 480px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  align-self: stretch;
  background-image: ${({ $backgroundImageUrl }) => $backgroundImageUrl ? `url(${$backgroundImageUrl})` : "none"};
  background-size: cover;
  background-position: center;
  gap: ${layout.space.large};

  ${layout.mediaQueries.mobile} {
    display: flex;
    flex-direction: column;
    align-items: center;
    align-self: stretch;
  }
`;

export const CoverTop = styled.div`
  display: flex;
  padding: ${layout.space.xLarge};
  justify-content: center;
  align-items: flex-start;
  gap: ${layout.space.xLarge};
  align-self: stretch;
  background: linear-gradient(180deg, #151515 0%, rgba(21, 21, 21, 0) 100%); // color.base.base2 

  ${layout.mediaQueries.mobile} {
    align-items: center;
    flex-direction: column;
    gap: ${layout.space.xSmall};
    padding: ${layout.space.xLarge} ${layout.space.medium};
  }
`

export const DetailsContainer = styled.div`
  display: flex;
  align-content: center;
  align-items: center;
  gap: ${layout.space.xSmall};
  flex: 1 0 0;
  flex-wrap: wrap;

  ${layout.mediaQueries.mobile} {
    display: flex;
    justify-content: center;
    align-self: stretch;
    flex-wrap: wrap;
  }
`;

export const ActionsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: ${layout.space.xSmall};

  ${layout.mediaQueries.mobile} {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    align-content: flex-start;
    align-self: stretch;
    flex-wrap: wrap;
  }
`;

export const CoverBottom = styled.div`
  display: flex;
  padding: ${layout.space.xLarge} ${layout.space.xLarge} 0 ${layout.space.xLarge};
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: ${layout.space.xSmall};
  align-self: stretch;
  background: linear-gradient(180deg, rgba(21, 21, 21, 0) 0%, #151515 80.29%); // color.base.base2 

  ${layout.mediaQueries.mobile} {
    padding: ${layout.space.xxLarge} ${layout.space.medium} 0 ${layout.space.medium};
  }
`

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${layout.space.xxxSmall};
  align-items: center;
  text-align: center;
`;

export const Title = styled.h1`
  ${typography.title.large};
  color: ${colors.text.text1};
`;

export const Description = styled.p`
  ${typography.body.mediumRegular};
  color: ${colors.text.text2};
`;

export const StatusContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  align-content: flex-start;
  gap: ${layout.space.xSmall};
  align-self: stretch;
  flex-wrap: wrap;
`
