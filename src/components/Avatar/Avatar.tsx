import { AvatarImage, AvatarWrapper, PlaceholderAvatar } from "./Avatar.styles";
import {
  getAvatarVariants,
  type AvatarSize,
  type AvatarVariants,
} from "./Avatar.variants";

type AvatarProps = {
  size?: AvatarSize;
  avatarType: "preset" | "upload";
  avatarValue: AvatarVariants | string;
};

const Avatar = ({ size = "medium", avatarType, avatarValue }: AvatarProps) => {
  const AVATAR_SIZES: Record<AvatarSize, number> = {
    tiny: 20,
    small: 32,
    medium: 38,
    large: 48,
    xLarge: 80,
    xxLarge: 160,
  };

  const sizeValue = AVATAR_SIZES[size];

  const avatarImg =
    avatarType === "preset"
      ? getAvatarVariants()[avatarValue as AvatarVariants].avatar
      : avatarValue;

  if (!avatarImg && avatarImg !== "none") return null;

  return (
    <AvatarWrapper $sizeValue={sizeValue}>
      {avatarImg === "none" ? (
        <PlaceholderAvatar $sizeValue={sizeValue} />
      ) : (
        <AvatarImage src={avatarImg} alt="User Avatar" />
      )}
    </AvatarWrapper>
  );
};

export default Avatar;
