import styled, { css } from "styled-components";
import HeroImage from "@/assets/Homepage/hero.png";

import { designTokens } from "@/app/design/tokens";
import { gradientBorder } from "@/app/design/mixens/gradientBorder";

const { colors, gradients, layout, typography, borders } =
  designTokens;

// export const Wrapper = styled.div`
//   display: flex;
//   flex: 1;
//   flex-direction: column;
//   align-items: center;
//   padding: ${layout.space.xxxLarge};
//   background-color: ${colors.base.base2};

//   ${layout.mediaQueries.mobile} {
//     padding: ${layout.space.xxLarge};
//   }
// `;

// export const Container = styled.div`
//   width: 100%;
//   display: flex;
//   flex: 1;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   gap: ${layout.space.medium};
//   background: ${({ theme }) => theme.theme.primaryGradientFadeTop10};
//   border-bottom-right-radius: ${borders.radius.xxxLarge};
//   border-bottom-left-radius: ${borders.radius.xxxLarge};
// `;

// export const SubTitle = styled.h2`
//   ${typography.subtitle.largeItalic};
//   background: ${({ theme }) => theme.theme.primaryGradientFadeBottom};
//   text-align: center;
//   background-clip: text;
//   -webkit-background-clip: text;
//   color: transparent;
//   display: inline-block;
// `;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
  flex: 1;
`;

export const Hero = styled.div`
  display: flex;
  padding: 0 ${layout.space.medium};
  flex-direction: column;
  align-items: center;
  align-self: stretch;
  justify-content: flex-end;
  height: 640px;
  background: ${gradients.base.fadeTop10};
  background-image: url(${HeroImage});
  background-size: cover;
  background-position: center;
`;

export const Container = styled.div`
  display: flex;
  width: 100%;
  max-width: 1200px;
  padding-top: ${layout.space.xxxLarge};
  padding-bottom: ${layout.space.xxxLarge};
  flex-direction: column;
  gap: ${layout.space.xLarge};
  align-items: center;
  justify-content: center;
`;

export const TextContainer = styled.div`
  display: flex;
  max-width: 640px;
  flex-direction: column;
  align-items: center;
  gap: ${layout.space.xSmall};
  justify-content: center;
  text-align: center;
`;

export const Title = styled.h1`
  ${typography.title.large};
  /* color: ${colors.text.text1}; */
  color: rgba(255, 204, 0, 1);
`;

export const SubTitle = styled.h2`
  ${typography.body.mediumRegular};
  color: ${colors.text.text1};
`;

export const ButtonContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${layout.space.xSmall};
`;

// -- SECTIONS (GENERAL) -- //
export const SectionTitle = styled.h1`
  ${typography.title.medium};
  color: ${colors.text.text1};
`;

export const SectionSubTitle = styled.h2`
  ${typography.body.mediumRegular};
  color: ${colors.text.text2};
`;

export const SectionList = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: ${layout.space.xLarge};

  ${layout.mediaQueries.mobile} {
    flex-direction: column;
  }
`;

// -- GAMES SECTION -- //

export const Games = styled.div`
  display: flex;
  width: 100%;
  padding: 0px ${layout.space.medium};
  flex-direction: column;
  align-items: center;
  // align-self: stretch;
`;

export const GamesContainer = styled.div`
  display: flex;
  max-width: 1200px;
  padding: 80px 0;
  justify-content: center;
  align-items: flex-start;
  gap: ${layout.space.xxxLarge};
  flex-wrap: wrap;
`;

export const GameImage = styled.img`
  width: 120px;
  height: 48px;
  aspect-ratio: 5/2;
  opacity: 0.6;
`;

// -- PATH SECTION -- //

export const Paths = styled.div`
  display: flex;
  width: 100%;
  padding: 0px ${layout.space.medium};
  justify-content: center;
  align-items: center;
  flex: 1;
  background: ${gradients.base.fadeBottom10};
