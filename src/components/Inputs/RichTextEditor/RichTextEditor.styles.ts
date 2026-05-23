import styled from "styled-components";
import { EditorContent } from "@tiptap/react";
import { designTokens } from "@/app/design/tokens";

const { colors, layout, typography, borders } = designTokens;

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${layout.space.xxxSmall};
  max-width: 640px;
`;

export const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${layout.space.xxxSmall};
  align-self: stretch;
`;

export const Label = styled.label`
  ${typography.body.smallBold};
  color: ${colors.text.text2};
`;

export const CharacterCounter = styled.div`
  ${typography.body.tinyRegular};
  color: ${colors.text.text3};
`;

export const Contents = styled.div<{ $hasError: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  border-radius: ${borders.radius.medium};
  background: ${colors.base.translucent10};
  box-shadow: ${({ $hasError }) =>
    $hasError
      ? `inset 0 0 0 2px ${colors.alert.alertA}`
      : `inset 0 0 0 2px transparent`};
`;

export const Controls = styled.div`
  display: flex;
  width: 100%;
  padding: ${layout.space.xSmall};
  align-items: center;
  align-content: center;
  gap: 2px ${layout.space.xxxSmall};
  align-self: stretch;
  flex-wrap: wrap;
  border-bottom: ${borders.width.medium} solid ${colors.base.translucent10};
`;

export const SelectWrapper = styled.div`
  flex: 1;
`;

export const ToolbarButton = styled.div<{
  $isActive?: boolean;
}>`
  color: ${(
    { $isActive },
  ) => ($isActive ? colors.text.text1 : "red")};
`;

export const StyledEditorContent = styled(EditorContent)`
  .ProseMirror {
    min-height: 260px;

    padding: 18px;

    outline: none;

    color: white;

    font-size: 14px;
    line-height: 1.6;
  }

  .ProseMirror p {
    margin: 0;
  }

  .ProseMirror .is-editor-empty:first-child::before {
    content: attr(data-placeholder);

    color: #8f8f8f;

    pointer-events: none;

    float: left;

    height: 0;
  }

  .ProseMirror ul,
  .ProseMirror ol {
    padding-left: 24px;
  }

  .ProseMirror h1 {
    font-size: 32px;
    font-weight: 700;
  }

  .ProseMirror h2 {
    font-size: 24px;
    font-weight: 700;
  }

  .ProseMirror img {
    display: block;
    max-width: 100%;
    height: auto;
    margin: 16px 0;
    border-radius: 12px;
  }

  .ProseMirror blockquote {
    border-left: 3px solid rgba(255, 255, 255, 0.2);

    margin-left: 0;

    padding-left: 16px;

    color: #cfcfcf;
  }

  .ProseMirror code {
    background: rgba(255, 255, 255, 0.08);

    padding: 2px 6px;

    border-radius: 6px;
  }

  .ProseMirror pre {
    background: #1e1e1e;

    padding: 16px;

    border-radius: 12px;

    overflow-x: auto;
  }
`;

export const HelperText = styled.div`
  font-size: 12px;
  color: #8f8f8f;
`;

export const ErrorText = styled.span`
  ${typography.body.smallBold} color: ${colors.alert.alertA};
  display: flex;
  gap: ${layout.space.xxxSmall};
`;
