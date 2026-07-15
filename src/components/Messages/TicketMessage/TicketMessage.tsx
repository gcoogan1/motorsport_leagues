import { useEffect, useRef, useState } from "react";
import type { AvatarVariants } from "@/components/Avatar/Avatar.variants";
import type { Tag } from "@/components/Tags/Tags.variants";
import Avatar from "@/components/Avatar/Avatar";
import Tags from "@/components/Tags/Tags";
import Button from "@/components/Button/Button";
import MenuDropdown from "@/components/Dropdowns/MenuDropdown/MenuDropdown";
import MoreIcon from "@assets/Icon/More_Vertical.svg?react";
import EditIcon from "@assets/Icon/Edit.svg?react";
import DeleteIcon from "@assets/Icon/Delete.svg?react";
import {
  Body,
  Bottom,
  Buttons,
  Header,
  KeyItem,
  KeyText,
  Message,
  MessageContainer,
  MessageWrapper,
  Pair,
  SeasonName,
  TextContainer,
  TicketNumber,
  TimestampText,
  Top,
  Username,
  UsernameContainer,
  ValueItem,
  ValueText,
  MoreMenuContainer,
} from "./TicketMessage.styles";

type TicketMessageProps = {
  type: "Decision" | "Report";
  ticketNum: number;
  seasonName: string;
  eventName: string;
  sessionType: string;
  driverPosition: number;
  createdAt: string;
  isStewardOrDirector: boolean;
  reportingDriver?: {
    username: string;
    avatarType: "preset" | "upload";
    avatarValue: AvatarVariants | string;
    tags?: Tag[];
  };
  offendingDriver?: {
    username: string;
    avatarType: "preset" | "upload";
    avatarValue: AvatarVariants | string;
    tags?: Tag[];
  };
  incidentTitle?: string;
  decisionSummary?: string;
  reasoning?: string;
  handleMoreClick?: () => void;
  handleEditClick?: () => void;
  handleDeleteClick?: () => void;
  handleViewClick?: () => void;
  handleResolveClick?: () => void;
};

const TicketMessage = ({
  type,
  ticketNum,
  seasonName,
  eventName,
  sessionType,
  driverPosition,
  reportingDriver,
  offendingDriver,
  createdAt,
  isStewardOrDirector,
  incidentTitle,
  decisionSummary,
  reasoning,
  handleMoreClick,
  handleEditClick,
  handleDeleteClick,
  handleViewClick,
  handleResolveClick,
}: TicketMessageProps) => {
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
        avatarType={reportingDriver?.avatarType || "preset"}
        avatarValue={reportingDriver?.avatarValue || "black"}
      />
      <MessageContainer>
        <Top>
          <UsernameContainer>
            <Username>{reportingDriver?.username || "Unknown"}</Username>
            {reportingDriver?.tags && reportingDriver.tags.length > 0 && (
              <Tags variants={reportingDriver.tags} />
            )}
          </UsernameContainer>
        </Top>
        <Body>
          <Header>
            <TextContainer>
              <TicketNumber>Ticket #{ticketNum}</TicketNumber>
              <SeasonName>{seasonName}</SeasonName>
            </TextContainer>
            {type === "Decision" ? (
              isStewardOrDirector && (
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
                          label: "Edit Decision",
                          value: "edit",
                          icon: <EditIcon />,
                        },
                        {
                          label: "Delete Decision",
                          value: "delete",
                          icon: <DeleteIcon />,
                        },
                      ]}
                      onSelect={handleMoreAction}
                    />
                  )}
                </MoreMenuContainer>
              )
            ) : (
              <Buttons>
                <Button
                  size="small"
                  color="base"
                  rounded
                  onClick={handleViewClick}
                >
                  View
                </Button>
                <Button
                  size="small"
                  color="base"
                  rounded
                  onClick={handleResolveClick}
                >
                  Resolve
                </Button>
              </Buttons>
            )}
          </Header>
          <Message>
            <Pair>
              <KeyItem>
                <KeyText>Event</KeyText>
              </KeyItem>
              <ValueItem>
                <ValueText>{eventName}</ValueText>
              </ValueItem>
            </Pair>
            <Pair>
              <KeyItem>
                <KeyText>Session</KeyText>
              </KeyItem>
              <ValueItem>
                <ValueText>{sessionType}</ValueText>
              </ValueItem>
            </Pair>
            <Pair>
              <KeyItem>
                <KeyText>Driver</KeyText>
              </KeyItem>
              <ValueItem>
                <ValueText># {driverPosition} - {offendingDriver?.username}</ValueText>
              </ValueItem>
            </Pair>
            {type == "Decision" && (
              <>
                <Pair>
                  <KeyItem>
                    <KeyText>Incident</KeyText>
                  </KeyItem>
                  <ValueItem>
                    <ValueText>{incidentTitle}</ValueText>
                  </ValueItem>
                </Pair>
                <Pair>
                  <KeyItem>
                    <KeyText>Decision</KeyText>
                  </KeyItem>
                  <ValueItem>
                    <ValueText>{decisionSummary}</ValueText>
                  </ValueItem>
                </Pair>
                <Pair>
                  <KeyItem>
                    <KeyText>Reason</KeyText>
                  </KeyItem>
                  <ValueItem>
                    <ValueText>{reasoning}</ValueText>
                  </ValueItem>
                </Pair>
              </>
            )}
          </Message>
        </Body>
        <Bottom>
          <TimestampText>{createdAt}</TimestampText>
        </Bottom>
      </MessageContainer>
    </MessageWrapper>
  );
};

export default TicketMessage;