`;

export const PathContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 1200px;
  padding: 160px 0;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: ${layout.space.xxLarge};
  flex-wrap: wrap;

  ${layout.mediaQueries.mobile} {
    padding: 80px 0;
  }
`;

export const PathItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${layout.space.xLarge};
  padding: ${layout.space.medium};
  text-align: center;
  border-radius: ${borders.radius.xLarge};
  color: ${colors.text.text2};

  ${gradientBorder({
    gradient: gradients.base.fadeBottom20,
    width: borders.width.thick,
  })};

  ${layout.mediaQueries.mobile} {
    width: 100%;
    max-width: 340px;
  }
`;

export const PathItemImage = styled.img`
  display: flex;
  width: 100%;
  height: auto;
  aspect-ratio: 21/10;

  border-radius: ${borders.radius.xLarge};
`;

// export const PathItemImageContainer = styled.div`
//   display: flex;
//   width: 100%;
//   height: 164px;
//   justify-content: center;
//   align-items: center;
//   // align-self: stretch;
//   border-radius: ${borders.radius.xLarge};
//   background: ${gradients.base.fadeBottom10};

//   ${layout.mediaQueries.mobile} {
//     height: 160px;
//   }
// `;

// export const GraphicContainer = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   padding: ${layout.space.medium};
//   border-radius: ${borders.radius.xxLarge};
//   ${gradientBorder({
//     gradient: gradients.base.fadeOutHorizontal10,
//     width: borders.width.thin,
//   })};
// `;

// export const IconWrapper = styled.div`
//   color: ${colors.base.translucent20};
//   width: 48px;
//   height: 48px;
//   display: flex;
//   align-items: center;
//   justify-content: center;

//   svg {
//     width: 100%;
//     height: 100%;
//   }
// `;

export const PathContent = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  gap: ${layout.space.medium};
  // align-self: stretch;
  padding: 0px ${layout.space.medium};
`;

export const PathContentTitle = styled.h2`
  ${typography.title.small};
  color: ${colors.text.text1};
`;

export const PathContentSubTitle = styled.h3`
  ${typography.body.mediumRegular};
  color: ${colors.text.text2};
`;

export const PathContentButtons = styled.div`
  display: flex;
  width: 100%;
  gap: ${layout.space.xSmall};
  flex-direction: column;
  align-items: center;
  // align-self: stretch;
`;

// -- VIP SECTION -- //

export const VIPSection = styled.div`
  display: flex;
  width: 100%;
  padding: 0px ${layout.space.medium};

  background: ${(theme) => theme.theme.theme.primaryGradientFadeTop10};
  border-width: ${borders.width.medium};
  border-style: solid;
  border-color: transparent;
  border-top-color: ${(theme) => theme.theme.theme.primaryA3};
  border-bottom-color: ${(theme) => theme.theme.theme.primaryA3};
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const VIPContainerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: center;
`;

export const VIPContainer = styled.div`
  display: flex;
  max-width: 1200px;
  padding: 160px 0 ${layout.space.xxLarge} 0;
  flex-direction: column;
  align-items: center;
  gap: ${layout.space.xxLarge};
  // align-self: stretch;
  ${layout.mediaQueries.mobile} {
    padding: 80px 0;
  }
`;

export const VIPMiniTitle = styled.h2`
  ${typography.title.xSmall};
  /* color: ${(theme) => theme.theme.theme.primaryA3}; */
  color: rgba(255, 204, 0, 0.6);
  text-align: center;
`;

export const VIPTitle = styled.h1`
  ${typography.title.large};
  text-align: center;
  color: rgba(255, 204, 0, 1);
  /* color: ${(theme) => theme.theme.theme.primaryA}; */
`;

export const VIPSubTitle = styled.h2`
  ${typography.body.mediumRegular};
  color: ${colors.text.text2};
  text-align: center;
