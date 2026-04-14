import styled, { css } from "styled-components";
import { designTokens } from "@/app/design/tokens";
import { gradientBorder } from "@/app/design/mixens/gradientBorder";
import { bothFadeBorders } from "@/app/design/mixens/edgeFadeBorder";

const { colors, gradients, layout, borders, typography } = designTokens;

export const FilterBarContainer = styled.div<{ $hasText: boolean }>`
  display: flex;
  align-items: center;
  width: ${({ $hasText }) => ($hasText ? "100%" : "auto")};
  max-width: 1264px;
  padding: ${layout.space.medium};
  gap: ${layout.space.medium};
  background: transparent;
  border-radius: ${borders.radius.round};
  justify-content: ${({ $hasText }) => ($hasText ? "space-between" : "flex-start")};
  border: ${borders.width.medium} solid ${colors.base.translucent10};

  ${({ $hasText }) =>
    $hasText &&
    css`
      border: none;
      ${gradientBorder({
        gradient: gradients.base.fadeRight10,
        width: borders.width.medium,
      })};

      ${layout.mediaQueries.mobile} {
        padding: ${layout.space.medium};
        flex-direction: column;
        justify-content: center;
      }
    `};

    ${layout.mediaQueries.mobile} {
      border-radius: 0px;
      border: none;
      ${bothFadeBorders({
        gradient: gradients.base.fadeOutHorizontal10,
        width: borders.width.medium,
      })};
    }
`;

export const FilterList = styled.div`
  display: flex;
  align-items: flex-start;
  align-content: flex-start;
  gap: ${layout.space.xSmall};
  flex: 1 0 0;
  flex-wrap: wrap;
  justify-content: center;

`

export const FilterText = styled.p`
  ${typography.body.mediumBold};
  color: ${colors.text.text2};
  margin: 0;
`;