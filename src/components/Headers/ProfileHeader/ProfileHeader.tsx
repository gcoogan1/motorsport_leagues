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
import FollowIcon from "@assets/Icon/Follow.svg?react";
import Avatar from "@/components/Avatar/Avatar";
import type { AvatarVariants } from "@/components/Avatar/Avatar.variants";
import type { ProfileViewType } from "@/types/profile.types";

type ProfileHeaderProps = {
  gameType: string;
  username: string;
  viewType: ProfileViewType;
  editOnClick?: () => void;
  avatarType: "preset" | "upload";
  avatarValue: AvatarVariants | string;
  followersOnClick?: () => void;
  followersCount?: number;
  championCount?: number;
};

const ProfileHeader = ({
  gameType,
  username,
  viewType,
  editOnClick,
  avatarType,
  avatarValue,
  followersOnClick,
  followersCount,
  championCount,
}: ProfileHeaderProps) => {
  const isMobile = useMediaQuery("(max-width: 919px)");

  const isOwnerProfile = viewType === "owner";
  const isMemberProfile = viewType === "member";
  // const isGuestProfile = viewType === "guest";

  const handleMemeberFollow = () => {
    console.log("Follow member");
  };

  const handleGuestFollow = () => {
    console.log("Prompt login to follow");
  };

  console.log("Rendering ProfileHeader with props:", {
    gameType,
    username,
    viewType,
    avatarType,
    avatarValue,
    followersCount,
    championCount,
  });

  return (
    <ProfileHeaderContainer>
      <Frame />
      <Contents>
        <DetailsContainer>
          <Details>
            <AvatarContainer>
              <Avatar
                size="xxLarge"
                avatarType={avatarType}
                avatarValue={avatarValue}
              />
            </AvatarContainer>
            <TextContainer>
              <TextContent>
                <Username>{username}</Username>
                <UserGame>{gameType}</UserGame>
              </TextContent>
              <TagContent>
                <Button
                  color="base"
                  icon={{ left: <FollowersIcon /> }}
                  onClick={followersOnClick}
                  rounded
                >
                  {followersCount} Followers
                </Button>

                {!!championCount && (
                  <ChampionCount>
                    <ChampionCountContent>
                      {championCount}x Champion
                    </ChampionCountContent>
                  </ChampionCount>
                )}
              </TagContent>
            </TextContainer>
          </Details>
          <Actions>
            {isOwnerProfile ? (
              <Button
                color="base"
                icon={{ left: <EditIcon /> }}
                onClick={editOnClick}
                fullWidth
              >
                {isMobile ? null : "Edit Profile"}
              </Button>
            ) : (
              <Button
                color="base"
                icon={{ left: <FollowIcon /> }}
                onClick={
                  isMemberProfile ? handleMemeberFollow : handleGuestFollow
                }
                fullWidth
              >
                {isMobile ? null : "Follow"}
              </Button>
            )}
          </Actions>
        </DetailsContainer>
      </Contents>
    </ProfileHeaderContainer>
  );
};

export default ProfileHeader;
