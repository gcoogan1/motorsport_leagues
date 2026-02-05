import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { colors, borders } = designTokens;

export const AvatarWrapper = styled.div<{ $sizeValue: number }>`
  width: ${({ $sizeValue }) => $sizeValue}px;
  height: ${({ $sizeValue }) => $sizeValue}px;
  border-radius: ${borders.radius.round};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors.base.translucent10};
`

export const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const PlaceholderAvatar = styled.div<{ $sizeValue: number }>`
  width: ${({ $sizeValue }) => $sizeValue}px;
  height: ${({ $sizeValue }) => $sizeValue}px;
  border-radius: ${borders.radius.round};
  background-color: ${colors.base.translucent10};
`