import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";
import { bottomFadeBorder } from "@/app/design/mixens/edgeFadeBorder";

const { colors, borders, layout, typography } = designTokens; 


export const LinkListContainer = styled.div`
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

    /* Apply gradient border bottom to all but the last child -- */
    > *:not(:last-child) {
    ${bottomFadeBorder({
      gradient: colors.base.translucent10,
      width: borders.width.thin,
    })}
  }

`;