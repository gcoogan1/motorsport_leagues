import Button from "@/components/Button/Button";
import RoundCar from "../RoundCar/RoundCar";
import PlaceholderImage from "@assets/Cars/Hidden.png";
import TimerIcon from "@assets/Icon/Timer.svg?react";
import LapsIcon from "@assets/Icon/Laps.svg?react";
import BroadcastIcon from "@assets/Icon/Broadcast.svg?react";
import ProfileIcon from "@assets/Icon/Profile.svg?react";
import ResultsIcon from "@assets/Icon/Results.svg?react";
import DetailsIcon from "@assets/Icon/Details.svg?react";
import Icon from "@/components/Icon/Icon";
import {
  EventContainer,
  TextContainer,
  EventName,
  EventDate,
  TrackName,
  DetailsContainer,
  AboutContainer,
  AboutTextContainer,
  SessionsContainer,
  SessionContainer,
  ButtonsContainer,
  RaceTime,
} from "./RoundEvent.styles";
import { useEventDrivers } from "@/rtkQuery/hooks/queries/useEvents";

type EventButton = {
  onClick: () => void;
  isDisabled?: boolean;
};

type RoundEventProps = {
  eventId: string;
  eventName: string;
  eventDate: string;
  carImageUrls: string[];
  cars?: {
    imageUrl: string;
    label: string;
  }[];
  trackName?: string;
  revealCars?: boolean;
  raceTime?: string;
  raceTimeType?: "qualifying" | "race";
  watchButton?: EventButton;
  resultsButton?: EventButton;
  driversButton?: EventButton;
  detailsButton?: EventButton;
  revealDetails?: boolean;
};

const RoundEvent = ({
  eventId,
  eventName,
  eventDate,
  carImageUrls,
  cars,
  trackName,
  revealCars = false,
  watchButton,
  resultsButton,
  driversButton,
  detailsButton,
  raceTime,
  raceTimeType,
  revealDetails,
}: RoundEventProps) => {

  const { data: drivers } = useEventDrivers(eventId);

  const resolvedCars =
    cars && cars.length > 0
      ? cars
      : carImageUrls.length > 0
      ? carImageUrls.map((imageUrl) => ({
          imageUrl: imageUrl || PlaceholderImage,
          label: "Assigned Car",
        }))
      : [{ imageUrl: PlaceholderImage, label: "STOCK · Hidden" }];


  return (
    <EventContainer>
      <TextContainer>
        <DetailsContainer>
          <AboutContainer>
            <EventName>{eventName}</EventName>
            <EventDate>{eventDate}</EventDate>
          </AboutContainer>
          <TrackName>{trackName ?? "Hidden track"}</TrackName>
          <SessionsContainer>
            {raceTime && (
              <SessionContainer>
                <Icon size="medium">
                  {raceTimeType === "qualifying" ? <TimerIcon /> : <LapsIcon />}
                </Icon>
                <AboutTextContainer>
                  <RaceTime>{raceTime}</RaceTime>
                </AboutTextContainer>
              </SessionContainer>
            )}
          </SessionsContainer>
        </DetailsContainer>
        <ButtonsContainer>
          {watchButton && (
            <Button
              onClick={watchButton.onClick}
              color="primary"
              variant="ghost"
              icon={{ left: <BroadcastIcon /> }}
            >
              Watch
            </Button>
          )}
          {driversButton && (
            <Button
              onClick={driversButton.onClick}
              color="primary"
              variant="ghost"
              icon={{ left: <ProfileIcon /> }}
            >
              {drivers?.length ?? 0} Drivers
            </Button>
          )}
          {resultsButton && (
            <Button
              onClick={resultsButton.onClick}
              color="base"
              variant="filled"
              icon={{ left: <ResultsIcon /> }}
            >
              Results
            </Button>
          )}
          {detailsButton && revealDetails && (
            <Button
              onClick={detailsButton.onClick}
              color="base"
              variant="filled"
              icon={{ left: <DetailsIcon /> }}
            >
              Details
            </Button>
          )}
        </ButtonsContainer>
      </TextContainer>
      <RoundCar cars={resolvedCars} revealCars={revealCars} />
    </EventContainer>
  );
};

export default RoundEvent;
