// import type { Tag } from "@/components/Tags/Tags.variants";
import { useState } from "react";
import UserProfile from "@/components/Users/Profile/UserProfile";
import Button from "@/components/Button/Button";
import MenuDropdown from "@/components/Dropdowns/MenuDropdown/MenuDropdown";
import More_Vertical from "@assets/Icon/More_Vertical.svg?react";
import ProfileIcon from "@assets/Icon/Profile.svg?react";
import KickIcon from "@assets/Icon/Kick.svg?react";
import { ListContainer, ProfileContainer, UserProfileWrapper, DropdownContainer } from "./ProfileList.styles";
import { selectProfileViewType } from "@/store/profile/profile.selectors";
import { useSelector } from "react-redux";

// TODO: Add Tags back

export type ProfileListItem = {
  id: string;
  label: string;
  avatar: {
    avatarType: "preset" | "upload";
    avatarValue: string;
  };
  secondaryInfo?: string;
  // tags?: Tag[];
}

type ProfileListProps = {
  items: ProfileListItem[];
  onClick?: (id: string, action: "view" | "remove") => void;
};

const ProfileList = ({ items, onClick }: ProfileListProps) => {
  const viewType = useSelector(selectProfileViewType());
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleMenuClick = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleAction = (id: string, action: "view" | "remove") => {
    if (onClick) {
      onClick(id, action);
    }
    setOpenDropdown(null);
  };

  return (
    <ListContainer>
      {items.map((item) => (
        <ProfileContainer key={item.id}>
          <UserProfileWrapper>
            <UserProfile 
              username={item.label}
              avatarType={item.avatar.avatarType}
              avatarValue={item.avatar.avatarValue}
              information={item.secondaryInfo}
              // tags={item.tags}
            />
          </UserProfileWrapper>
          <DropdownContainer>
            <Button 
              size="small"
              color="system"
              variant="ghost"
              onClick={() => handleMenuClick(item.id)} 
              icon={{ left: <More_Vertical /> }}
            />
            {openDropdown === item.id && (
              <MenuDropdown
                type="text"
                isStandAlone={true}
                options={[
                  {
                    label: "View Profile",
                    value: "view",
                    icon: <ProfileIcon />,
                  },
                  ...(viewType === "owner"
                    ? [
                        {
                          label: "Remove User",
                          value: "remove",
                          icon: <KickIcon />,
                        },
                      ]
                    : []),
                ]}
                onSelect={(value) => handleAction(item.id, value as "view" | "remove")}
              />
            )}
          </DropdownContainer>
        </ProfileContainer>
      ))}
    </ListContainer>
  );
};

export default ProfileList;