`;

export const VIPList = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 64px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

export const VIPItemTop = styled.div`
  display: flex;
  padding: ${layout.space.medium};
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  // align-self: stretch;
  border-radius: ${borders.radius.xxLarge};

  ${(theme) =>
    gradientBorder({
      gradient: theme.theme.theme.primaryGradientFadeTop10,
      width: borders.width.thick,
    })};

  ${layout.mediaQueries.mobile} {
    padding: ${layout.space.xLarge} ${layout.space.medium};
  }
`;

export const VIPLeagueContainer = styled.div`
  display: flex;
  align-items: center;
  // align-self: stretch;
  border-radius: ${borders.radius.xLarge};
  padding: ${layout.space.xxLarge};
  gap: ${layout.space.xxLarge};
  background: ${(theme) => theme.theme.theme.primaryGradientFadeTop10};

  ${(theme) =>
    gradientBorder({
      gradient: theme.theme.theme.primaryGradientFadeBottom,
      width: borders.width.thick,
    })};

  ${layout.mediaQueries.mobile} {
    flex-direction: column;
    gap: ${layout.space.medium};
    padding: ${layout.space.xLarge} ${layout.space.medium};
  }
`;

export const VIPLeagueContents = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  flex: 1;
  text-align: left;
  gap: ${layout.space.medium};

  ${layout.mediaQueries.mobile} {
    padding: 0 ${layout.space.xSmall};
    max-width: 380px;
  }
`;

export const VIPLeagueContentsTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${layout.space.xxSmall};
`;

export const VIPLeagueContentsTitle = styled.h2`
  ${typography.title.medium};
  color: ${colors.text.text1};
  text-align: left;
`;

export const VIPLeagueContentsSubTitle = styled.h3`
  ${typography.body.mediumRegular};
  color: ${colors.text.text2};
`;

export const VIPLeagueContentsButtons = styled.div`
  display: flex;
  width: 100%;
  gap: ${layout.space.xSmall};
  align-items: flex-start;
  align-content: flex-start;
  flex-wrap: wrap;
`;

export const VIPItemBottom = styled.div`
  display: flex;
  padding: ${layout.space.xxLarge};
  gap: ${layout.space.xxLarge};
  border-radius: ${borders.radius.xxLarge};
  flex-direction: column;
  align-items: center;
  // align-self: stretch;

  ${gradientBorder({
    gradient: gradients.base.fadeBottom10,
    width: borders.width.thick,
  })};

  ${layout.mediaQueries.mobile} {
    padding: ${layout.space.xLarge} ${layout.space.medium};
    gap: ${layout.space.xLarge};
    flex-direction: column;
  }
