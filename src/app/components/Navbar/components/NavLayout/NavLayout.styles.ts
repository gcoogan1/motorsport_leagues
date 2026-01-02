import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { colors, borders, layout } = designTokens;

export const NavbarWrapper = styled.nav`
  width: 100%;
  min-width: 920px;
  background-color: ${colors.base.base1};
  border-bottom: ${borders.width.thin} solid ${colors.base.translucent10};
  padding: 0px ${layout.space.xLarge};

  ${layout.mediaQueries.mobile} {
    min-width: 320px;
    max-width: 919px;
  }
`;

export const NavbarContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${colors.base.base1};
  padding: ${layout.space.xLarge} 0px;
  gap: ${layout.space.xLarge};
  
  ${layout.mediaQueries.mobile} {
    flex-wrap: wrap;
  }

`;