import { useState, useRef, useEffect } from "react";
import type { AvatarVariants } from "@/components/Avatar/Avatar.variants";
import type { Tag } from "@/components/Tags/Tags.variants";
import Tags from "@/components/Tags/Tags";
import Avatar from "@/components/Avatar/Avatar";
import MenuDropdown from "@/components/Dropdowns/MenuDropdown/MenuDropdown";
import Button from "@/components/Button/Button";
import MoreIcon from "@assets/Icon/More_Vertical.svg?react";
import EditIcon from "@assets/Icon/Edit.svg?react";
import DeleteIcon from "@assets/Icon/Delete.svg?react";
import {
Body,
  Bottom,
  Header,
  Message,
  MessageContainer,
  MessageText,
  MessageWrapper,
  MoreMenuContainer,
  SeasonName,
  TextContainer,
  TimestampText,
  Title,
  Top,
  Username,
  UsernameContainer,
} from "./Announcement.styles";

type AnnouncementProps = {
  isPinned: boolean;
  posterInfo?: {
    username: string;
    avatarType: "preset" | "upload";
    avatarValue: AvatarVariants | string;
    tags?: Tag[];
  };
  title: string;
  seasonName: string;
  message: string;
  createdAt: string;
  handleMoreClick?: () => void;
  handleEditClick?: () => void;
  handleDeleteClick?: () => void;
};

const Announcement = ({
  isPinned,
  posterInfo,
  title,
  seasonName,
  message,
  createdAt,
  handleMoreClick,
  handleEditClick,
  handleDeleteClick,
}: AnnouncementProps) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isMoreOpen) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (moreMenuRef.current && !moreMenuRef.current.contains(target)) {
        setIsMoreOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isMoreOpen]);

  const handleMoreMenuToggle = () => {
    handleMoreClick?.();
    setIsMoreOpen((prev) => !prev);
  };

  const handleMoreAction = (value: string) => {
    if (value === "edit") {
      handleEditClick?.();
    }

    if (value === "delete") {
      handleDeleteClick?.();
    }

    setIsMoreOpen(false);
  };

  return (
    <MessageWrapper>
      <Avatar
        size="small"
        avatarType={posterInfo?.avatarType || "preset"}
        avatarValue={posterInfo?.avatarValue || "black"}
      />
      <MessageContainer>
        <Top>
          <UsernameContainer>
            <Username>{posterInfo?.username || "Unknown"}</Username>
            {posterInfo?.tags && posterInfo.tags.length > 0 && (
              <Tags variants={posterInfo.tags} />
            )}
          </UsernameContainer>
        </Top>
        <Body>
          <Header isPinned={isPinned}>
            <TextContainer>
              <Title>{title}</Title>
              <SeasonName>{seasonName}</SeasonName>
            </TextContainer>
            <MoreMenuContainer ref={moreMenuRef}>
              <Button
                size="small"
                color="base"
                variant="ghost"
                rounded
                icon={{ left: <MoreIcon /> }}
                onClick={handleMoreMenuToggle}
              />
              {isMoreOpen && (
                <MenuDropdown
                  type="text"
                  isStandAlone={true}
                  options={[
                    {
                      label: "Edit Announcement",
                      value: "edit",
                      icon: <EditIcon />,
                    },
                    {
                      label: "Delete Announcement",
                      value: "delete",
                      icon: <DeleteIcon />,
                    },
                  ]}
                  onSelect={handleMoreAction}
                />
              )}
            </MoreMenuContainer>
          </Header>
          <Message><MessageText>{message}</MessageText></Message>
        </Body>
        <Bottom>
          <TimestampText>{createdAt}</TimestampText>
        </Bottom>
      </MessageContainer>
    </MessageWrapper>
  );
};

export default Announcement;
