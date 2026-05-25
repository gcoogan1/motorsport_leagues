import type { EventTable } from "@/types/event.types";
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

// This function sorts rounds based on their sequence index and creation date.
export const sortRounds = (rounds: RoundTable[]): RoundTable[] =>
  [...rounds].sort((left, right) => {
    const leftSequence = getRoundSequenceIndex(left.round_name);
    const rightSequence = getRoundSequenceIndex(right.round_name);

    if (
      leftSequence !== null &&
      rightSequence !== null &&
      leftSequence !== rightSequence
    ) {
      return leftSequence - rightSequence;
    }

    if (leftSequence !== null && rightSequence === null) {
      return -1;
    }

    if (leftSequence === null && rightSequence !== null) {
      return 1;
    }

    return left.created_at.localeCompare(right.created_at);
});

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
export const getNextEventName = (events: EventTable[]): string => {
  const highestExistingIndex = events.reduce((highest, event) => {
    const sequenceIndex = getEventSequenceIndex(event.event_name);
    return sequenceIndex === null ? highest : Math.max(highest, sequenceIndex);
  }, 0);

  return `Event ${highestExistingIndex + 1}`;
};

// This function sorts events based on their sequence index, event date, and creation date.
export const sortEvents = (events: EventTable[]): EventTable[] =>
  [...events].sort((left, right) => {
    const leftSequence = getEventSequenceIndex(left.event_name);
    const rightSequence = getEventSequenceIndex(right.event_name);

    if (
      leftSequence !== null &&
      rightSequence !== null &&
      leftSequence !== rightSequence
    ) {
      return leftSequence - rightSequence;
    }

    if (leftSequence !== null && rightSequence === null) {
      return -1;
    }

    if (leftSequence === null && rightSequence !== null) {
      return 1;
    }

    if (left.event_date !== right.event_date) {
      return left.event_date.localeCompare(right.event_date);
    }

    return left.created_at.localeCompare(right.created_at);
  });