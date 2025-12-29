import { css } from "styled-components";

// -- Mixin for gradient border -- //

type GradientBorderOptions = {
  gradient: string;
  width: string;
};

export const gradientBorder = ({
  gradient,
  width,
}: GradientBorderOptions) => css`
  position: relative;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: ${width};
    background: ${gradient};

    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;

    pointer-events: none;
  }
`;
