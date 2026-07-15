import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { colors, gradients, layout, typography, borders } = designTokens;

export const InputWrapper = styled.div<{ $centerContent?: boolean }>`
  width: ${({ $centerContent }) => ($centerContent ? "min(100%, 240px)" : "100%")};
  position: relative;
  gap: ${layout.space.xxxSmall};
  min-width: 0;
  overflow: hidden;
  margin: ${({ $centerContent }) => ($centerContent ? "0 auto" : "0")};
`;

export const Label = styled.label`
  ${typography.body.smallBold}
  color: ${colors.text.text2};
`;


export const InputField = styled.div<{ $centerContent?: boolean }>`
  width: 100%;
  overflow: hidden;
  max-width: ${({ $centerContent }) => ($centerContent ? "240px" : "none")};
  min-width: 0;
  border-radius: ${borders.radius.medium};
  padding: ${layout.space.medium};
  border: none;
  display: flex;
  align-items: center;
  justify-content: ${({ $centerContent }) => ($centerContent ? "center" : "flex-start")};
  gap: ${layout.space.xSmall};
  background: ${gradients.base.fadeRight10};
  border: ${borders.width.thin} solid ${colors.base.translucent10};
  margin: ${({ $centerContent }) => ($centerContent ? "0 auto" : "0")};
`;

export const TextValue = styled.p<{ $fullContent?: boolean }>`
  ${typography.body.mediumBold}
  color: ${colors.text.text1};
  min-width: 0;
  
  ${({ $fullContent }) => (!$fullContent ? `
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  ` : '')};
`;

export const HelperText = styled.span`
  ${typography.body.smallRegular};
  color: ${colors.text.text2};
  display: flex;
  margin-top: 3px;
  overflow: hidden;
`;

export const RichTextContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${layout.space.small};
  padding: ${layout.space.medium};
  border-radius: ${borders.radius.medium};
  background: ${gradients.base.fadeRight10};
  border: ${borders.width.thin} solid ${colors.base.translucent10};
  color: ${colors.text.text1};
  min-width: 0;
  overflow-wrap: anywhere;
  word-break: break-word;

  .ProseMirror {
    width: 100%;
    min-width: 0;
    max-width: 100%;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .ProseMirror * {
    max-width: 100%;
  }

  pre {
    max-width: 100%;
    overflow-x: auto;
  }

  p {
    ${typography.body.mediumRegular};
    color: ${colors.text.text1};
    margin: 0;
  }

  h1 {
    ${typography.subtitle.large};
    color: ${colors.text.text1};
    margin: 0;
  }

  h2 {
    ${typography.subtitle.medium};
    color: ${colors.text.text1};
    margin: 0;
  }

  ul,
  ol {
    padding-left: 24px;
    ${typography.body.mediumRegular};
    color: ${colors.text.text2};
    margin: 0;
  }

  li {
    margin-bottom: ${layout.space.xxSmall};
  }

  a {
    ${typography.body.mediumRegular};
    color: ${colors.text.text1};
    text-decoration: underline;
  }

  blockquote {
    border-left: 3px solid ${colors.role.director};
    padding-left: ${layout.space.medium};
    margin: ${layout.space.xSmall} 0;
    ${typography.body.mediumRegular};
    color: ${colors.text.text2};
  }
`;

