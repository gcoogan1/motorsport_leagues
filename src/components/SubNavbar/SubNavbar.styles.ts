import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";
import { bottomFadeBorder } from "@/app/design/mixens/edgeFadeBorder";

const { colors, gradients, layout, borders, typography } = designTokens;

export const SubNavbarContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 640px;
  align-items: center;
  justify-content: center;
  padding: ${layout.space.medium} ${layout.space.large};

    /* Gradient Border Bottom */
  ${bottomFadeBorder({
    gradient: gradients.base.translucent10,
    width: borders.width.thin,
  })}

`;

export const ContentContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  flex: 1 0 0;

    ${layout.mediaQueries.mobile} {
    max-width: 360px;
    flex-direction: column;
    gap: ${layout.space.small};
    align-items: flex-start;
  }
`;

export const LeftContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${layout.space.medium};
  flex: 1 0 0;
`

export const RightContent = styled.div`
  display: flex;
  width: 124px;
  align-items: flex-start;
`

export const Name = styled.p`
  ${typography.body.mediumBold}
  color: ${colors.text.text1};
`;