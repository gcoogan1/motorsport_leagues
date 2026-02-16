import type { AvatarVariants } from "@/components/Avatar/Avatar.variants";
import type { Tag } from "@/components/Tags/Tags.variants";
import { Information, ProfileContainer, TextContainer, Username, UsernameContainer } from "./UserProfile.styles";
import Avatar from "@/components/Avatar/Avatar";
import Tags from "@/components/Tags/Tags";

type UserProfileProps = {
  username: string;
  information?: string;
  size?: "small" | "medium" | "large";
  avatarType: "preset" | "upload";
  avatarValue: AvatarVariants | string;
  tags?: Tag[];
}

const UserProfile = ({ username, information, size = "medium",  avatarType, avatarValue, tags }: UserProfileProps) => {

  const avatarSize = size === "small" ? "tiny" : size;

  return (
    <ProfileContainer size={size}>
      <Avatar size={avatarSize} avatarType={avatarType} avatarValue={avatarValue} />
      <TextContainer $size={size}>
        {size === "large" ? (
          <>
            <UsernameContainer isLarge={true}>
              <Username $size={size}>{username}</Username>
              {information && <Information $size={size}>{information}</Information>}
            </UsernameContainer>
              {tags && tags.length > 0 && (
                <Tags variants={tags} />
              )}
          </>
        ): (
          <>
          <UsernameContainer isLarge={false}>
            <Username $size={size}>{username}</Username>
            {tags && tags.length > 0 && (
              <Tags variants={tags} />
            )}
          </UsernameContainer>
            {information && <Information $size={size}>{information}</Information>}
          </>
        )}
      </TextContainer>
    </ProfileContainer>
  )
}

export default UserProfile