import Avatar from "../Avatar/Avatar";
import CloseIcon from "@assets/Icon/Close.svg?react";
import {
  ChipWrapper,
  ProfileTextContainer,
  Username,
  Game,
  ChipButton,
  TagText,
  ProfileInfoContainer,
} from "./Chip.styles";
import type { AvatarVariants } from "../Avatar/Avatar.variants";

type ChipProps = {
  type: "profile" | "tag";
  onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  profile?: {
    avatarType: "preset" | "upload";
    avatarValue: AvatarVariants | string;
    username: string;
    game: string;
  };
  tagText?: string;
};

const Chip = ({ type, onClick, profile, tagText }: ChipProps) => {
  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onClick?.(event as unknown as React.MouseEvent<HTMLButtonElement>);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onClick?.(event);
  };

  return (
    <ChipWrapper type={type}>
      {type === "profile" && profile && (
        <>
          <ProfileInfoContainer>
            <Avatar
              avatarType={profile.avatarType}
              avatarValue={profile.avatarValue}
              size="small"
            />
            <ProfileTextContainer>
              <Username>{profile.username}</Username>
              <Game>{profile.game}</Game>
            </ProfileTextContainer>
          </ProfileInfoContainer>
          <ChipButton
            type="button"
            onPointerDown={handlePointerDown}
            onClick={handleClick}
            aria-label={`View ${profile.username}'s profile`}
          >
            <CloseIcon width={18} height={18} />
          </ChipButton>
        </>
      )}
      {type === "tag" && tagText && (
        <>
          <TagText>{tagText}</TagText>
        </>
      )}
    </ChipWrapper>
  );
};

export default Chip;
