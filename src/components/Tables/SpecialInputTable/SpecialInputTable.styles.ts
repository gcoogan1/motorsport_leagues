import styled from "styled-components";
import { designTokens } from "@app/design/tokens";
import { gradientBorder } from "@/app/design/mixens/gradientBorder";

const { layout, borders, typography } = designTokens;

export const TableWrapper = styled.div`
  ${({ theme }) => gradientBorder({ gradient: theme.theme.primaryGradientFadeBottom, width: borders.width.medium })};
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 640px;
  width: 100%;
  gap: ${layout.space.small};
  padding: ${layout.space.large} ${layout.space.xLarge};
  border-radius: ${borders.radius.xLarge};
  background: ${({ theme }) => theme.theme.primaryGradientFadeTop10};
`;

export const TableHeader = styled.h3`
  ${typography.title.xSmall};
  width: 100%;
  color: ${({ theme }) => theme.theme.primaryA};
  text-align: center;
`;

export const ReadOnlyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${layout.space.xSmall};
`;

export const InputContainer = styled.div`
  width: 240px;
  
  ${layout.mediaQueries.mobile} {
    width: 140px;
  }
`;

export const ReadOnlyRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${layout.space.xSmall};
`;

export const ActionsContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  & > div {
    width: 240px !important;
    min-width: 160px;
    max-width: 240px;
  }
  ${layout.mediaQueries.mobile} {
    & > div {
      width: 140px !important;
      min-width: 140px;
      max-width: 140px;
    }
  }
`;