import RoundEvent from './components/RoundEvent/RoundEvent';
import RoundHeader from './components/RoundHeader/RoundHeader';
import { RoundContainer, EventsContainer } from './Round.styles'

type EventButton = {
  onClick: () => void;
  isDisabled?: boolean;
};

type RoundCard = {
  eventId: string;
  eventName: string;
  eventDate: string;
  carImageUrls: string[];
  trackName?: string;
  raceTime?: string;
  raceTimeType?: "qualifying" | "race";
  watchButton?: EventButton;
  resultsButton?: EventButton;
  driversButton?: EventButton;
  numberOfDrivers?: number;
  detailsButton?: EventButton;
}

type RoundProps = {
  roundName: string;
  briefingButton?: EventButton;
  reportButton?: EventButton;
  roundCards: RoundCard[];
}

const Round = ({ roundName, briefingButton, reportButton, roundCards }: RoundProps) => {
  return (
    <RoundContainer>
      <RoundHeader roundName={roundName} briefingButton={briefingButton} reportButton={reportButton}/>
      <EventsContainer>
        {roundCards.map((card, index) => (
          <RoundEvent
            key={index}
            eventId={card.eventId}
            eventName={card.eventName}
            eventDate={card.eventDate}
            carImageUrls={card.carImageUrls}
            trackName={card.trackName}
            raceTime={card.raceTime}
            raceTimeType={card.raceTimeType}
            watchButton={card.watchButton}
            resultsButton={card.resultsButton}
            driversButton={card.driversButton}
            detailsButton={card.detailsButton}
          />
        ))}
      </EventsContainer>
    </RoundContainer>
  )
}

export default Round