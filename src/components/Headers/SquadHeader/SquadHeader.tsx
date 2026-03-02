import Button from "@/components/Button/Button";
import ShareIcon from "@assets/Icon/Share.svg?react";
import EditIcon from "@assets/Icon/Edit.svg?react";
import InviteIcon from "@assets/Icon/Invite.svg?react";
import ChatIcon from "@assets/Icon/Chat.svg?react";
import MemebersIcon from "@assets/Icon/Members.svg?react";
import FollowersIcon from "@assets/Icon/Followers.svg?react";
import {
  Actions,
  BannerContainer,
  BannerImage,
  BottomLine,
  ButtonContainer,
  Container,
  LeftActions,
  LeftCover,
  MembersList,
  MemebersContainer,
  MememberBottom,
  MememberTop,
  Name,
  RightActions,
  RightCover,
  TextContainer,
  TopContainer,
  TopLine,
} from "./SquadHeader.styles";
import Avatar from "@/components/Avatar/Avatar";

type MemberAvatar = {
  id: string;
  avatarType: "preset" | "upload";
  avatarValue: string;
};

type SquadHeaderProps = {
  squadId: string;
  squadName: string;
  bannerImage?: string;
  members?: MemberAvatar[];
  onEdit?: () => void;
  onShare?: () => void;
  onInvite?: () => void;
};

const SquadHeader = ({
  squadId,
  squadName,
  bannerImage,
  members = [],
  onEdit,
  onShare,
  onInvite,
}: SquadHeaderProps) => {

  //TODO: Get Members and render in members list. Get number of followers.

  const memberText = members.length === 1 ? "Member" : "Members";


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

  return (
    <Container>
      <TopContainer>
        <BannerContainer>
          <Actions>
            <LeftActions>
              <Button color="base" variant="outlined" icon={{ left: <ShareIcon /> }} onClick={handleShare}>
                Share
              </Button>
              <Button color="base" variant="outlined" icon={{ left: <InviteIcon /> }} onClick={handleInvite}>
                Invite
              </Button>
            </LeftActions>
            <RightActions>
              <Button color="base" variant="filled" icon={{ left: <ChatIcon /> }} onClick={handleChat}>
                Chat
              </Button>
              <Button color="base" variant="filled" icon={{ left: <EditIcon /> }} onClick={handleEdit}>
                Edit Squad
              </Button>
            </RightActions>
          </Actions>
          <BannerImage $imageBg={bannerImage} />
          <TextContainer>
            <Name>{squadName}</Name>
          </TextContainer>
        </BannerContainer>
      </TopContainer>
      <MemebersContainer>
        <MememberTop>
          <TopLine />
          <ButtonContainer>
            <Button color="base" variant="filled" rounded icon={{ left: <MemebersIcon /> }}>
              {members.length} {memberText}
            </Button>
          </ButtonContainer>
        </MememberTop>
        <MembersList>
          <LeftCover />
          {members.map((member) => (
            <Avatar key={member.id} avatarType={member.avatarType} avatarValue={member.avatarValue} />
          ))}
          <RightCover />
        </MembersList>
        <MememberBottom>
          <BottomLine />
          <ButtonContainer>
            <Button color="base" variant="outlined" rounded icon={{ left: <FollowersIcon /> }}>
              9,999 Followers
            </Button>
          </ButtonContainer>
        </MememberBottom>
      </MemebersContainer>
    </Container>
  );
};

export default SquadHeader;
