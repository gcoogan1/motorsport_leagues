import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { colors, borders, layout } = designTokens;

export const PanelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: ${borders.radius.xxLarge};
  background: ${colors.base.base3};

  width: 432px;
  min-height: 992px;
`;

export const PanelBody = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${layout.space.xLarge} ${layout.space.large};
  gap: ${layout.space.xLarge};
  background: ${colors.base.base3};
  align-items: flex-start;
  height: 100%;
  flex: 1;
  border-bottom-left-radius: ${borders.radius.xxLarge};
  border-bottom-right-radius: ${borders.radius.xxLarge};
`;