`;

export const VIPItemBottomItem = styled.div<{ $purple?: boolean }>`
  display: flex;
  padding: ${layout.space.xLarge};
  flex-direction: column;
  align-items: flex-start;
  gap: ${layout.space.xLarge};
  flex: 1;
  border-radius: ${borders.radius.xLarge};
  background:
    linear-gradient(
      180deg,
      rgba(140, 203, 255, 0.20) 0%,
      rgba(140, 203, 255, 0.00) 100%
    ),
    linear-gradient(180deg, #000 0%, rgba(0, 0, 0, 0.00) 100%);

  ${gradientBorder({
    gradient: gradients.base.fadeBottom20,
    width: borders.width.medium,
  })};

  ${({ $purple }) =>
    $purple &&
    css`
      background:
        linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 100%),
        linear-gradient(
        180deg,
        rgba(203, 140, 255, 0.2) 0%,
        rgba(203, 140, 255, 0) 100%
      );
    `};

  ${layout.mediaQueries.mobile} {
    width: 100%;
    padding: ${layout.space.medium};
  }
`;

export const VIPItemBottomImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: ${borders.radius.xLarge};
  object-fit: cover;
`;

export const VIPItemBottomContents = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px ${layout.space.medium};
  gap: ${layout.space.medium};

  ${layout.mediaQueries.mobile} {
    padding: 0px ${layout.space.xSmall};
  }
`;

export const ItemTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${layout.space.xSmall};
`;

// -- ITEM TEXT STYLES (VIP LEAGUES & FEATURED LEAGUES) -- //

export const ItemTitle = styled.h3<{ $color?: "blue" | "red" | "yellow" }>`
  ${typography.title.small};
  color: ${({ $color }) =>
    $color === "blue"
      ? "rgba(68, 252, 255, 1)"
      : $color === "red"
      ? "rgba(255, 81, 81, 1)"
      : $color === "yellow"
      ? "rgba(255, 252, 68, 1)"
      : colors.text.text1};
`;

export const ItemSubTitle = styled.p`
  ${typography.body.mediumRegular};
  color: ${colors.text.text2};
`;

// -- FEATURED LEAGUES SECTION -- //

export const FeaturedLeaguesSection = styled.div`
  display: flex;
  width: 100%;
  padding: 0px ${layout.space.medium};
  justify-content: center;
  align-items: center;
  background:
    linear-gradient(
      90deg,
      rgba(255, 242, 88, 0.1) 0%,
      rgba(255, 242, 88, 0) 50%
    ),
    linear-gradient(
    90deg,
    rgba(255, 242, 88, 0) 50%,
    rgba(255, 242, 88, 0.1) 100%
  );
`;

export const FeaturedLeaguesContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 1200px;
  padding: 160px 0;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: ${layout.space.xxLarge};
  // align-self: stretch;
  ${layout.mediaQueries.mobile} {
    padding: 80px 0;
  }
`;

export const FeaturedLeaguesList = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  align-content: center;
  gap: ${layout.space.xLarge};
  flex-wrap: wrap;

  ${layout.mediaQueries.mobile} {
    flex-direction: column;
  }
`;

export const BlueFeaturedLeagueItem = styled.div`
  display: flex;
  padding: ${layout.space.medium};
  flex-direction: column;
  align-items: flex-start;
  width: 370px;
  height: 510px;
  gap: ${layout.space.medium};
  border-radius: ${borders.radius.xxLarge};
  background: var(
    --Primary-Gradient-FadeTop-10,
    linear-gradient(
      0deg,
      var(--Color-Primary-10, rgba(68, 252, 255, 0.10)) 0%,
      var(--Color-Primary-0, rgba(68, 252, 255, 0.00)) 100%
    )
  );

  ${gradientBorder({
    gradient:
      "linear-gradient(180deg, rgba(68, 252, 255, 0.3) 0%, rgba(68, 252, 255, 0) 100%)",
    width: borders.width.thick,
  })};

  ${layout.mediaQueries.mobile} {
    flex-direction: column;
  }
`;

export const RedFeaturedLeagueItem = styled.div`
  display: flex;
  padding: ${layout.space.medium};
  flex-direction: column;
  align-items: flex-start;
  width: 370px;
  height: 510px;
  gap: ${layout.space.medium};
  border-radius: ${borders.radius.xxLarge};
  background: var(
    --Primary-Gradient-FadeTop-10,
    linear-gradient(
      360deg,
      rgba(255, 81, 81, 0.1) 0%,
      rgba(255, 81, 81, 0) 100%
    )
  );

  ${gradientBorder({
    gradient:
      "linear-gradient(180deg, rgba(255, 81, 81, 0.3) 0%, rgba(255, 81, 81, 0) 100%);",
    width: borders.width.thick,
  })};

  ${layout.mediaQueries.mobile} {
    flex-direction: column;
  }
`;

export const YellowFeaturedLeagueItem = styled.div`
  display: flex;
  padding: ${layout.space.medium};
  flex-direction: column;
  align-items: flex-start;
  width: 370px;
  height: 510px;
  gap: ${layout.space.medium};
  border-radius: ${borders.radius.xxLarge};
  background: var(
    --Primary-Gradient-FadeTop-10,
    linear-gradient(
      360deg,
      rgba(255, 242, 88, 0.1) 0%,
      rgba(255, 242, 88, 0) 100%
    )
  );

  ${gradientBorder({
    gradient:
      "linear-gradient(180deg, rgba(255, 252, 68, 0.3) 0%, rgba(255, 252, 68, 0) 100%);",
    width: borders.width.thick,
  })};

  ${layout.mediaQueries.mobile} {
    flex-direction: column;
  }
`;

export const FeaturedLeagueItemContents = styled.div`
  display: flex;
  width: 100%;
  max-width: 384px;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${layout.space.medium};
  padding: ${layout.space.medium};
  min-height: 192px;

  ${layout.mediaQueries.mobile} {
    max-width: 100%;
  }
`;

export const FeaturedLeagueContentsButtons = styled.div`
  display: flex;
  width: 100%;
  gap: ${layout.space.xSmall};
  align-items: flex-start;
  // align-self: stretch;
  flex-wrap: wrap;
`;

// -- ABOUT SECTION -- //

export const AboutSection = styled.div`
  display: flex;
  width: 100%;
  padding: 0px ${layout.space.medium};
  justify-content: center;
  align-items: center;
  background: ${gradients.base.fadeTop10};
  border-top: ${borders.width.thin} solid ${colors.base.translucent30};
  border-bottom: ${borders.width.thin} solid ${colors.base.translucent30};
`;

export const AboutContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 1200px;
  padding: 160px 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${layout.space.xxLarge};

  ${layout.mediaQueries.mobile} {
    padding: 80px 0;
  }
`;

export const AboutContents = styled.div`
  display: flex;
  width: 100%;
  max-width: 960px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${layout.space.xxLarge};
`;

export const AboutItem = styled.div<{ $left?: boolean }>`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;

  gap: ${layout.space.xxLarge};
  padding: ${layout.space.xLarge};
  border-radius: ${borders.radius.xxLarge};
  background: ${gradients.base.fadeTop10};

  ${({ $left }) =>
    $left
      ? gradientBorder({
        gradient: gradients.base.fadeLeft20,
        width: borders.width.medium,
      })
      : gradientBorder({
        gradient: gradients.base.fadeRight20,
        width: borders.width.medium,
      })};

  ${layout.mediaQueries.tablet} {
    flex-direction: ${({ $left }) => ($left ? "column-reverse" : "column")};
    gap: ${layout.space.xLarge};
    padding: ${layout.space.xLarge};
    max-width: 380px;
  }
`;

export const AboutItemImage = styled.img`
  display: flex;
  width: 100%;
  height: 240px;
  flex: 1 0 0;
  background: rgba(119, 119, 119, 1);
  border-radius: ${borders.radius.xLarge};
  object-fit: cover;

  /* ${layout.mediaQueries.tablet} {
    width: 324px;
    height: 185px;
  }

  ${layout.mediaQueries.mobile} {
    width: 100%;
    height: auto;
    aspect-ratio: 7/4;
  } */
`;

export const AboutItemTextContainer = styled.div`
  display: flex;
  max-width: 640px;
  flex-direction: column;
  align-items: flex-start;
  gap: ${layout.space.medium};
  flex: 1 0 0;
`;

export const AboutItemTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${layout.space.xxSmall};
`;

export const AboutItemTitle = styled.h2`
  ${typography.title.small};
  color: ${colors.text.text1};
`;

export const AboutItemSubTitle = styled.p`
  ${typography.body.mediumRegular};
  color: ${colors.text.text2};
`;

export const AboutItemBulletList = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 20px;
`;

export const AboutItemBullet = styled.li`
  ${typography.body.mediumRegular};
  color: ${colors.text.text1};
`;

// -- TAB SECTION -- //

export const TabSection = styled.div`
  display: flex;
  width: 100%;
  padding: 0 ${layout.space.medium};
  flex-direction: column;
  align-items: center;
  background: ${gradients.base.fadeBottom10};
`;

export const TabContainer = styled.div`
  display: flex;
  max-width: 1200px;
  padding: 160px 0;
  width: 100%;
  flex-direction: column;
  align-items: center;
  gap: ${layout.space.xxLarge};

  ${layout.mediaQueries.mobile} {
    padding: 80px 0;
    gap: ${layout.space.xLarge};
  }
`;

export const TabWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  gap: ${layout.space.xLarge};
`;

export const TabContent = styled.div`
  display: flex;
  width: 100%;
  padding: ${layout.space.xxLarge};
  align-items: center;
  gap: ${layout.space.xxLarge};
  border-radius: ${borders.radius.xxLarge};
  background: ${gradients.base.fadeBottom10};

  ${gradientBorder({
    gradient: gradients.base.fadeBottom10,
    width: borders.width.thick,
  })} ${layout.mediaQueries.tablet} {
    flex-direction: column-reverse;
    padding: ${layout.space.large};
    gap: ${layout.space.xLarge};
  }
`;

export const TabTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${layout.space.medium};
  flex: 1 0 0;
  min-width: 320px;
  width: 100%;
  max-width: 640px;
`;

export const TabImage = styled.img`
  display: flex;
  height: 327.619px;
  flex: 1 0 0;
  aspect-ratio: 21/10;
  border-radius: ${borders.radius.xLarge};

  ${layout.mediaQueries.mobile} {
    width: 100%;
  }
`;

// -- MANAGE SECTION -- //

export const ManageSection = styled.div`
  display: flex;
  width: 100%;
  padding: 0px ${layout.space.medium};
  justify-content: center;
  align-items: center;
  background: linear-gradient(
    360deg,
    rgba(255, 242, 88, 0.1) 0%,
    rgba(255, 242, 88, 0) 100%
  );

  border-top-width: ${borders.width.thin};
  border-top-style: solid;
  border-top-color: ${colors.base.translucent30};
`;

export const ManageContainer = styled.div`
  display: flex;
  width: min(100%, 1200px);
  min-width: 0;
  padding-top: 160px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${layout.space.xxLarge};

  ${layout.mediaQueries.mobile} {
    padding: 80px 0;
  }
`;

export const ManageListContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  gap: ${layout.space.xSmall};
  flex-wrap: wrap;
  padding: 0;
  margin: 0;
  list-style: none;
`;

export const ManageListItem = styled.div`
  ${typography.body.mediumBold} color: ${colors.text.text1 || "#FFFFFF"};
  display: inline-flex;
  align-items: center;
`;

export const ManageImageContent = styled.div<{ imageUrl: string }>`
  display: flex;
  width: 100%;
  min-width: 0;
  height: clamp(260px, 55vw, 640px);
  align-items: flex-start;
  background: url(${(props) => props.imageUrl}) lightgray 50% / cover no-repeat;
  border-top-left-radius: ${borders.radius.xxxLarge};
  border-top-right-radius: ${borders.radius.xxxLarge};
  box-shadow: 0px -16px 39.5px -8px rgba(0, 0, 0, 0.2);

  ${gradientBorder({
    gradient: gradients.base.fadeBottom10,
    width: borders.width.thick,
  })} ${layout.mediaQueries.mobile} {
    height: auto;
    aspect-ratio: 16 / 10;
    border-top-left-radius: ${borders.radius.xxLarge};
    border-top-right-radius: ${borders.radius.xxLarge};
    background-position: center;
  }
`;

// -- CONTACT SECTION -- //

export const ContactSection = styled.div`
  display: flex;
  width: 100%;
  padding: 0px ${layout.space.medium};
  justify-content: center;
  align-items: center;
  background: ${gradients.base.fadeTop10};
`;

export const ContactContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 1200px;
  padding: 160px 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${layout.space.xxLarge};

  ${layout.mediaQueries.mobile} {
    padding: 80px 0;
  }
`;

export const ContactButtons = styled.div`
  display: flex;
  width: 100%;
  gap: ${layout.space.xSmall};
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;
