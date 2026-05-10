import styled  from "styled-components";
import { designTokens } from "@/app/design/tokens";
import { bottomFadeBorder } from "@/app/design/mixens/edgeFadeBorder";


const { gradients, layout, borders } = designTokens;

export const TabsViewport = styled.div`
  width: 100%;
  min-width: 0;
  overflow: visible;

  ${bottomFadeBorder({
    gradient: gradients.base.fadeOutHorizontal20,
    width: borders.width.medium,
  })}
`;

export const TabsContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  width: 100%;
  gap: ${layout.space.xxxSmall};
  
  /* Centering that falls back to left-aligned on overflow */
  justify-content: safe center; 
  
  overflow-x: auto;
  overflow-y: visible;
  min-width: 0;

  /* Hide scrollbars */
  &::-webkit-scrollbar { display: none; }
  scrollbar-width: none;
`;


