import { ImageContainer, PosterImage } from "./SeasonPoster.styles";

type SeasonPosterProps = {
  posterUrl?: string;
};

const SeasonPoster = ({ posterUrl }: SeasonPosterProps) => {
  return (
    <ImageContainer>
      <PosterImage src={posterUrl} alt="Season Poster" />
    </ImageContainer>
  )
}

export default SeasonPoster