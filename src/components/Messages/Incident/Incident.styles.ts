import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";
import { bottomFadeBorder } from "@/app/design/mixens/edgeFadeBorder";

const { gradients, layout, borders } = designTokens;

export const IncidentWrapper = styled.div`
  display: flex;
  width: 100%;
  max-width: 394px;
  flex-direction: column;
  align-items: flex-start;
  gap: ${layout.space.medium};
`

export const Reporter = styled.div`
  display: flex;
  padding: ${layout.space.medium};
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  border-bottom-left-radius: ${borders.radius.large};
  border-bottom-right-radius: ${borders.radius.large};
  padding: ${layout.space.medium};
  background: ${gradients.base.fadeTop10};

  ${bottomFadeBorder({
    gradient: gradients.base.fadeOutHorizontal10,
    width: borders.width.medium,
  })}
`

export const Details = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
`