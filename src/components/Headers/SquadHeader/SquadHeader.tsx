import type { SquadViewType } from "@/types/squad.types";
import { useEffect, useRef, useState } from "react";
import { useModal } from "@/providers/modal/useModal";
import Button from "@/components/Button/Button";
import MenuDropdown from "@/components/Dropdowns/MenuDropdown/MenuDropdown";
import ShareIcon from "@assets/Icon/Share.svg?react";
import EditIcon from "@assets/Icon/Edit.svg?react";
import InviteIcon from "@assets/Icon/Invite.svg?react";
import ChatIcon from "@assets/Icon/Chat.svg?react";
import MembersIcon from "@assets/Icon/Members.svg?react";
import FollowersIcon from "@assets/Icon/Followers.svg?react";
import FollowingIcon from "@assets/Icon/Following.svg?react";
import FollowIcon from "@assets/Icon/Follow.svg?react";
import LeaveIcon from "@assets/Icon/Leave.svg?react";
import MoreVertical from "@assets/Icon/More_Vertical.svg?react";
import Avatar from "@/components/Avatar/Avatar";
import {
  Actions,
  BannerContainer,
  BannerImage,
  BottomLine,
  ButtonContainer,
  Container,
  LeftActions,
  LeftCover,
  MemberBottom,
  MemberTop,
  MembersList,
  MembersContainer,
  MoreActionsContainer,
  Name,
  RightActions,
  RightCover,
  TextContainer,
  TopContainer,
  TopLine,
} from "./SquadHeader.styles";
import SquadGuestFollow from "@/features/squads/modals/errors/SquadGuestFollow/SquadGuestFollow";
import SquadNoProfile from "@/features/squads/modals/core/SquadNoProfile/SquadNoProfile";
import FollowSquad from "@/features/squads/forms/Follow/FollowSquad";
import UnfollowSquad from "@/features/squads/modals/errors/UnfollowSqaud/UnfollowSquad";

type MemberAvatar = {
  id: string;
  avatarType: "preset" | "upload";
  avatarValue: string;
};

type SquadHeaderProps = {
  squadId: string;
  squadName: string;
  viewType: SquadViewType;
  hasProfile: boolean;
  isFollowing?: boolean;
  viewerAccountId?: string;
  members?: MemberAvatar[];
  followersCount?: number;
  bannerImage?: string;
  onFollowersClick?: () => void;
  onEdit?: () => void;
  onShare?: () => void;
  onInvite?: () => void;
};

