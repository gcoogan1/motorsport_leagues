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
    justify-items: start;
    display: grid;

    /* Pull the container to the absolute screen edges */
    margin-left: -${layout.space.medium}; /* Replace with your actual global mobile padding token */
    margin-right: -${layout.space.medium};
    
    /* Re-add padding inside so text doesn't touch the glass */
    padding-left: ${layout.space.medium};
    padding-right: ${layout.space.medium};
    
    /* Ensure the component takes full viewport width plus the offset */
    width: calc(100% + (${layout.space.medium} * 2)); 
  }
`;

export const TabsContainer = styled.div`
  display: flex;
  width: max-content;
  min-width: 100%;
  gap: ${layout.space.xxxSmall};

  justify-content: center;

  ${layout.mediaQueries.mobile} {
    /* justify-content: flex-start; */
  }
`;


