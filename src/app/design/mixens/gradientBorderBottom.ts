import { css } from "styled-components";

// -- Mixin for gradient border bottom -- //
// To be used for a bottom border only

type GradientBorderBottomOptions = {
  gradient: string;
  width: string;
};

export const gradientBorderBottom = ({
  gradient,
  width,
}: GradientBorderBottomOptions) => css`
  position: relative;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: ${width};
    background: ${gradient};
  }
`;  