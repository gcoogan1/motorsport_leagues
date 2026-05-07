import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";
import { gradientBorder } from "@/app/design/mixens/gradientBorder";

const { gradients, layout, borders } = designTokens;

export const Container = styled.div<{ isFlipped?: boolean }>`
  display: flex;
  width: 100%;
  max-width: 960px;
  border-radius: ${borders.radius.xLarge};
  flex-direction: ${({ isFlipped }) => (isFlipped ? "row-reverse" : "row")};
  align-items: center;
  padding-top: ${layout.space.medium};
  padding-bottom: ${layout.space.medium};
  padding-right: ${({ isFlipped }) => (isFlipped ? 0 : `${layout.space.medium}`)};
  padding-left: ${({ isFlipped }) => (isFlipped ? `${layout.space.medium}` : 0)};
  gap: ${layout.space.xLarge};

  ${({ isFlipped }) => (!isFlipped
    ? gradientBorder({
      gradient: gradients.base.fadeLeft20,
      width: borders.width.medium,
    })
    : gradientBorder({
      gradient: gradients.base.fadeRight20,
      width: borders.width.medium,
    }))} ${layout.mediaQueries.mobile} {
    flex-direction: column;
    padding: ${layout.space.medium};
    padding: ${layout.space.medium};

    ${gradientBorder({
      gradient: gradients.base.fadeBottom20,
      width: borders.width.medium,
    })};
  }
`;

export const ImageContainer = styled.img<{ isFlipped?: boolean }>`
  flex: 1 1 0;
  width: auto;
  min-width: 0;
  height: auto;
  object-fit: cover;
  background: ${(
    { isFlipped },
  ) => (isFlipped
    ? "linear-gradient(90deg, rgba(21, 21, 21, 0) 69.71%, #151515 100%);"
    : "linear-gradient(270deg, rgba(21, 21, 21, 0) 69.71%, #151515 100%);")};

  border-top-right-radius: ${(
    { isFlipped },
  ) => (isFlipped ? 0 : borders.radius.large)};
  border-bottom-right-radius: ${(
    { isFlipped },
  ) => (isFlipped ? 0 : borders.radius.large)};

  border-top-left-radius: ${(
    { isFlipped },
  ) => (isFlipped ? borders.radius.large : 0)};
  border-bottom-left-radius: ${(
    { isFlipped },
  ) => (isFlipped ? borders.radius.large : 0)};

  ${layout.mediaQueries.mobile} {
    width: 100%;
    border-radius: ${borders.radius.large};
  }
`;
