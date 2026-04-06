import styled from "styled-components";
import { designTokens } from "@app/design/tokens";
import { gradientBorder } from "@/app/design/mixens/gradientBorder";
import { bottomFadeBorder } from "@/app/design/mixens/edgeFadeBorder";

const { colors, gradients, borders, layout, typography, effects } = designTokens;

export const ManageMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 240px;
  align-items: center;
  background: transparent;
  border-radius: ${borders.radius.xLarge};

  ${gradientBorder({
    gradient: gradients.base.fadeLeft20,
    width: borders.width.medium,
  })};

  ${layout.mediaQueries.mobile} {
    border-top-right-radius: ${borders.radius.xLarge};
    border-bottom-right-radius: ${borders.radius.xLarge};
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;

    background: ${colors.base.base3};
    ${effects.boxShadow.elevationModal}
  }
`;

export const Header = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: ${layout.space.large} ${layout.space.xLarge};
  background: ${gradients.base.fadeLeft20};
  border-top-right-radius: ${borders.radius.xLarge};
`;

export const HeaderTitle = styled.h2`
  ${typography.title.xSmall};
  color: ${colors.text.text2};
  margin: 0;
`;

export const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Links = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: ${layout.space.xSmall} 0;
`;

export const Season = styled.div`
  display: flex;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
`;

export const SelectContainer = styled.div`
  display: flex;
  padding: ${layout.space.medium} ${layout.space.xLarge};
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  background: ${gradients.base.fadeLeft10};

  ${bottomFadeBorder({
    gradient: gradients.base.fadeLeft10,
    width: borders.width.medium,
  })};
`;
