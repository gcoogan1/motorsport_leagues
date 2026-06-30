import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";
import { gradientBorder } from "@/app/design/mixens/gradientBorder";

const { colors, gradients, layout, borders, typography, effects } = designTokens;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 2000;
  padding: ${layout.space.xxxLarge} ${layout.space.xLarge};
  overflow-y: auto;
  width: 100%;

  ${layout.mediaQueries.mobile} {
    padding: ${layout.space.medium};
  }
`;

export const ModalOverlayBackground = styled.div<{ $fullScreen?: boolean }>`
  background: ${colors.base.base2};
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  max-width: 960px;
  border-radius: ${borders.radius.xxxLarge};
  padding: ${layout.space.xLarge};
  ${effects.boxShadow.elevation}

  ${layout.mediaQueries.mobile} {
    padding: ${layout.space.medium};
  }
`;

// export const ModalOverlayBackground = styled.div<{ $fullScreen?: boolean }>`
//   background: ${colors.base.base2};
//   display: flex;
//   align-items: flex-start;
//   justify-content: center;
//   width: 100%;
//   height: 100%;
//   max-width: 960px;
//   border-radius: ${borders.radius.xxxLarge};
//   padding: ${layout.space.xLarge};
//   ${effects.boxShadow.elevation}
//   ${({ $fullScreen }) => $fullScreen && `overflow: hidden;`}
// `;

// export const SheetContainer = styled.div<{ $fullScreen?: boolean }>`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   position: relative;
//   flex: 1;
//   width: 100%;
//   height: ${({ $fullScreen }) => ($fullScreen ? "100%" : "auto")};
//   min-width: 0;
//   border-radius: ${borders.radius.xxxLarge};
//   background: ${({ theme }) => theme.theme.primaryGradientFadeBottom30};
//   padding: ${layout.space.xxLarge} ${layout.space.xLarge};
//   gap: ${layout.space.xLarge};

//   ${layout.mediaQueries.mobile} {
//     padding: ${layout.space.xxLarge} ${layout.space.medium};
//   }
// `;

export const SheetContainer = styled.div<{ $fullScreen?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  flex: 1;
  width: 100%;
  height: ${({ $fullScreen }) => ($fullScreen ? "100dvh" : "auto")};
  min-width: 0;
  min-height: 0;
  border-radius: ${borders.radius.xxxLarge};
  background: ${({ theme }) => theme.theme.primaryGradientFadeBottom30};
  padding: ${layout.space.xxLarge} ${layout.space.xLarge};
  gap: ${layout.space.xLarge};

  overflow-y: ${({ $fullScreen }) => ($fullScreen ? "auto" : "visible")};
  -webkit-overflow-scrolling: touch;

  ${layout.mediaQueries.mobile} {
    padding: ${layout.space.xxLarge} ${layout.space.medium};
  }
`;

export const SheetHeader = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  align-self: stretch;
  gap: ${layout.space.medium};
`;

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
  text-align: center;
`

export const Name = styled.h2`
  ${typography.subtitle.mediumItalic};
  color: ${({ theme }) => theme.theme.primary30};
  margin: 0;
`;

export const Header = styled.p`
  ${typography.title.medium};
  color: ${colors.text.text1};
  margin: 0;
`;

export const BlockContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: center;
  justify-content: center;
  width: 100%;
  max-width: 640px;
  gap: ${layout.space.medium};
  background: ${gradients.base.fadeTop10};
  border-radius: ${borders.radius.xLarge};
  padding: ${layout.space.large} ${layout.space.xxLarge};
  gap: ${layout.space.medium};

  ${gradientBorder({
    gradient: gradients.base.fadeBottom10,
    width: borders.width.medium,
  })}

  ${layout.mediaQueries.mobile} {
    padding: ${layout.space.large};
    max-width: 400px;
  }
`;

export const BlockHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
  text-align: center;
`;

export const BlockHeader = styled.h3`
  ${typography.subtitle.medium};
  color: ${({ theme }) => theme.theme.primaryA};
  margin: 0;
`;

export const BlockDescription = styled.p`
  ${typography.body.mediumRegular};
  color: ${colors.text.text2};
  margin: 0;
`;

export const BlockContents = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${layout.space.xSmall};
  align-self: stretch;
`;

export const DetailsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
  justify-content: center;
  text-align: center;
`;

export const DetailsTitle = styled.h3`
  ${typography.subtitle.largeItalic};
  color: ${({ theme }) => theme.theme.primaryA};
  margin: 0;
`;

export const DetailsContent = styled.p`
  ${typography.body.smallRegular};
  color: ${colors.text.text2};
  margin: 0;
`;

export const List = styled.div<{ $fullScreen?: boolean }>`
  display: flex;
  width: 100%;
  max-width: ${({ $fullScreen }) => ($fullScreen ? "none" : "640px")};
  min-width: 0;
  flex-direction: column;
  gap: ${layout.space.medium};
  align-items: center;

  ${layout.mediaQueries.mobile} {
    max-width: ${({ $fullScreen }) => ($fullScreen ? "none" : "400px")};
  }
`;

// export const List = styled.div<{ $fullScreen?: boolean }>`
//   display: flex;
//   width: 100%;
//   max-width: ${({ $fullScreen }) => ($fullScreen ? "none" : "640px")};
//   min-width: 0;
//   flex-direction: column;
//   flex: ${({ $fullScreen }) => ($fullScreen ? 1 : "initial")};
//   gap: ${layout.space.medium};
//   align-items: center;
//   overflow-y: ${({ $fullScreen }) => ($fullScreen ? "auto" : "visible")};
//   min-height: ${({ $fullScreen }) => ($fullScreen ? "0" : "auto")};

//   ${layout.mediaQueries.mobile} {
//     max-width: ${({ $fullScreen }) => ($fullScreen ? "none" : "400px")};
//   }
// `;

export const ButtonContainer = styled.div`
  position: absolute;
  left: 24px;
  top: 24px;
`;