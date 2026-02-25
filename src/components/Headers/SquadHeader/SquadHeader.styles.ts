import styled from "styled-components";
import { designTokens } from "@app/design/tokens";

const { colors, gradients, layout, borders, typography } = designTokens;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  max-width: 100vw; /* Hard limit to the viewport */
  min-width: 0;      /* Allows shrinking */
  background: ${colors.base.base2};
  overflow: hidden; /* Prevents children from leaking out */
`;


export const TopContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  gap: ${layout.space.xxSmall};
  padding-top: ${layout.space.xxLarge};
  padding-right: ${layout.space.xLarge};
  padding-left: ${layout.space.xLarge};
  background: ${gradients.base.fadeBottom10};
`;

export const BannerContainer = styled.div`
  width: 100%;
  max-width: 688px;
  flex-direction: column;
  display: flex;
  border-radius: ${borders.radius.xLarge};
  background: ${gradients.base.fadeBottom10};
  display: flex;
  align-items: center;
  align-self: stretch;
  justify-content: center;
  padding: ${layout.space.large};
  gap: ${layout.space.large};
`;

export const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  align-content: flex-start;
  align-self: stretch;
  row-gap: ${layout.space.xSmall};
  flex-wrap: wrap;
`;

export const LeftActions = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${layout.space.xSmall};
  padding-right: ${layout.space.xSmall};
`;

export const RightActions = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${layout.space.xSmall};
`;

export const BannerImage = styled.div<{ $imageBg?: string }>`
  width: 100%;
  max-width: 640px;
  max-height: 320px;
  aspect-ratio: 2 / 1;
  align-self: stretch;
  border-radius: ${borders.radius.large};
  background-image: ${({ $imageBg }) => $imageBg ? `url(${$imageBg})` : "none"};
  background-size: cover;
  background-position: center;
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${layout.space.xSmall} 0px;
`;

export const Name = styled.h1`
  ${typography.title.large};
  color: ${colors.text.text1};
`;

export const MememberTop = styled.div`
  display: flex;
  width: 100%;
  position: relative;
  justify-content: center;
  align-self: stretch;
  align-items: center;
`;

export const TopLine = styled.div`
  height: 2px;
  width: 100%;
  background: ${gradients.base.fadeOutHorizontal10};
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  z-index: 0;
  pointer-events: none;
`;

export const ButtonContainer = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px ${layout.space.small};
  gap: ${layout.space.xSmall};
  background: ${colors.base.base2};
`;

export const MememberBottom = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  position: relative;
  align-self: stretch;
  align-items: center;
`;

export const BottomLine = styled.div`
  height: 2px;
  width: 100%;
  background: ${gradients.base.fadeOutHorizontal10};
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  z-index: 0;
  pointer-events: none;
`;


export const MemebersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
  width: 100%;
  min-width: 0; /* CRITICAL: Allows this flex item to shrink */
  background: ${colors.base.base2};
  overflow: hidden; 
`;

export const MembersList = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  min-width: 0; /* CRITICAL: Breaks the "min-content" expansion */
  justify-content: center;
  align-items: center;
  padding: ${layout.space.large} 0px;
  gap: ${layout.space.small};
  flex-wrap: nowrap;
  overflow: hidden; /* Hides avatars that don't fit */
  
  & > * {
    flex-shrink: 0; /* Keeps avatars from getting squished */
  }
`;

export const LeftCover = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 240px;
  background: ${gradients.cover.coverLeft};
  pointer-events: none; /* Allows clicks to pass through */
  `;

export const RightCover = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 240px;
  background: ${gradients.cover.coverRight};
  pointer-events: none; /* Allows clicks to pass through */
  `;

