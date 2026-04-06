import styled from "styled-components";

import { designTokens } from "@/app/design/tokens";

const { colors, layout} = designTokens;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
  flex: 1;
  background-color: ${colors.base.base2};
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1264px;
  padding: ${layout.space.xxLarge} 0px;
  gap: ${layout.space.xxLarge};

  ${layout.mediaQueries.mobile} {
    padding: 0px;
    gap: 0px;
  }
`;

export const Content = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;
  max-width: 1264px;
  padding: 0px ${layout.space.xLarge};
  gap: ${layout.space.xLarge};

  ${layout.mediaQueries.mobile} {
    flex-direction: column;
    padding: ${layout.space.xLarge} ${layout.space.medium};
    gap: ${layout.space.medium};
    align-items: center;
  }
`;

export const ManageMenuMobileWrapper = styled.div`
    position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  z-index: 3000;
`;