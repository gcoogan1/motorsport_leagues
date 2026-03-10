import Button from "@/components/Button/Button";
import { ActionContainer, AvatarWrapper, CardContainer, Content, Message, TextContainer, Timestamp, Title, TopRow } from "./NotificationCard.styles";
import type { ButtonColor, ButtonVariant } from "@/components/Button/Button.variants";
import Avatar from "@/components/Avatar/Avatar";
import type React from "react";

type NotificationCardProps = {
  avatar: { avatarType: "preset" | "upload"; avatarValue: string; };
  title: string;
  message: React.ReactNode;
  time: string;
  buttons?: {
    left?: {
      label: string;
      action?: () => void;
      color?: ButtonColor;
      variant?: ButtonVariant;
      leftIcon?: React.ReactNode;
      rightIcon?: React.ReactNode;
      loading?: boolean;
      loadingText?: string;
    };
    middle?: {
      label: string;
      action?: () => void;
      color?: ButtonColor;
      variant?: ButtonVariant;
      leftIcon?: React.ReactNode;
      rightIcon?: React.ReactNode;
      loading?: boolean;
      loadingText?: string;
    };
    right?: {
      label: string;
      action?: () => void;
      color?: ButtonColor;
      variant?: ButtonVariant;
      leftIcon?: React.ReactNode;
      rightIcon?: React.ReactNode;
      loading?: boolean;
      loadingText?: string;
      isDanger?: boolean;
    };
  };
}

const NotificationCard = ({ avatar, title, message, time, buttons }: NotificationCardProps) => {
  return (
    <CardContainer>
      <Content>
        <AvatarWrapper>
          <Avatar avatarType={avatar.avatarType} avatarValue={avatar.avatarValue} size="medium" />
        </AvatarWrapper>
        <TextContainer>
        <TopRow>
          <Title>{title}</Title>
          <Timestamp>{time}</Timestamp>
        </TopRow>
          <Message>{message}</Message>
        </TextContainer>
      </Content>
      <ActionContainer>
        {buttons?.left && (
          <Button 
            size="small"
            rounded
            variant={buttons.left.variant || "filled"}
            color={buttons.left.color || "system"}
            onClick={buttons.left.action}
            icon={{ left: buttons.left.leftIcon, right: buttons.left.rightIcon }}
            isLoading={buttons.left.loading}
            loadingText={buttons.left.loadingText}
          >
            {buttons.left.label}
          </Button>
        )}
        {buttons?.middle && (
          <Button 
              size="small"
            rounded
            variant={buttons.middle.variant || "filled"}
            color={buttons.middle.color || "system"}
            onClick={buttons.middle.action}
            icon={{ left: buttons.middle.leftIcon, right: buttons.middle.rightIcon }}
            isLoading={buttons.middle.loading}
            loadingText={buttons.middle.loadingText}
          >
            {buttons.middle.label}
          </Button>
        )}
        {buttons?.right && (
          <Button 
              size="small"
            rounded
            variant={buttons.right.variant || "filled"}
            color={buttons.right.color || "system"}
            onClick={buttons.right.action}
            icon={{ left: buttons.right.leftIcon, right: buttons.right.rightIcon }}
            isLoading={buttons.right.loading}
            loadingText={buttons.right.loadingText}
          >
            {buttons.right.label}
          </Button>
        )}
      </ActionContainer>
    </CardContainer>
  )
}

export default NotificationCard