import { AvatarImage, AvatarWrapper } from "./Avatar.styles"
import { getAvatarVariants, type AvatarSize, type AvatarVariants } from "./Avatar.variants"

type AvatarProps = {
  size?: AvatarSize;
  type: AvatarVariants;
  imageUrl?: string;
}

const Avatar = ({ size = "medium", type, imageUrl }: AvatarProps) => {

  const AVATAR_SIZES: Record<AvatarSize, number> = {
    tiny: 20,
    small: 32,
    medium: 38,
    large: 48,
    xLarge: 80,
    xxLarge: 160,
  };

  const sizeValue = AVATAR_SIZES[size];
  const avatarImg = imageUrl ? imageUrl : getAvatarVariants()[type].avatar;

  return (
    <AvatarWrapper $sizeValue={sizeValue}>
      {avatarImg && <AvatarImage src={avatarImg} alt={`${type} avatar`} />}
    </AvatarWrapper>
  )
}

export default Avatar