import styled from "styled-components";
import { designTokens } from "@app/design/tokens";
import { bottomFadeBorder } from "@/app/design/mixens/edgeFadeBorder";

const { colors, gradients, layout, borders, typography } = designTokens;

export const RowWrapper = styled.div`
  max-width: 640px;
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
  align-items: center;
  gap: ${layout.space.medium};
  align-self: stretch;
  border: none;
  background: none;
  cursor: pointer;

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
  ${typography.body.medium};
  color: ${colors.text.text1};
`;

export const TimeCell = styled.td`
  width: 96px;
`;

export const RacesCell = styled.td`
  width: 48px;
  text-align: center;
`;

export const PointsCell = styled.td`
  width: 48px;
`;