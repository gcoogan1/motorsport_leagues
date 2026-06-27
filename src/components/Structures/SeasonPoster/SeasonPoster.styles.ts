import styled from "styled-components";

export const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: auto;
  max-height: 480px;
  aspect-ratio: 2/1;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      linear-gradient(360deg, #151515 0%, rgba(21, 21, 21, 0) 10%),
      linear-gradient(180deg, #151515 0%, rgba(21, 21, 21, 0) 10%);
    z-index: 1;
  }
`;

export const PosterImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;
