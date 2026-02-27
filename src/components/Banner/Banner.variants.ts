import type { SQUAD_BANNER_VARIANTS } from "@/types/squad.types";
import Badge1 from "@assets/SquadBadge/Badge1.png"
import Badge2 from "@assets/SquadBadge/Badge2.png"
import Badge3 from "@assets/SquadBadge/Badge3.png"

export type BannerVariantStyles = {
  [key in typeof SQUAD_BANNER_VARIANTS[number]]: string;
}

export const getBannerVariants = (): BannerVariantStyles => {
  return {
    badge1: Badge1,
    badge2: Badge2,
    badge3: Badge3,
  };
}

