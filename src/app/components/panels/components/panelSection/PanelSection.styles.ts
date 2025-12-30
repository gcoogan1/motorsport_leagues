import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";
import { gradientBorderBottom } from "@/app/design/mixens/gradientBorderBottom";

const { colors, borders, layout, typography } = designTokens; 


export const PanelSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${layout.space.xSmall};
  width: 100%;
`;

export const SectionTitle = styled.h3`
  ${typography.title.small};
  color: ${colors.text.text2};
`;

export const SectionList = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: ${borders.radius.xLarge};
  border: ${borders.width.thin} solid ${colors.base.translucent10};

    > *:not(:last-child) {
    ${gradientBorderBottom({
      gradient: colors.base.translucent10,
      width: borders.width.thin,
    })}
  }

`;