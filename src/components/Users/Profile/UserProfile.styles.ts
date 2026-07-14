import styled, { css } from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { layout, colors, typography } = designTokens;

export const ProfileContainer = styled.div<{ size: "small" | "medium" | "large", $centerContent: boolean }>`
  display: flex;
  align-items:  ${({ $centerContent }) => ($centerContent ? "center" : "flex-start")};
  gap: ${layout.space.small};
  width: 100%;
  overflow: hidden;

  ${({ size }) => {
    if (size === "medium") {
      return css`
        gap: ${layout.space.xSmall};
      `;
    }
    if (size === "small") {
      return css`
        gap: ${layout.space.xxSmall};
      `;
    }
  }}
`;

export const AvatarWrapper = styled.div`
  flex-shrink: 0;
`;

export const TextContainer = styled.div<{ $size: "small" | "medium" | "large" }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${layout.space.xxSmall};
  max-width: 100%;
  min-width: 0;
  /* flex: 1; */
  overflow: hidden;
  
  ${({ $size }) =>
    $size === "medium" &&
    css`
    gap: 0;
    overflow: hidden;
  `};

`;

export const UsernameContainer = styled.div<{ isLarge: boolean }>`
  display: flex;
  align-items: center;
  gap: ${layout.space.xxSmall};
  min-width: 0;
  width: 100%;
  max-width: 100%;
  overflow: hidden;

  ${({ isLarge }) =>
    isLarge &&
    css`
      flex-direction: column;
      gap: 0;
      align-items: flex-start;
  `};
`;

export const Username = styled.h2<{ $size: "small" | "medium" | "large" }>`
  ${({ $size }) => {
    switch ($size) {
      case "small":
        return typography.body.mediumBold;
      case "medium":
        return typography.body.mediumBold;
      case "large":
        return typography.title.small;
      default:
        return typography.body.mediumBold;
    }
  }};
  color: ${colors.text.text1};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
  min-width: 0;
  flex: 1 0 auto;
  flex-shrink: 0;
`;

export const Information = styled.p<{ $size: "small" | "medium" | "large" }>`
  ${({ $size }) => {
    switch ($size) {
      case "small":
        return typography.body.smallRegular;
      case "medium":
        return typography.body.smallRegular;
      case "large":
        return typography.subtitle.mediumItalic;
      default:
        return typography.body.smallRegular;
    }
  }};
  color: ${colors.text.text2};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  min-width: 0;
`;
