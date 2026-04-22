import type { CoverAction } from "@/components/Structures/Cover/Cover";
import FollowIcon from "@assets/Icon/Follow.svg?react";
import FollowingIcon from "@assets/Icon/Following.svg?react";
import ShareIcon from "@assets/Icon/Share.svg?react";
import MoreIcon from "@assets/Icon/More_Vertical.svg?react";
import AnnouncementsIcon from "@assets/Icon/Announcements.svg?react";
import ChatIcon from "@assets/Icon/Chat.svg?react";
import ManageIcon from "@assets/Icon/Manage.svg?react";

type GetParticipantActionsParams = {
  isDirector: boolean | null;
  onManageLeague: () => void;
  onShareLeague: () => void;
};

type GetGuestActionsParams = {
  onJoinLeague: () => void;
  onShareLeague: () => void;
  onFollowLeague: () => void;
  isFollowing: boolean;
};

export const getParticipantActions = ({
  isDirector,
  onManageLeague,
  onShareLeague,
}: GetParticipantActionsParams): CoverAction[] => {
  return [
    ...(isDirector
      ? [
          {
            id: "manage-league",
            label: "Manage League",
            color: "primary" as const,
            leftIcon: <ManageIcon />,
            onClick: onManageLeague,
          },
        ]
      : []),
    {
      id: "announcements",
      label: "Announcements",
      color: "base" as const,
      leftIcon: <AnnouncementsIcon />,
      onClick: () => {
        console.log("Announcements clicked");
      },
    },
    {
      id: "chat",
      label: "Chat",
      color: "base" as const,
      leftIcon: <ChatIcon />,
      onClick: () => {
        console.log("Chat clicked");
      },
    },
    {
      id: "share",
      leftIcon: <ShareIcon />,
      color: "base" as const,
      onClick: onShareLeague,
    },
    {
      id: "more",
      leftIcon: <MoreIcon />,
      color: "base" as const,
      onClick: () => {
        console.log("More clicked");
      },
    },
  ];
};

export const getGuestActions = ({
  onJoinLeague,
  onShareLeague,
  onFollowLeague,
  isFollowing = false,
}: GetGuestActionsParams): CoverAction[] => {
  return [
    {
      id: "join",
      label: "Join",
      color: "primary" as const,
      onClick: onJoinLeague,
    },
    {
      id: "follow",
      label: isFollowing ? "Following" : "Follow",
      color: isFollowing ? "system" as const : "base" as const,
      leftIcon: isFollowing ? <FollowingIcon /> : <FollowIcon />,
      onClick: onFollowLeague,
    },
    {
      id: "share",
      leftIcon: <ShareIcon />,
      color: "base" as const,
      onClick: onShareLeague,
    },
  ];
};
