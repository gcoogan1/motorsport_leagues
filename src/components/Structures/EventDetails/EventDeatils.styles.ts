import styled from "styled-components";

import { designTokens } from "@/app/design/tokens";
import { gradientBorder } from "@/app/design/mixens/gradientBorder";

const { colors, gradients, layout, typography, borders } = designTokens;


export const ImageContainer = styled.div<{ imageUrl?: string }>`
  box-sizing: border-box;

  flex: 0 0 240px;
  width: 240px;
  height: 135px;

  display: flex;
  padding: ${layout.space.small};

  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;

  border-radius: ${borders.radius.medium};

  background-color: ${colors.base.base1};

  background-image: ${({ imageUrl }) =>
    imageUrl ? `url("${imageUrl}")` : "none"};

  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;

  ${gradientBorder({
    gradient: gradients.base.fadeTop10,
    width: borders.width.medium,
  })}
`;

export const ItemText = styled.p`
  ${typography.body.mediumBold};
  color: ${colors.text.text1};
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
`;

export const DetailsContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 640px;
  flex-direction: column;
  align-items: center;
  gap: ${layout.space.xLarge};
`;

export const Sessions = styled.div`
  display: flex;
  width: 100%;
  max-width: 424px;
  gap: ${layout.space.xSmall};
  justify-content: center;
  align-items: flex-start;
  align-content: flex-start;
  flex-wrap: wrap;
`;

export const Session = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${layout.space.xxSmall};
`;

export const SessionLabel = styled.p`
  ${typography.body.mediumBold};
  color: ${colors.text.text1};
`;

export const CarSelection = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
`;

export const Header = styled.div`
  display: flex;
  width: 100%;
  border-top-right-radius: ${borders.radius.xLarge};
  border-top-left-radius: ${borders.radius.xLarge};
  padding: ${layout.space.medium};
  justify-content: flex-start;
  align-items: center;

  ${gradientBorder({
    gradient: gradients.base.fadeBottom10,
    width: borders.width.medium,
  })}
`;

export const HeaderTitle = styled.h2`
  ${typography.subtitle.medium};
  color: ${colors.text.text2};
`;

export const CarouselContainer = styled.div`
  display: flex;
  width: 100vw;

  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);

  flex-direction: column;
  justify-content: center;
  align-items: center;

  gap: ${layout.space.xSmall};

  overflow: hidden;
`;

export const Items = styled.div<{
  $activeIndex: number;
  $cardWidth: number;
  $gap: number;
}>`
  display: flex;
  width: max-content;
  align-items: flex-start;
  align-self: flex-start; /* 👈 ADD THIS LINE */
  gap: ${({ $gap }) => `${$gap}px`};
  transform: ${({ $activeIndex, $cardWidth, $gap }) =>
    `translateX(calc(50vw - ${$cardWidth / 2}px - ${
      $activeIndex * ($cardWidth + $gap)
    }px))`};
  transition: transform 0.35s ease;
`;
