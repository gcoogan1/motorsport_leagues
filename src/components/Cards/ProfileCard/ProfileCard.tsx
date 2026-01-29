import Avatar from "@/components/Avatar/Avatar"
import type { AvatarVariants } from "@/components/Avatar/Avatar.variants";
import { AvatarWrapper, ClickableWrapper, Content, Frame, TextContent, UserGame, Username } from "./ProfileCard.styles"

type ProfileCardProps = {
  type: AvatarVariants;
  username: string;
  userGame: string;
  cardSize?: "small" | "medium";
}


const ProfileCard = ({ type, username, userGame, cardSize = "medium" }: ProfileCardProps) => {
  return (
    <ClickableWrapper $cardSize={cardSize}>
      <Frame />
      <Content>
        <AvatarWrapper>
          <Avatar size="large" type={type} />
        </AvatarWrapper>
        <TextContent>
          <Username>{username}</Username>
          <UserGame>{userGame}</UserGame>
        </TextContent>
      </Content>
    </ClickableWrapper>
  )
}

export default ProfileCard