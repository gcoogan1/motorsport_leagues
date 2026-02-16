import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";


const { colors, layout, effects, borders } = designTokens;


export const DropdownContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: ${borders.radius.xxLarge};
  background-color: ${colors.base.base3};
  cursor: pointer;
  padding: ${layout.space.small};
  gap: ${layout.space.xxSmall};
  border: ${borders.width.thin} solid ${colors.base.translucent10};

  ${effects.boxShadow.elevationModal};
`;


