import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { colors, borders, layout, effects } = designTokens;

export const PanelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: ${borders.radius.xxLarge};
  background: ${colors.base.base3};
  box-shadow: 0 0 80px 80px rgba(0, 0, 0, 0.20);
  width: 432px;
  height: 100%;

  ${layout.mediaQueries.mobile} {
    width: 100%;
  }
`;

export const PanelTabs = styled.div`
  display: flex;
  padding: ${layout.space.xLarge} ${layout.space.large} 0 ${layout.space.large};
  background: ${colors.base.base3};
  ${effects.boxShadow.coverBaseDown};
`;

export const PanelBody = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${layout.space.xLarge} ${layout.space.large};
  gap: ${layout.space.medium};
  background: ${colors.base.base3};
  align-items: flex-start;
  flex: 1;
  min-height: 0;
  overflow: scroll;
  border-bottom-left-radius: ${borders.radius.xxLarge};
  border-bottom-right-radius: ${borders.radius.xxLarge};
`;

export const PanelActionsContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  padding: ${layout.space.large};
  gap: ${layout.space.xSmall};
  ${effects.boxShadow.coverBaseTop};
`;

export const PrimaryButtonContainer = styled.div`
  flex: 1;
`;