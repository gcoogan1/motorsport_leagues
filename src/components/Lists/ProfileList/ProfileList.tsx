// import type { Tag } from "@/components/Tags/Tags.variants";
import { useEffect, useRef, useState } from "react";
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

type ListType = "profile" | "squad" | "league";

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
  allowRemoveAction?: boolean;
  listType?: ListType;
};

const ProfileList = ({ items, onClick, allowRemoveAction = false, listType = "profile" }: ProfileListProps) => {
  const viewType = useSelector(selectProfileViewType());
  // Allow remove action if user is owner of the profile (for profile lists) 
  // or allowRemoveAction is explicitly set to true and the list type not profile (e.g. squad followers list where squad founder can remove followers)
  const canRemove = allowRemoveAction || (viewType === "owner" && listType === "profile");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownContainerRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!openDropdown) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent) => {
      const container = dropdownContainerRefs.current[openDropdown];
      const target = event.target as Node;

      if (container && !container.contains(target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [openDropdown]);

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
          <DropdownContainer
            ref={(node) => {
              // Store ref for each dropdown container to handle outside clicks
              dropdownContainerRefs.current[item.id] = node;
            }}
          >
            <Button 
              size="small"
              color="base"
              variant="ghost"
              rounded
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
                  ...(canRemove
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