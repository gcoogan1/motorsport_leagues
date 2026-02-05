import AvatarBlack from "@assets/Avatar/Black.png"
import AvatarBlue from "@assets/Avatar/Blue.png"
import AvatarYellow from "@assets/Avatar/Yellow.png"
import AvatarGreen from "@assets/Avatar/Green.png"
import AvatarRed from "@assets/Avatar/Red.png"
import AvatarEmail from "@assets/Avatar/Email.png"

export type AvatarVariants = "none" | "black" | "blue" | "green" | "red" | "yellow" | "email";

export type AvatarSize = "xxLarge" | "xLarge" | "large" | "medium" | "small" | "tiny";

type AvatarVariantStyles = {
  [key in AvatarVariants]: {
    avatar: string;
  };
};

export const getAvatarVariants = (): AvatarVariantStyles => {
  return {
    none: {
      avatar: "none",
    },
    black: {
      avatar: AvatarBlack,
    },
    blue: {
      avatar: AvatarBlue,
    },
    green: {
      avatar: AvatarGreen,
    },
    red: {
      avatar: AvatarRed,
    },
    yellow: {
      avatar: AvatarYellow,
    },
    email: {
      avatar: AvatarEmail,
    },
  };
}