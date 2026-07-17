import styled from "styled-components";
import { designTokens } from "@app/design/tokens";
import { bottomFadeBorder } from "@/app/design/mixens/edgeFadeBorder";

const { colors, gradients, layout, borders, typography } = designTokens;

export const RowWrapper = styled.div`
  width: 100%;
  min-width: 0;
  padding: ${layout.space.xxSmall};
  gap: ${layout.space.xxSmall};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;


  ${bottomFadeBorder({
    gradient: gradients.base.fadeLeft10,
    width: borders.width.thin,
  })};
`;

export const RowContainer = styled.button`
  display: flex;
  padding: ${layout.space.xxSmall};
  border-radius: ${borders.radius.medium};
  align-items: center;
  gap: ${layout.space.medium};
  align-self: stretch;
  min-width: 0;
  border: none;
  background: none;
  cursor: pointer;
  /* overflow-x: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none; */

  /* Hover */
  &:hover {
    background: ${gradients.base.fadeRight10};
  }

   /* Focus Visible */
  &:focus-visible {
    outline: 2px solid ${colors.utility.focus};
    outline-offset: 2px;
    background: ${gradients.base.fadeRight10};
  }

  /* Active */
  &:active {
    background: ${colors.base.translucent10};
  }
`;

export const RowText = styled.p`
  ${typography.body.mediumBold};
  color: ${colors.text.text1};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${layout.mediaQueries.mobile} {
    max-width: 120px;
  }
`;

export const TimeText = styled.p`
  ${typography.body.mediumBold};
  color: ${colors.text.text1};
  
  ${layout.mediaQueries.mobile} {
    max-width: 120px;

/*     
    overflow-x: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none; */
  }
`;

export const ParticipantCell = styled.div`
  flex: 1 1 0;
  width: 0;
  min-width: 0;
  overflow: hidden;
`;

export const TeamCell = styled.div`
  flex: 1 1 0;
  width: 0;
  min-width: 0;
  overflow: hidden;
  text-align: left;
`;

export const TimeCell = styled.div`
  width: 96px;
  flex-shrink: 0;
  text-align: left;

  /* ${layout.mediaQueries.mobile} {
    width: 40px;
  } */
`;

export const RacesCell = styled.div`
  width: 48px;
  flex-shrink: 0;
  text-align: center;
`;

export const PointsCell = styled.div`
  width: 48px;
  flex-shrink: 0;
`;

export const RoundContainer = styled.div`
    display: flex;
    flex-direction: column;
    /* gap: ${layout.space.xxSmall}; */
    min-width: 0;
    text-align: left;
`;

export const RoundName = styled.h2<{ $shortenText: boolean }>`
  ${typography.body.mediumBold};
  color: ${colors.text.text1};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
`;

export const TrackName = styled.p<{ $shortenText: boolean }>`
  ${typography.body.smallRegular};
  color: ${colors.text.text2};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%
`;;