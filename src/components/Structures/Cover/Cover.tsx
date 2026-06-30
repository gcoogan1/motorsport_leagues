import { useEffect, useState } from "react";
import type {
  ButtonColor,
  ButtonVariant,
} from "@/components/Button/Button.variants";
import MenuDropdown from "@/components/Dropdowns/MenuDropdown/MenuDropdown";
import type { LeagueCover, LeagueStatus } from "@/types/league.types";
import type { Tag } from "../../Tags/Tags.variants";
import type { GameType } from "@/types/profile.types";
import { convertGameTypeToFullName } from "@/utils/convertGameTypes";
import { getCoverVariants } from "./Cover.variants";
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
  ActionDropdownContainer,
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


export type CoverAction = {
  id?: string;
  label?: string;
  variant?: ButtonVariant;
  color?: ButtonColor;
  onClick?: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  dropdownOptions?: {
    label: string;
    value: string;
    icon?: React.ReactNode;
  }[];
  onDropdownSelect?: (value: string) => void;
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
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const coverVariants = getCoverVariants();
  const resolvedBackgroundImageUrl =
    backgroundImageUrl && backgroundImageUrl in coverVariants
      ? coverVariants[backgroundImageUrl as LeagueCover]
      : backgroundImageUrl;

  const participantText = participantsCount === 1 ? "Participant" : "Participants";
  const followerText = followersCount === 1 ? "Follower" : "Followers";

  const statusContentMap = {
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
  } as const;

  const statusContent = statusContentMap[status] ?? statusContentMap.setup;

  useEffect(() => {
    if (!openDropdownId) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;

      if (target?.closest("[data-cover-actions-container='true']")) {
        return;
      }

      setOpenDropdownId(null);
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownId]);


  return (
    <CoverWrapper>
      <CoverContainer $backgroundImageUrl={resolvedBackgroundImageUrl}>
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
            {optionalActions.map((action, index) => {
              const actionId = action.id ?? action.label ?? `cover-action-${index}`;
              const hasDropdown = Boolean(action.dropdownOptions?.length);

              if (hasDropdown) {
                return (
                  <ActionDropdownContainer
                    key={actionId}
                    data-cover-actions-container="true"
                  >
                    <Button
                      size="medium"
                      icon={{
                        left: action.leftIcon,
                        right: action.rightIcon,
                      }}
                      onClick={() => {
                        setOpenDropdownId((prev) => (prev === actionId ? null : actionId));
                      }}
                      variant={action.variant || "filled"}
                      color={action.color || "primary"}
                      ariaLabel={action.label}
                    >
                      {action.label}
                    </Button>
                    {openDropdownId === actionId && (
                      <MenuDropdown
                        type="text"
                        isStandAlone={true}
                        options={action.dropdownOptions ?? []}
                        onSelect={(value) => {
                          action.onDropdownSelect?.(value);
                          setOpenDropdownId(null);
                        }}
                      />
                    )}
                  </ActionDropdownContainer>
                );
              }

              return (
                <Button
                  size="medium"
                  key={actionId}
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
              );
            })}
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
