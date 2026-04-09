import type { LEAGUE_COVER_VARIANTS } from "@/types/league.types";
import Cover1 from "@/assets/Cover/cover1.png";
import Cover2 from "@/assets/Cover/cover2.png";
import Cover3 from "@/assets/Cover/cover3.png";
import Cover4 from "@/assets/Cover/cover4.png";
import Cover5 from "@/assets/Cover/cover5.png";

export type CoverVariantStyles = {
  [key in typeof LEAGUE_COVER_VARIANTS[number]]: string;
};

export const getCoverVariants = (): CoverVariantStyles => {
  return {
    cover1: Cover1,
    cover2: Cover2,
    cover3: Cover3,
    cover4: Cover4,
    cover5: Cover5,
  };
};