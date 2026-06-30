import styled  from "styled-components";
import { designTokens } from "@/app/design/tokens";
import { bottomFadeBorder } from "@/app/design/mixens/edgeFadeBorder";


const { gradients, layout, borders } = designTokens;

export const TabsViewport = styled.div`
  width: 100%;
  min-width: 0;
  overflow-x: auto;
  overflow-y: visible;

  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }

  scrollbar-width: none;

  ${bottomFadeBorder({
    gradient: gradients.base.fadeOutHorizontal20,
    width: borders.width.medium,
  })}

  ${layout.mediaQueries.mobile} {
    overflow-x: scroll;
    justify-items: center;
    display: grid;
  }
`;

export const TabsContainer = styled.div`
  display: flex;
  width: max-content;
  min-width: 100%;
  gap: ${layout.space.xxxSmall};

  justify-content: center;

  /* ${layout.mediaQueries.mobile} {
    justify-content: flex-start;
  } */
`;


