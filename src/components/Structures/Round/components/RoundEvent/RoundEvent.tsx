import Button from "@/components/Button/Button";
import RoundCar from "../RoundCar/RoundCar";
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

type EventButton = {
  onClick: () => void;
  isDisabled?: boolean;
};

type RoundEventProps = {
  eventName: string;
  eventDate: string;
  carImageUrls: string[];
  trackName?: string;
  raceTime?: string;
  raceTimeType?: "qualifying" | "race";
  watchButton?: EventButton;
  resultsButton?: EventButton;
  driversButton?: EventButton;
  detailsButton?: EventButton;
};

const RoundEvent = ({
  eventName,
  eventDate,
  carImageUrls,
  trackName = "Unknown Track",
  watchButton,
  resultsButton,
  driversButton,
  detailsButton,
  raceTime,
  raceTimeType,
}: RoundEventProps) => {
  return (
    <EventContainer>
      <TextContainer>
        <DetailsContainer>
          <AboutContainer>
            <EventName>{eventName}</EventName>
            <EventDate>{eventDate}</EventDate>
          </AboutContainer>
          <TrackName>{trackName}</TrackName>
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
              Drivers
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
          {detailsButton && (
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
      <RoundCar imageUrls={carImageUrls} />
    </EventContainer>
  );
};

export default RoundEvent;
