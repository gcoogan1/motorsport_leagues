import type { BannerImageValue } from "@/types/squad.types";
import { BannerContainer, BannerImage } from "./Banner.styles";
import { getBannerVariants } from "./Banner.variants";


type BannerProps = {
  banner: BannerImageValue | "none";
};

const Banner = ({ banner }: BannerProps) => {
  const bannerVariants = getBannerVariants();

  const bannerImage =
    banner === "none"
      ? null
      : banner.type === "preset"
        ? bannerVariants[banner.variant]
        : banner.previewUrl ?? null;

  const bannerAlt =
    banner === "none"
      ? "none banner"
      : banner.type === "preset"
        ? `${banner.variant} banner`
        : "uploaded banner";

  return (
    <BannerContainer>
      {bannerImage && <BannerImage src={bannerImage} alt={bannerAlt} />}
    </BannerContainer>
  );
};

export default Banner