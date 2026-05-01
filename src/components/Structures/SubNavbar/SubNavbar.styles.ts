import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { colors, gradients, layout, borders, typography } = designTokens;

export const SubNavbarWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  background: ${gradients.base};
  border-bottom: ${borders.width.thin} solid ${colors.base.translucent10};
`;

export const SubNavbarContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 1200px;
  align-items: flex-start;
  justify-content: center;
  padding: ${layout.space.medium} ${layout.space.large};
`;

export const ContentContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  flex: 1 0 0;

    ${layout.mediaQueries.mobile} {
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