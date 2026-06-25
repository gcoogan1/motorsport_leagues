import { ImageContainer } from "./SeasonPoster.styles";

type SeasonPosterProps = {
  posterUrl?: string;
};

const SeasonPoster = ({ posterUrl }: SeasonPosterProps) => {
  return (
    <ImageContainer src={posterUrl} alt="Season Poster" />
  )
}

export default SeasonPoster