import { css } from "styled-components";

// -- Mixin for gradient border top or bottom -- //
// To be used for a top or bottom border only

type EdgeFadeBorderOptions = {
  gradient: string;
  width?: string;
  edge?: "top" | "bottom" | "both";
};

const edgeFadeBorder = ({
  gradient,
  width = "2px",
  edge = "top",
}: EdgeFadeBorderOptions) => css`
  position: relative;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    height: ${width};
    background: ${gradient};
    pointer-events: none;
    ${edge === "top" &&  `
      top: 0;
      border-top-left-radius: inherit;
      border-top-right-radius: inherit;
    `}

    ${edge === "bottom" && `
      bottom: 0;
      border-bottom-left-radius: inherit;
      border-bottom-right-radius: inherit;
    `}
    
    ${edge === "both" && `
      top: 0;
      border-top-left-radius: inherit;
      border-top-right-radius: inherit;
    `}
  }

  ${edge === "both" && `
    &::before {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: ${width};
      background: ${gradient};
      pointer-events: none;
      border-bottom-left-radius: inherit;
      border-bottom-right-radius: inherit;
    }
  `}
`;

// -- Specific Mixins -- //
export const topFadeBorder = (opts: Omit<EdgeFadeBorderOptions, "edge">) =>
  edgeFadeBorder({ ...opts, edge: "top" });

export const bottomFadeBorder = (opts: Omit<EdgeFadeBorderOptions, "edge">) =>
  edgeFadeBorder({ ...opts, edge: "bottom" });

export const bothFadeBorders = (opts: Omit<EdgeFadeBorderOptions, "edge">) => 
  edgeFadeBorder({ ...opts, edge: "both" });