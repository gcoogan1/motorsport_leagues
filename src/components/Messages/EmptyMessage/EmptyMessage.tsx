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
import { cloneElement, isValidElement } from "react";

type EmptyMessageProps = {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  primaryButton?: React.ReactElement<{ fullWidth?: boolean }>;
  secondaryButton?: React.ReactElement<{ fullWidth?: boolean }>;
};

function EmptyMessage({
  title = "Empty Section",
  subtitle = "This section is currently empty!",
  icon,
  primaryButton,
  secondaryButton,
}: EmptyMessageProps) {

  // Forces buttons to be full width for consistent layout
  const forceFullWidth = (
    button?: React.ReactElement<{ fullWidth?: boolean }>
  ) => {
    if (!button || !isValidElement(button)) return button;

    return cloneElement(button, {
      fullWidth: true,
    } as Partial<{ fullWidth?: boolean }>);
  };

  return (
    <MessageContainer>
      <GraphicContainer>
        <IconWrapper>{icon ?? <EmptyIcon />}</IconWrapper>
      </GraphicContainer>
      <TextContainer>
        <Title>{title}</Title>
        <Subtitle>{subtitle}</Subtitle>
      </TextContainer>
        <ActionsContainer>
          {forceFullWidth(primaryButton)}
          {forceFullWidth(secondaryButton)}
        </ActionsContainer>
    </MessageContainer>
  );
}

export default EmptyMessage;
