import Avatar from "@/components/Avatar/Avatar";
import type { AvatarVariants } from "@/components/Avatar/Avatar.variants";
import {
  AvatarWrapper,
  ClickableWrapper,
  Content,
  Frame,
  TextContent,
  UserGame,
  Username,
} from "./ProfileCard.styles";

type ProfileCardProps = {
  username: string;
  userGame: string;
  onClick?: () => void;
  cardSize?: "small" | "medium";
  avatarType: "preset" | "upload";
  avatarValue: AvatarVariants | string;
};

const ProfileCard = ({
  username,
  userGame,
  onClick,
  cardSize = "medium",
  avatarType,
  avatarValue,
}: ProfileCardProps) => {
  return (
    <ClickableWrapper type="button" onClick={onClick} $cardSize={cardSize}>
      <Frame />
      <Content>
        <AvatarWrapper>
          <Avatar
            size="large"
            avatarType={avatarType}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            avatarValue={avatarValue as any}
          />
        </AvatarWrapper>
        <TextContent>
          <Username>{username}</Username>
          <UserGame>{userGame}</UserGame>
        </TextContent>
      </Content>
    </ClickableWrapper>
  );
};

export default ProfileCard;