const SquadHeader = ({
  squadId,
  squadName,
  bannerImage,
  hasProfile,
  isFollowing,
  viewerAccountId,
  members = [],
  followersCount = 0,
  onFollowersClick,
  onEdit,
  onShare,
  onInvite,
  viewType = "guest",
}: SquadHeaderProps) => {
  //TODO: Get Members and render in members list. Get number of followers.

  const { openModal } = useModal();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreContainerRef = useRef<HTMLDivElement | null>(null);
  const memberText = members.length === 1 ? "Member" : "Members";
  const followerText = followersCount === 1 ? "Follower" : "Followers";

  useEffect(() => {
    if (!isMoreOpen) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (moreContainerRef.current && !moreContainerRef.current.contains(target)) {
        setIsMoreOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isMoreOpen]);

  // -- Handlers -- //
  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    }
  };

  const handleInvite = () => {
    if (onInvite) {
      onInvite();
    }
  };

  const handleChat = () => {
    console.log("Chat clicked for squad:", squadId);
  };

  const handleMore = () => {
    setIsMoreOpen((prev) => !prev);
  };

  const handleLeaveSquad = () => {
    if (!viewerAccountId) {
      return;
    }

    console.log(`Leave squad with ID ${squadId} for account ${viewerAccountId}`);
    setIsMoreOpen(false);
    return;
  };

  const handleFollowSquad = () => {
    if (viewType === "guest" || !viewerAccountId) {
      return openModal(<SquadGuestFollow />);
    }
    if (viewType === "user" && !hasProfile) {
      return openModal(<SquadNoProfile />);
    }

    if (isFollowing) { 
      openModal(<UnfollowSquad squadId={squadId} accountId={viewerAccountId} />);
      return;
    }

    openModal(<FollowSquad squadIdToFollow={squadId} accountId={viewerAccountId} />);
    return;
  }

  const handleFollowersClick = () => {
    if (onFollowersClick) {
      onFollowersClick();
    }
  };

  // -- Render Right Actions based on view type -- //
  const renderRightActions = () => {
    if (viewType === "owner") {
      return (
        <>
          <Button
            color="base"
            variant="filled"
            icon={{ left: <ChatIcon /> }}
            onClick={handleChat}
          >
            Chat
          </Button>
          <Button
            color="base"
            variant="outlined"
            icon={{ left: <EditIcon /> }}
            onClick={handleEdit}
          >
            Edit
          </Button>
        </>
      );
    }

    if (viewType === "member") {
      return (
        <>
          <Button
            color="base"
            variant="outlined"
            icon={{ left: <ChatIcon /> }}
            onClick={handleChat}
          >
            Chat
          </Button>
          <MoreActionsContainer ref={moreContainerRef}>
            <Button
              color="base"
              variant="filled"
              icon={{ left: <MoreVertical /> }}
              onClick={handleMore}
            />
            {isMoreOpen && (
              <MenuDropdown
                type="text"
                isStandAlone={true}
                options={[
                  {
                    label: "Leave Squad",
                    value: "leave",
                    icon: <LeaveIcon />,
                  },
                ]}
                onSelect={() => handleLeaveSquad()}
              />
            )}
          </MoreActionsContainer>
        </>
      );
    }

    if (viewType === "guest" || viewType === "user") {
      return (
        <Button
          color={isFollowing ? "system" : "base"}
          variant="filled"
          icon={{ left: isFollowing ? <FollowingIcon /> : <FollowIcon /> }}
          onClick={handleFollowSquad}
        >
          {isFollowing ? "Following Squad" : "Follow Squad"}
        </Button>
      );
    }

    return null;
  };

  return (
    <Container>
      <TopContainer>
        <BannerContainer>
          <Actions>
            <LeftActions>
              <Button
                color="base"
                variant="outlined"
                icon={{ left: <ShareIcon /> }}
                onClick={handleShare}
              >
                Share
              </Button>
              {viewType === "owner" && (
                <Button
                  color="base"
                  variant="outlined"
                  icon={{ left: <InviteIcon /> }}
                  onClick={handleInvite}
                >
                  Invite
                </Button>
              )}
            </LeftActions>
            <RightActions>{renderRightActions()}</RightActions>
          </Actions>
          <BannerImage $imageBg={bannerImage} />
          <TextContainer>
            <Name>{squadName}</Name>
          </TextContainer>
        </BannerContainer>
      </TopContainer>
      <MembersContainer>
        <MemberTop>
          <TopLine />
          <ButtonContainer>
            <Button
              color="base"
              variant="filled"
              rounded
              icon={{ left: <MembersIcon /> }}
            >
              {members.length} {memberText}
            </Button>
          </ButtonContainer>
        </MemberTop>
        <MembersList>
          <LeftCover />
          {members.map((member) => (
            <Avatar
              key={member.id}
              avatarType={member.avatarType}
              avatarValue={member.avatarValue}
            />
          ))}
          <RightCover />
        </MembersList>
        <MemberBottom>
          <BottomLine />
          <ButtonContainer>
            <Button
              color="base"
              variant="outlined"
              onClick={handleFollowersClick}
              rounded
              icon={{ left: <FollowersIcon /> }}
            >
              {followersCount} {followerText}
            </Button>
          </ButtonContainer>
        </MemberBottom>
      </MembersContainer>
    </Container>
  );
};

export default SquadHeader;
