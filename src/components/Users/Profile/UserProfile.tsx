import type { AvatarVariants } from "@/components/Avatar/Avatar.variants";
import type { Tag } from "@/components/Tags/Tags.variants";
import { Information, ProfileContainer, TextContainer, Username, UsernameContainer, AvatarWrapper } from "./UserProfile.styles";
import Avatar from "@/components/Avatar/Avatar";
import Tags from "@/components/Tags/Tags";
import { useMediaQuery } from "@/hooks/useMediaQuery";

type UserProfileProps = {
  username: string;
  information?: string;
  size?: "small" | "medium" | "large";
  avatarType: "preset" | "upload";
  avatarValue: AvatarVariants | string;
  tags?: Tag[];
  centerContent?: boolean;
  shortenTeamText?: boolean;
}

const UserProfile = ({ username, information, size = "medium",  avatarType, avatarValue, tags, centerContent = false, shortenTeamText = false }: UserProfileProps) => {

  const avatarSize = size === "small" ? "tiny" : size;
  const isMobile = useMediaQuery("(max-width: 919px)");
  const hideTags = isMobile && shortenTeamText;

  return (
    <ProfileContainer size={size} $centerContent={centerContent}>
      <AvatarWrapper>
        <Avatar size={avatarSize} avatarType={avatarType} avatarValue={avatarValue} />
      </AvatarWrapper>
      <TextContainer $size={size}>
        {size === "large" ? (
          <>
            <UsernameContainer  isLarge={true}>
              <Username $size={size} >{username}</Username>
              {information && <Information $size={size}>{information}</Information>}
            </UsernameContainer>
              {tags && tags.length > 0 && !hideTags && (
                <Tags variants={tags} />
              )}
          </>
        ): (
          <>
          <UsernameContainer isLarge={false}>
            <Username $size={size}>{username}</Username>
            {tags && tags.length > 0 && !hideTags && (
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