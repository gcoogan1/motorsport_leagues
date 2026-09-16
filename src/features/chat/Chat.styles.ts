import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { typography, layout, colors, borders  } = designTokens;

export const ChatBody = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  flex: 1;
  min-height: 0;
`;

export const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  padding: ${layout.space.small} 0;
  display: flex;
  flex-direction: column;
  gap: ${layout.space.small};

  scrollbar-width: thin;
  scrollbar-color: ${colors.base.base4} transparent;

  &::-webkit-scrollbar {
    width: 2px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${colors.base.base4};
    border-radius: ${borders.radius.small};
  }
`;

export const Bubble = styled.div<{ $role: "user" | "assistant" }>`
  align-self: ${({ $role }) => ($role === "user" ? "flex-end" : "flex-start")};
  background: ${({ $role }) =>
    $role === "user" ? colors.utility.focus : colors.base.base4};
  color: ${colors.text.text1};
  width: min(400px, 100%);
  padding: ${layout.space.small};
  border-top-left-radius: ${({ $role }) =>
    $role !== "user" ? borders.radius.small : borders.radius.xxLarge};
  border-top-right-radius: ${borders.radius.xxLarge};
  border-bottom-left-radius: ${borders.radius.xxLarge};
  border-bottom-right-radius: ${({ $role }) =>
    $role === "user" ? borders.radius.small : borders.radius.xxLarge};
  white-space: pre-wrap;
  ${typography.body.mediumRegular}
`;

export const TypingBubble = styled(Bubble)`
  color: ${colors.text.text2};
  font-style: italic;
`;

export const InputRow = styled.form`
  display: flex;
  align-items: flex-start;
  gap: ${layout.space.xSmall};
  padding: ${layout.space.small};
  border-top: 1px solid ${colors.base.base3};
`;
