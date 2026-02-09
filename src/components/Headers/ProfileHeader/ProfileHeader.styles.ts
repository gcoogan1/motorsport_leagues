import styled from "styled-components";
import { designTokens } from "@app/design/tokens";


const { colors, gradients, layout, borders, typography } = designTokens;

export const ProfileHeaderContainer = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  width: 100%;
  /* min-width: 920px; */
  min-height: 316px;

  ${layout.mediaQueries.mobile} {
    min-width: 360px;
    max-width: 920px;
    min-height: 440px;
    justify-content: flex-end;
    flex-direction: column;
  }
`


export const Frame = styled.div`
  position: absolute;
  width: 100%;
  height: 240px;
  top: 0;
  border-bottom-left-radius: ${borders.radius.round};
  background: ${gradients.base.fadeRight10};

  ${layout.mediaQueries.mobile} {
    height: 160px;
  }
`;

export const Contents = styled.div`
  width: 100%;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: flex-end;
  padding: 0 ${layout.space.xxLarge};

  ${layout.mediaQueries.mobile} {
    padding: 0 ${layout.space.xLarge};
  }
`;

export const DetailsContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 1200px;
  align-items: center;
  gap: ${layout.space.medium};

  ${layout.mediaQueries.mobile} {
    gap: 0;
    position: relative;
  }
`;

export const AvatarContainer = styled.div`
  display: flex;
  justify-content: center;
  border-radius: ${borders.radius.round};
  background: ${colors.base.base2};
  padding: ${layout.space.small};
`;

export const Details = styled.div`
  display: flex;
  flex: 1;
  gap: ${layout.space.xLarge};
  min-height: 200px;

  ${layout.mediaQueries.mobile} {
    flex-direction: column;
    align-items: center;
    gap: ${layout.space.medium};
  }
`;

export const TextContainer = styled.div`
  display: flex;
  flex: 1;
  padding-top: 20px;
  flex-direction: column;
  gap: 48px;

  ${layout.mediaQueries.mobile} {
    align-items: center;
  }
`;

export const TextContent = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: ${layout.space.xSmall};

  ${layout.mediaQueries.mobile} {
    align-items: center;
    gap: ${layout.space.xxxSmall};
  }
`;

export const Username = styled.h2`
  ${typography.title.large}
  color: ${colors.text.text1};
`;

export const UserGame = styled.p`
  ${typography.subtitle.xLargeItalic}
  color: ${colors.text.text2};
`;

export const TagContent = styled.div`
  display: flex;
  gap: ${layout.space.small};
  align-items: center;

  ${layout.mediaQueries.mobile} {
    flex-direction: column;
  }
`;

export const ChampionCountContent = styled.div`
  display: flex;
  border-radius: ${borders.radius.round};
  justify-content: center;
  align-items: center;;
  padding: ${layout.space.xxSmall} ${layout.space.small};
  background: ${colors.role.champion};
`;

export const ChampionCount = styled.p`
  ${typography.body.mediumBold}
  color: ${colors.text.text1};
`;

export const Actions = styled.div` 
  display: flex;
  align-self: flex-start;
  gap: ${layout.space.xSmall};
  padding-top: 56px;

    ${layout.mediaQueries.mobile} {
    position: absolute;
    right: 0;
  }
`