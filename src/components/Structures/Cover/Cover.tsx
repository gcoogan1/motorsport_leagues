import type {
  ButtonColor,
  ButtonVariant,
} from "@/components/Button/Button.variants";
import type { LeagueStatus } from "@/types/league.types";
import type { Tag } from "../../Tags/Tags.variants";
import type { GameType } from "@/types/profile.types";
import { convertGameTypeToFullName } from "@/utils/convertGameTypes";
import GameIcon from "@assets/Icon/Game.svg?react";
import HostIcon from "@assets/Icon/Hosts.svg?react";
import ParticipantsIcon from "@assets/Icon/Participants.svg?react";
import FollowersIcon from "@assets/Icon/Followers.svg?react";
import StatusSetupIcon from "@assets/Icon/Season_Setup.svg?react";
import StatusActiveIcon from "@assets/Icon/Season_Active.svg?react";
import StatusCompleteIcon from "@assets/Icon/Season_Complete.svg?react";
import Button from "@/components/Button/Button";
import Tags from "@/components/Tags/Tags";
import {
  ActionsContainer,
  CoverBottom,
  CoverContainer,
  CoverTop,
  CoverWrapper,
  Description,
  DetailsContainer,
  StatusContainer,
  TextContainer,
  Title,
} from "./Cover.styles";


type CoverAction = {
  label?: string;
  variant?: ButtonVariant;
  color?: ButtonColor;
  onClick?: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

type CoverProps = {
  title: string;
  gameType: GameType;
  squadName: string;
  participantsCount: number;
  followersCount: number;
  status: LeagueStatus;
  tags?: Tag[];
  onGameClick?: () => void;
  onSquadNameClick?: () => void;
  onParticipantsClick?: () => void;
  onFollowersClick?: () => void;
  onStatusClick?: () => void;
  backgroundImageUrl?: string;
  description?: string;
  optionalActions?: CoverAction[];
};

const Cover = ({
  title,
  gameType,
  squadName,
  participantsCount,
  followersCount,
  status,
  description,
  optionalActions = [],
  backgroundImageUrl,
  tags,
  onGameClick,
  onSquadNameClick,
  onParticipantsClick,
  onFollowersClick,
  onStatusClick,
}: CoverProps) => {

  const participantText = participantsCount === 1 ? "Participant" : "Participants";
  const followerText = followersCount === 1 ? "Follower" : "Followers";

  const statusContent = {
    setup: {
      label: "Coming Soon",
      icon: <StatusSetupIcon />,
    },
    active: {
      label: "Season Active",
      icon: <StatusActiveIcon />,
    },
    complete: {
      label: "Season Complete",
      icon: <StatusCompleteIcon />,
    },
  }[status];


  return (
    <CoverWrapper>
      <CoverContainer $backgroundImageUrl={backgroundImageUrl}>
        <CoverTop>
          <DetailsContainer>
            <Button
              size="small"
              icon={{ left: <GameIcon /> }}
              color="base"
              variant="filled"
              rounded
              onClick={onGameClick}
            >
              {convertGameTypeToFullName(gameType)}
            </Button>
            <Button
              size="small"
              icon={{ left: <HostIcon /> }}
              color="base"
              variant="filled"
              rounded
              onClick={onSquadNameClick}
            >
              {squadName}
            </Button>
          </DetailsContainer>
          <ActionsContainer>
            {optionalActions.map((action) => (
              <Button
                size="medium"
                key={action.label}
                icon={{
                  left: action.leftIcon,
                  right: action.rightIcon,
                }}
                onClick={action.onClick}
                variant={action.variant || "filled"}
                color={action.color || "primary"}
                ariaLabel={action.label}
              >
                {action.label}
              </Button>
            ))}
          </ActionsContainer>
        </CoverTop>
        <CoverBottom>
        {tags && (
          <Tags variants={tags} />
        )}
          <TextContainer>
            <Title>{title}</Title>
            {description && <Description>{description}</Description>}
          </TextContainer>
        </CoverBottom>
      </CoverContainer>
      <StatusContainer>
        <Button
          size="small"
          icon={{ left: <ParticipantsIcon /> }}
          color="primary"
          variant="ghost"
          rounded
          onClick={onParticipantsClick}
        >
          {participantsCount} {participantText}
        </Button>
        <Button
          size="small"
          icon={{ left: <FollowersIcon /> }}
          color="primary"
          variant="ghost"
          rounded
          onClick={onFollowersClick}
        >
          {followersCount} {followerText}
        </Button>
        <Button
          size="small"
          icon={{ left: statusContent.icon }}
          color="primary"
          variant="outlined"
          rounded
          onClick={onStatusClick}
        >
          {statusContent.label}
        </Button>
      </StatusContainer>
    </CoverWrapper>
  );
};

export default Cover;
