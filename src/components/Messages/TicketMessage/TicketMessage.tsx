import type { AvatarVariants } from "@/components/Avatar/Avatar.variants";
import type { Tag } from "@/components/Tags/Tags.variants";
import Avatar from "@/components/Avatar/Avatar";
import Tags from "@/components/Tags/Tags";
import Button from "@/components/Button/Button";
import MoreIcon from "@assets/Icon/More_Vertical.svg?react";
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
} from "./TicketMessage.styles";

type TicketMessageProps = {
  type: "Decision" | "Report";
  ticketNum: number;
  seasonName: string;
  eventName: string;
  sessionType: string;
  driverPosition: number;
  createdAt: string;
  driver: {
    username: string;
    avatarType: "preset" | "upload";
    avatarValue: AvatarVariants | string;
    tags?: Tag[];
  };
  incidentTitle?: string;
  decisionSummary?: string;
  reasoning?: string;
  handleMoreClick?: () => void;
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
  driver,
  createdAt,
  incidentTitle,
  decisionSummary,
  reasoning,
  handleMoreClick,
  handleViewClick,
  handleResolveClick,
}: TicketMessageProps) => {
  return (
    <MessageWrapper>
      <Avatar
        size="small"
        avatarType={driver.avatarType}
        avatarValue={driver.avatarValue}
      />
      <MessageContainer>
        <Top>
          <UsernameContainer>
            <Username>{driver.username}</Username>
            {driver.tags && driver.tags.length > 0 && (
              <Tags variants={driver.tags} />
            )}
          </UsernameContainer>
        </Top>
        <Body>
          <Header>
            <TextContainer>
              <TicketNumber>{ticketNum}</TicketNumber>
              <SeasonName>{seasonName}</SeasonName>
            </TextContainer>
            {type === "Decision" ? (
              <Button
                size="small"
                color="base"
                variant="ghost"
                rounded
                icon={{ left: <MoreIcon /> }}
                onClick={handleMoreClick}
              />
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
                <ValueText># {driverPosition} - {driver.username}</ValueText>
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
