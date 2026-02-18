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
import FollowingIcon from "@assets/Icon/Following.svg?react";
import Avatar from "@/components/Avatar/Avatar";
import type { AvatarVariants } from "@/components/Avatar/Avatar.variants";
import type { ProfileViewType } from "@/types/profile.types";

type ProfileHeaderProps = {
  gameType: string;
  username: string;
  viewType: ProfileViewType;
  editOnClick?: () => void;
  isFollowing?: boolean;
  avatarType: "preset" | "upload";
  avatarValue: AvatarVariants | string;
  followersOnClick?: () => void;
  followersCount?: number;
  championCount?: number;
  onMemberFollow?: () => void;
  onGuestFollow?: () => void;
};

const ProfileHeader = ({
  gameType,
  username,
  viewType,
  editOnClick,
  isFollowing,
  avatarType,
  avatarValue,
  followersOnClick,
  followersCount,
  championCount,
  onMemberFollow,
  onGuestFollow,
}: ProfileHeaderProps) => {
  const isMobile = useMediaQuery("(max-width: 919px)");

  const isOwnerProfile = viewType === "owner";
  const isMemberProfile = viewType === "member";
  // const isGuestProfile = viewType === "guest";

  const handleMemeberFollow = () => {
    onMemberFollow?.();
  };

  const handleGuestFollow = () => {
    onGuestFollow?.();
  };

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
                <UserGame $isIRacing={gameType === "iRacing"}>{gameType}</UserGame>
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
                icon={{ left: isFollowing ? <FollowingIcon /> : <FollowIcon /> }}
                onClick={
                  isMemberProfile ? handleMemeberFollow : handleGuestFollow
                }
                fullWidth
              >
                {isMobile ? null : isFollowing ? "Following" : "Follow"}
              </Button>
            )}
          </Actions>
        </DetailsContainer>
      </Contents>
    </ProfileHeaderContainer>
  );
};

export default ProfileHeader;
