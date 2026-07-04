import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";
import { gradientBorder } from "@/app/design/mixens/gradientBorder";

const {
  colors,
  gradients,
  layout,
  borders,
  typography,
} = designTokens;

export const RulesContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 640px;
  flex-direction: column;
  align-items: center;
  align-self: center;
  min-width: 0;

  overflow-wrap: anywhere;
  word-break: break-word;

  border-top-left-radius: ${borders.radius.xLarge};
  border-top-right-radius: ${borders.radius.xLarge};

  ${gradientBorder({
    gradient: gradients.base.fadeBottom10,
    width: borders.width.medium,
  })} ${layout.mediaQueries.mobile} {
    max-width: 100%;
  }
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${layout.space.xLarge};
  padding: ${layout.space.xLarge};
  align-self: stretch;
`;

export const RulesContent = styled.div`
  display: flex;
  flex-direction: column;
  color: ${colors.text.text1};

  width: 100%;
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
    color: ${colors.text.text2};
  }

  h1 {
    margin: 0 0 ${layout.space.large};
    ${typography.subtitle.xLarge};
    color: ${colors.text.text1};
  }

  h2 {
    margin: ${layout.space.xLarge} 0 ${layout.space.medium};
    ${typography.subtitle.large};
    color: ${colors.text.text1};
  }

  ul,
  ol {
    padding-left: 24px;
    ${typography.body.mediumRegular};
    color: ${colors.text.text2};
  }

  li {
    margin-bottom: ${layout.space.xxSmall};
  }

  a {
    ${typography.body.mediumRegular};
    color: ${colors.text.text1};
    text-decoration: underline;
  }

  img {
    display: block;
    max-width: 100%;
    height: auto;
    margin: ${layout.space.large} 0;
    border-radius: ${borders.radius.medium};
  }

  blockquote {
    margin: ${layout.space.large} 0;
    padding-left: 16px;
    border-left: 3px solid rgba(255, 255, 255, 0.2);
    color: ${colors.text.text2};
  }

  pre {
    margin: ${layout.space.large} 0;
    padding: 16px;
    border-radius: ${borders.radius.medium};
    background: #1e1e1e;
    overflow-x: auto;
  }

  code {
    padding: 2px 6px;
    border-radius: ${borders.radius.small};
    background: rgba(255, 255, 255, 0.08);
  }
`;