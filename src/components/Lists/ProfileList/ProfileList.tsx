import type { Tag } from "@/components/Tags/Tags.variants";
import UserProfile from "@/components/Users/Profile/UserProfile";
import Button from "@/components/Button/Button";
import More_Vertical from "@assets/Icon/More_Vertical.svg?react";
import { ListContainer, ProfileContainer, UserProfileWrapper } from "./ProfileList.styles";

export type ProfileListItem = {
  username: string;
  avatar: {
    avatarType: "preset" | "upload";
    avatarValue: string;
  };
  information?: string;
  tags?: Tag[];
}

type ProfileListProps = {
  items: ProfileListItem[];
  onClick?: (username: string) => void;
};

const ProfileList = ({ items, onClick }: ProfileListProps) => {
  return (
    <ListContainer>
      {items.map((item) => (
        <ProfileContainer key={item.username}>
          <UserProfileWrapper>
            <UserProfile 
              username={item.username}
              avatarType={item.avatar.avatarType}
              avatarValue={item.avatar.avatarValue}
              information={item.information}
              tags={item.tags}
          />
          </UserProfileWrapper>
        <Button 
          size="small"
          color="system"
          variant="ghost"
          onClick={() => onClick && onClick("add_new")} 
          icon={{ left: <More_Vertical /> }}
        />
        </ProfileContainer>
      ))}
    </ListContainer>
  )
}

export default ProfileList