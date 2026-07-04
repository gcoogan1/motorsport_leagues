import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";
import { gradientBorder } from "@/app/design/mixens/gradientBorder";

const { gradients, colors, layout, borders, typography } = designTokens;

export const Wrapper = styled.div`
  display: flex;
  width: 100%;
  max-width: 640px;
  padding: ${layout.space.xxLarge} ${layout.space.xLarge};
  justify-content: center;
  align-items: center;
  background: ${colors.base.base2};
  border-radius: ${borders.radius.xLarge};
  color: ${colors.text.text1};

  ${gradientBorder({
    gradient: gradients.base.fadeBottom10,
    width: borders.width.medium,
  })};

  /* img {
    max-width: 100%;
    height: auto;
    display: block;
  } */
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
    ${typography.subtitle.xLarge};
    color: ${colors.text.text1};
  }

  h2 {
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
