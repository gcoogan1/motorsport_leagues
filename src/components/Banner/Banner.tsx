import type { SquadBanner } from "@/types/squad.types"
import { BannerContainer, BannerImage } from "./Banner.styles";
import { getBannerVariants } from "./Banner.variants";


type BannerProps = {
  variant: SquadBanner | "none";
}

const Banner = ({ variant }: BannerProps) => {
  const bannerVariants = getBannerVariants();
  const bannerImage = variant !== "none" ? bannerVariants[variant] : null;

  return (
    <BannerContainer>
      {bannerImage && <BannerImage src={bannerImage} alt={`${variant} banner`} />}
    </BannerContainer>
  )
}

export default Banner