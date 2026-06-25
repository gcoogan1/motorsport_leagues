import styled from "styled-components";

export const ImageContainer = styled.img`
  width: 100%;
  height: auto;
  max-width: 960px;
  max-height: 480px;
  aspect-ratio: 2/1;
  background:
    linear-gradient(
      180deg,
      var(--Color-Base-2, #151515) 0%,
      rgba(21, 21, 21, 0.00) 10%
    ),
    linear-gradient(
    0deg,
    var(--Color-Base-2, #151515) 0%,
    rgba(21, 21, 21, 0.00) 10%
  ),
    url(<path-to-image>) lightgray 50% / cover no-repeat;
`;
