import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";
import { gradientBorder } from "@/app/design/mixens/gradientBorder";

const { colors, gradients, layout, borders, typography } = designTokens;

export const TeamLineupWrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  max-width: 568px;
  width: 100%;
  border-radius: ${borders.radius.xxLarge};
  padding: ${layout.space.small};
  gap: 10px;
  ${({ theme }) =>
    gradientBorder({
      gradient: theme.theme.primaryGradientFadeBottom30,
      width: borders.width.medium,
    })};

  ${layout.mediaQueries.mobile} {
    max-width: 320px;
  }
`;

export const CardTitle = styled.div`
  position: absolute;
  left: 20px;
  top: -9px;
  display: flex;
  padding: 0 ${layout.space.xSmall};
  align-items: center;
  gap: 10px;
  background: ${colors.base.base2};
`;

export const TitleText = styled.p`
  ${typography.title.smallBold};
  max-width: 100%;
  ${({ theme }) => `color: ${theme.theme.primary30};`};
  margin: 0;
`;

export const TeamButton = styled.button`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: ${layout.space.small};
  padding: ${layout.space.small} ${layout.space.medium};
  border-radius: ${borders.radius.xLarge};
  background: transparent;
  border: none;
  cursor: pointer;

  &:hover {
    background: ${gradients.base.fadeRight10};
    z-index: 1;
  }

  &:focus-visible {
    background: ${gradients.base.fadeRight10};
    outline: 2px solid ${colors.utility.focus} !important;
    outline-offset: 2px;
    z-index: 2;
  }

  &:active {
    background: ${colors.base.translucent10};
  }
`;

export const DriversContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${layout.space.xSmall};
`;

export const DriverInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${layout.space.xxSmall};
  align-self: stretch;
`;

export const DriverName = styled.p`
  ${typography.body.mediumRegular};
  color: ${colors.text.text2};
  margin: 0;
  width: 72px;
`;

export const EmptyTeamContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 10px;
  width: 100%;
  border-radius: ${borders.radius.xxLarge};
  padding: ${layout.space.small};
`;

export const TeamTitle = styled.p`
  ${typography.title.small};
  color: ${colors.text.text1};
  max-width: 100%;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${layout.mediaQueries.mobile} {
    max-width: 200px;
  }
`;

export const EmptyTeamSubtitle = styled.p`
  ${typography.body.mediumRegular};
  color: ${colors.text.text2};
  margin: 0;
`;
