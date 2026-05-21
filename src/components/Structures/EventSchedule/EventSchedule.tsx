import Button from "@/components/Button/Button";
import ProfileIcon from "@assets/Icon/Profile.svg?react";
import MoreVerticalIcon from "@assets/Icon/More_Vertical.svg?react";
import {
  Container,
  TextContainer,
  Title,
  Subtitle,
  ButtonsContainer,
} from "./EventSchedule.styles";

type EventScheduleProps = {
  title: string;
  subtitle: string;
  numOfDrivers: number;
  onProfileClick?: () => void;
  onMoreClick?: () => void;
};

const EventSchedule = ({
  title,
  subtitle,
  numOfDrivers,
  onProfileClick,
  onMoreClick,
}: EventScheduleProps) => {
  return (
    <Container>
      <TextContainer>
        <Title>{title}</Title>
        <Subtitle>{subtitle}</Subtitle>
      </TextContainer>
      <ButtonsContainer>
        <Button size="small" color="base" rounded icon={{ left: <ProfileIcon /> }} onClick={onProfileClick}>
          {numOfDrivers}
        </Button>
        <Button
          size="small"
          color="base"
          icon={{ left: <MoreVerticalIcon /> }}
          onClick={onMoreClick}
          rounded
        ></Button>
      </ButtonsContainer>
    </Container>
  );
};

export default EventSchedule;
