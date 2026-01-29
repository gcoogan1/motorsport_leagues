import { AvatarImage, AvatarWrapper } from "./Avatar.styles"
import { getAvatarVariants, type AvatarSize, type AvatarVariants } from "./Avatar.variants"

type AvatarProps = {
  size?: AvatarSize;
  type: AvatarVariants;
}

const Avatar = ({ size = "medium", type }: AvatarProps) => {

  const AVATAR_SIZES: Record<AvatarSize, number> = {
    tiny: 20,
    small: 32,
    medium: 38,
    large: 48,
    xLarge: 80,
    xxLarge: 160,
  };

  const sizeValue = AVATAR_SIZES[size];
  const avatarImg = getAvatarVariants()[type].avatar;

  return (
    <AvatarWrapper $sizeValue={sizeValue}>
      {avatarImg && <AvatarImage src={avatarImg} alt={`${type} avatar`} />}
    </AvatarWrapper>
  )
}

export default Avatar