import styled from "styled-components";

import { designTokens } from "@/app/design/tokens";
import { gradientBorder } from "@/app/design/mixens/gradientBorder";

const { gradients, layout, borders } = designTokens;

export const RoundContainer = styled.div`
  width: 100%;
  max-width: 960px;
  min-width: 296px;
  overflow: hidden;
  border-radius: ${layout.space.large};
  flex-direction: column;
  align-items: center;
  ${gradientBorder({ gradient: gradients.base.fadeBottom10, width: borders.width.medium })};
`

export const EventsContainer = styled.div`
  display: flex;
  padding: ${layout.space.xLarge};
  flex-direction: column;
  align-items: center;
  gap: ${layout.space.xLarge};
  align-self: stretch;

  ${layout.mediaQueries.mobile} {
    padding: ${layout.space.xLarge} ${layout.space.medium};
  }
`