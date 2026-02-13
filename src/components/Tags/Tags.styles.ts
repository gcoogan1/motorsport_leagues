import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";
import type { TagVariant } from "./Tags.variants";

const { layout, borders, typography } = designTokens;

export const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${layout.space.xxxSmall};
`;

export const TagItem = styled.div<{ $variant: TagVariant }>`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 ${layout.space.xxSmall};
  border-radius: ${borders.radius.medium};
  color: ${({ $variant }) => $variant.color};
  background: ${({ $variant }) => $variant.background};

  ${typography.body.smallBold};
`;