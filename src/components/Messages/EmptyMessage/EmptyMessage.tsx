import Button from "@/components/Button/Button";
import EmptyIcon from "@assets/Icon/Empty.svg?react";
import {
  ActionsContainer,
  GraphicContainer,
  IconWrapper,
  MessageContainer,
  Subtitle,
  TextContainer,
  Title,
} from "./EmptyMessage.styles";

type EmptyMessageProps = {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actions?: {
    primary?: {
      onClick: () => void;
      label: string;
      rightIcon?: React.ReactNode;
      leftIcon?: React.ReactNode;
    };
    secondary?: {
      onClick: () => void;
      label: string;
      icon?: React.ReactNode;
      rightIcon?: React.ReactNode;
      leftIcon?: React.ReactNode;
    };
  };
};

function EmptyMessage({
  title = "Empty Section",
  subtitle = "This section is currently empty!",
  icon,
  actions,
}: EmptyMessageProps) {
  return (
    <MessageContainer>
      <GraphicContainer>
        <IconWrapper>{icon ?? <EmptyIcon />}</IconWrapper>
      </GraphicContainer>
      <TextContainer>
        <Title>{title}</Title>
        <Subtitle>{subtitle}</Subtitle>
      </TextContainer>
      {actions?.primary && (
        <ActionsContainer>
          <Button
            color="base"
            onClick={actions.primary.onClick}
            icon={{
              right: actions.primary.rightIcon,
              left: actions.primary.leftIcon,
            }}
          >
            {actions.primary.label}
          </Button>
        </ActionsContainer>
      )}
      {actions?.secondary && (
        <ActionsContainer>
          <Button
            color="base"
            variant="outlined"
            onClick={actions.secondary.onClick}
            icon={{
              right: actions.secondary.rightIcon,
              left: actions.secondary.leftIcon,
            }}
          >
            {actions.secondary.label}
          </Button>
        </ActionsContainer>
      )}
    </MessageContainer>
  );
}

export default EmptyMessage;
