import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import type { Tag } from "@/components/Tags/Tags.variants";
import type { RootState } from "@/store";
import UserProfile from "@/components/Users/Profile/UserProfile";
import Button from "@/components/Button/Button";
import MenuDropdown from "@/components/Dropdowns/MenuDropdown/MenuDropdown";
import More_Vertical from "@assets/Icon/More_Vertical.svg?react";
import ProfileIcon from "@assets/Icon/Profile.svg?react";
import KickIcon from "@assets/Icon/Kick.svg?react";
import RoleIcon from "@assets/Icon/Role.svg?react";
import {
  ListContainer,
  ProfileContainer,
  UserProfileWrapper,
  DropdownContainer,
} from "./ProfileList.styles";

// TODO: Add Tags back

export type ProfileAction = "view" | "remove" | "changeRole";

type ListType = "profile" | "squad" | "league";

export type ProfileListItem = {
  id: string;
  label: string;
  avatar: {
    avatarType: "preset" | "upload";
    avatarValue: string;
  };
  secondaryInfo?: string;
  tags?: Tag[];
};

type ProfileListProps = {
  items: ProfileListItem[];
  onClick?: (id: string, action: ProfileAction) => void;
  allowRemoveAction?: boolean;
  allowChangeRoleAction?: boolean;
  removeType?: "member" | "user" | 'follower';
  listType?: ListType;
};

const ProfileList = ({
  items,
  onClick,
  allowRemoveAction = false,
  allowChangeRoleAction = false,
  removeType = "user",
  listType = "profile",
}: ProfileListProps) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const profiles = useSelector((state: RootState) => state.profile.data);
  const dropdownContainerRefs = useRef<Record<string, HTMLDivElement | null>>(
    {},
  );

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

  // For squad member lists, we want to show founders first, then by alphabetical order
  const sortItemsByFounder = (items: ProfileListItem[]) => {
    if (listType === "squad") {
      return items.sort((a, b) => {
        const aIsFounder = a.tags?.includes("founder") ?? false;
        const bIsFounder = b.tags?.includes("founder") ?? false;

        if (aIsFounder && !bIsFounder) {
          return -1;
        } else if (!aIsFounder && bIsFounder) {
          return 1;
        } else {
          return a.label.localeCompare(b.label);
        }
      });
    }

    // For other lists, sort by alphabetical order
    return items.sort((a, b) => a.label.localeCompare(b.label));
  };

  const formatedItems = sortItemsByFounder(items);

  const isYourProfile = (profileId: string) => {
    return profiles?.some((profile) => profile.id === profileId);
  };

  // -- Handlers-- //

  const handleMenuClick = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleAction = (
    id: string,
    action: "view" | "remove" | "changeRole",
  ) => {
    if (onClick) {
      onClick(id, action);
    }
    setOpenDropdown(null);
  };

  return (
    <ListContainer>
      {formatedItems.map((item) => (
        <ProfileContainer key={item.id}>
          <UserProfileWrapper>
            <UserProfile
              username={item.label}
              avatarType={item.avatar.avatarType}
              avatarValue={item.avatar.avatarValue}
              information={item.secondaryInfo}
              tags={item.tags}
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
                  ...(allowChangeRoleAction && !isYourProfile(item.id)
                    ? [
                        {
                          label: "Change Role",
                          value: "changeRole",
                          icon: <RoleIcon />,
                        },
                      ]
                    : []),
                  ...(allowRemoveAction && !isYourProfile(item.id)
                    ? [
                        {
                          label: `Remove ${removeType}`,
                          value: "remove",
                          icon: <KickIcon />,
                        },
                      ]
                    : []),
                ]}
                onSelect={(value) =>
                  handleAction(
                    item.id,
                    value as "view" | "remove" | "changeRole",
                  )
                }
              />
            )}
          </DropdownContainer>
        </ProfileContainer>
      ))}
    </ListContainer>
  );
};

export default ProfileList;
