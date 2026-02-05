import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  Actions,
  AvatarContainer,
  ChampionCount,
  ChampionCountContent,
  Contents,
  Details,
  DetailsContainer,
  Frame,
  ProfileHeaderContainer,
  TagContent,
  TextContainer,
  TextContent,
  UserGame,
  Username,
} from "./ProfileHeader.styles";
import Button from "@/components/Button/Button";
import EditIcon from "@assets/Icon//Edit.svg?react";
import FollowersIcon from "@assets/Icon/Followers.svg?react";
import Avatar from "@/components/Avatar/Avatar";
import type { AvatarVariants } from "@/components/Avatar/Avatar.variants";

type ProfileHeaderProps = {
  gameType: string;
  username: string;
  editOnClick: () => void;
  avatarType: "preset" | "upload";
  avatarValue: AvatarVariants | string;
  followersOnClick?: () => void;
  followersCount?: number;
  championCount?: number;
};

const ProfileHeader = ({
  gameType,
  username,
  editOnClick,
  avatarType,
  avatarValue,
  followersOnClick,
  followersCount,
  championCount,
}: ProfileHeaderProps) => {
  const isMobile = useMediaQuery("(max-width: 919px)");

  return (
    <ProfileHeaderContainer>
      <Frame />
      <Contents>
        <DetailsContainer>
          <Details>
            <AvatarContainer>
              <Avatar size="xxLarge" avatarType={avatarType} avatarValue={avatarValue} />
            </AvatarContainer>
            <TextContainer>
              <TextContent>
                <Username>{username}</Username>
                <UserGame>{gameType}</UserGame>
              </TextContent>
              <TagContent>
                {!!followersCount && (
                  <Button
                    color="base"
                    icon={{ left: <FollowersIcon /> }}
                    onClick={followersOnClick}
                    rounded
                  >
                    {followersCount} Followers
                  </Button>
                )}
                {!!championCount && (
                  <ChampionCount>
                    <ChampionCountContent>{championCount}x Champion</ChampionCountContent>
                  </ChampionCount>
                )}
              </TagContent>
            </TextContainer>
          </Details>
          <Actions>
            <Button
              color="base"
              icon={{ left: <EditIcon /> }}
              onClick={editOnClick}
              fullWidth
            >
              {isMobile ? null : "Edit Profile"}
            </Button>
          </Actions>
        </DetailsContainer>
      </Contents>
    </ProfileHeaderContainer>
  );
};

export default ProfileHeader;
