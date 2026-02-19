import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";


const { colors, layout, effects, borders } = designTokens;


export const DropdownContainer = styled.div<{ $isStandAlone?: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  display: flex;
  flex-direction: column;
  width: ${({ $isStandAlone }) => ($isStandAlone ? "max-content" : "100%")};
  min-width: 160px;

  border-radius: ${borders.radius.xxLarge};
  background-color: ${colors.base.base3};
  cursor: pointer;
  padding: ${layout.space.small};
  gap: ${layout.space.xxSmall};
  border: ${borders.width.thin} solid ${colors.base.translucent10};
  margin-top: ${layout.space.xxSmall};
  z-index: 1000;

  ${effects.boxShadow.elevationModal};
`


