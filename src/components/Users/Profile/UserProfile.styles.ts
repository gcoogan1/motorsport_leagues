import styled, { css } from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { layout, colors, typography } = designTokens;

export const ProfileContainer = styled.div<{ size: "small" | "medium" | "large" }>`
  display: flex;
  align-items: self-start;
  gap: ${layout.space.small};

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

export const TextContainer = styled.div<{ $size: "small" | "medium" | "large" }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${layout.space.xxSmall};
  
  ${({ $size }) =>
    $size === "medium" &&
    css`
    gap: 0;
  `};
`;

export const UsernameContainer = styled.div<{ isLarge: boolean }>`
  display: flex;
  align-items: center;
  gap: ${layout.space.xxSmall};

  ${({ isLarge }) =>
    isLarge &&
    `
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
`;
