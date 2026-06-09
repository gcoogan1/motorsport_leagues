import type { JoinedEventTable } from "@/types/event.types";
import type { RoundTable } from "@/types/round.types";

// -- Round Name Utilities -- //

// This function generates an alphabetic suffix for a given index, 
// where 0 corresponds to "A", 1 to "B", and so on.
const getAlphabeticRoundSuffix = (index: number): string => {
  let value = index;
  let suffix = "";

  do {
    suffix = String.fromCharCode(65 + (value % 26)) + suffix;
    value = Math.floor(value / 26) - 1;
  } while (value >= 0);

  return suffix;
};

// This function extracts the sequence index from a round name.
const getRoundSequenceIndex = (roundName: string): number | null => {
  const match = /^round\s+([a-z]+)$/i.exec(roundName.trim());

  if (!match) {
    return null;
  }

  return match[1]
    .toUpperCase()
    .split("")
    .reduce((total, letter) => total * 26 + (letter.charCodeAt(0) - 64), 0) - 1;
};

// This function generates the next round name based on existing rounds.
export const getNextRoundName = (rounds: RoundTable[]): string => {
  const highestExistingIndex = rounds.reduce((highest, round) => {
    const sequenceIndex = getRoundSequenceIndex(round.round_name);
    return sequenceIndex === null ? highest : Math.max(highest, sequenceIndex);
  }, -1);

  return `Round ${getAlphabeticRoundSuffix(highestExistingIndex + 1)}`;
};

// Keep round ordering stable so renaming does not change display position.
export const sortRounds = (rounds: RoundTable[]): RoundTable[] =>
  [...rounds].sort((left, right) => left.created_at.localeCompare(right.created_at));

// Sort rounds by the date of their most recent event, with rounds without events sorted to the end
export const sortRoundsByMostRecentEventDate = (
  rounds: RoundTable[],
  events: JoinedEventTable[],
): RoundTable[] => {
  //  Group all events by their round_id into a lists-by-round map.
  const eventsByRoundMap = new Map<string, JoinedEventTable[]>();
  
  events.forEach((event) => {
    const list = eventsByRoundMap.get(event.round_id) ?? [];
    list.push(event);
    eventsByRoundMap.set(event.round_id, list);
  });

  // For each round, sort its events using 'sortEventsByDate' logic.
  const roundTargetDateMap = new Map<string, number>();

  eventsByRoundMap.forEach((roundEvents, roundId) => {
    // We sort this specific round's events using the exact same rule as sortEventsByDate.
    const sortedRoundEvents = [...roundEvents].sort((left, right) => {
      if (!left.event_date && !right.event_date) return 0;
      if (!left.event_date) return 1;
      if (!right.event_date) return -1;
      return new Date(left.event_date).getTime() - new Date(right.event_date).getTime();
    });

    // Grab the very first event from the sorted list.
    // Because of how your sort works, this will be the earliest valid calendar date!
    const targetEvent = sortedRoundEvents[0];
    
    if (targetEvent && targetEvent.event_date) {
      roundTargetDateMap.set(roundId, new Date(targetEvent.event_date).getTime());
    }
  });

  // Create a map to remember the original order of the rounds.
  const roundOrderMap = new Map(
    rounds.map((round, index) => [round.id, index]),
  );

  // Sort and return the final rounds copy.
  return [...rounds].sort((left, right) => {
    // Get the sorted event date timestamp for 'left' and 'right' rounds.
    // If a round has no events, we give it a default value of 0.
    const leftDate = roundTargetDateMap.get(left.id) ?? 0;
    const rightDate = roundTargetDateMap.get(right.id) ?? 0;

    // Condition A: If one round has a different event date than the other, sort them.
    if (leftDate !== rightDate) {
      // If both have valid dates, we want the earliest calendar date first.
      if (leftDate !== 0 && rightDate !== 0) {
        return leftDate - rightDate;
      }
      // If one has no events (0), push the one with no events to the very bottom.
      return leftDate === 0 ? 1 : -1;
    }

    // Condition B: If dates match or both rounds have no events, keep original fallback order.
    return (
      (roundOrderMap.get(left.id) ?? 0) - (roundOrderMap.get(right.id) ?? 0)
    );
  });
};


// -- Event Name Utilities -- //

// This function extracts the sequence index from an event name.
const getEventSequenceIndex = (eventName: string): number | null => {
  const match = /^event\s+(\d+)$/i.exec(eventName.trim());

  if (!match) {
    return null;
  }

  return Number(match[1]);
};

// This function generates the next event name based on existing events.
export const getNextEventName = (events: JoinedEventTable[]): string => {
  const highestExistingIndex = events.reduce((highest, event) => {
    const sequenceIndex = getEventSequenceIndex(event.event_name);
    return sequenceIndex === null ? highest : Math.max(highest, sequenceIndex);
  }, 0);

  return `Event ${highestExistingIndex + 1}`;
};

// Keep event ordering stable so renaming does not change display position.
export const sortEvents = (events: JoinedEventTable[]): JoinedEventTable[] =>
  [...events].sort((left, right) => left.created_at.localeCompare(right.created_at));

// Sort event by thier event date, with events without a date sorted to the end
export const sortEventsByDate = (events: JoinedEventTable[]): JoinedEventTable[] =>
  [...events].sort((left, right) => {
    if (!left.event_date && !right.event_date) {
      return 0;
    }
    if (!left.event_date) {
      return 1;
    }
    if (!right.event_date) {
      return -1;
    }
    return new Date(left.event_date).getTime() - new Date(right.event_date).getTime();
  });