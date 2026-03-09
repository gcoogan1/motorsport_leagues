import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { colors, layout, typography, borders } = designTokens;

export const ChipWrapper = styled.div<{ type: "profile" | "tag" }>`
  display: flex;
  width: 145px;
  min-width: 145px;
  flex-shrink: 0;
  border-radius: ${borders.radius.round};
  background: ${colors.base.translucent10};
  padding-top: ${layout.space.xxSmall};
  padding-right: ${layout.space.xSmall};
  padding-bottom: ${layout.space.xxSmall};
  padding-left: ${({ type }) => (type === "profile" ? layout.space.xxSmall : layout.space.xSmall)};
  gap: ${({ type }) => (type === "profile" ? layout.space.xSmall : layout.space.xxSmall)};
  align-items: center;
  justify-content: space-between;
`;

export const ProfileInfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${layout.space.xxSmall};
  flex: 1;
`;

export const ProfileTextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Username = styled.p`
  ${typography.body.smallBold}
  color: ${colors.text.text1};
`;

export const Game = styled.p`
  ${typography.body.tinyRegular}
  color: ${colors.text.text2};
`;

export const TagText = styled.p`
  ${typography.body.mediumBold}
  color: ${colors.text.text1};
`;

export const ChipButton = styled.button`
  all: unset;
  cursor: pointer;
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${borders.radius.round};
  background: ${colors.base.translucent10};
  color: ${colors.text.text1};

  &:hover {
    background: ${colors.base.translucent20};
  }

  &:active {
    background: ${colors.base.translucent30};
  }

  &:focus-visible {
    background: ${colors.base.translucent20};
    outline: 2px solid ${colors.utility.focus};
    outline-offset: 2px;
  }
`;