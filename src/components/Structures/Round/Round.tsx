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
  cars?: {
    imageUrl: string;
    label: string;
    category?: string;
    carSelection?: string;
  }[];
  revealCars?: boolean;
  trackName?: string;
  hasQualifying?: boolean;
  qualifyingType?: "time" | "laps";
  qualifyingTimeLap?: string | number;
  hasRace?: boolean;
  raceType?: "time" | "laps";
  raceTimeLap?: string | number;
  watchButton?: EventButton;
  resultsButton?: EventButton;
  driversButton?: EventButton;
  numberOfDrivers?: number;
  detailsButton?: EventButton;
  revealDetails?: boolean;
  revealBroadcast?: boolean;
  revealSession?: boolean;
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
        {roundCards.map((card) => (
          <RoundEvent
            key={card.eventId}
            eventId={card.eventId}
            eventName={card.eventName}
            eventDate={card.eventDate}
            carImageUrls={card.carImageUrls}
            cars={card.cars}
            trackName={card.trackName}
            hasQualifying={card.hasQualifying}
            qualifyingType={card.qualifyingType}
            qualifyingTimeLap={card.qualifyingTimeLap}
            hasRace={card.hasRace}
            raceType={card.raceType}
            raceTimeLap={card.raceTimeLap}
            watchButton={card.watchButton}
            resultsButton={card.resultsButton}
            driversButton={card.driversButton}
            detailsButton={card.detailsButton}
            revealDetails={card.revealDetails}
            revealCars={card.revealCars}
            revealBroadcast={card.revealBroadcast}
            revealSession={card.revealSession}
          />
        ))}
      </EventsContainer>
    </RoundContainer>
  )
}

export default Round