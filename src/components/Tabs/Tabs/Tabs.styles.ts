import styled  from "styled-components";
import { designTokens } from "@/app/design/tokens";
import { bottomFadeBorder } from "@/app/design/mixens/edgeFadeBorder";


const { gradients, layout, borders } = designTokens;

export const TabsContainer = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  flex: 1;
  gap: ${layout.space.xxxSmall};

  ${bottomFadeBorder({
    gradient: gradients.base.fadeOutHorizontal20,
    width: borders.width.medium,
  })}

  &::after {
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;