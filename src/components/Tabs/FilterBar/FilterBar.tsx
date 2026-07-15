import SelectButton from "@/components/SelectButton/SelectButton";
import { FilterBarContainer, FilterList, FilterText } from "./FilterBar.styles";

type FilterItem = {
  label: string;
  value: string;
}

type FilterBarProps = {
  divisions: FilterItem[];
  rounds: FilterItem[];
  events: FilterItem[];
  sessions: FilterItem[];
  selectedDivision?: string;
  selectedRound?: string;
  selectedEvent?: string;
  selectedSession?: string;
  onDivisionChange?: (value: string) => void;
  onRoundChange?: (value: string) => void;
  onEventChange?: (value: string) => void;
  onSessionChange?: (value: string) => void;
  text?: string;
  displayAsMobile?: boolean;
}

const FilterBar = ({
  divisions,
  rounds,
  events,
  sessions,
  selectedDivision,
  selectedRound,
  selectedEvent,
  selectedSession,
  onDivisionChange,
  onRoundChange,
  onEventChange,
  onSessionChange,
  text,
  displayAsMobile,
}: FilterBarProps) => {
  return (
    <FilterBarContainer $hasText={!!text} $displayAsMobile={!!displayAsMobile}>
      <FilterList $displayAsMobile={!!displayAsMobile}>
      {divisions.length > 0 && (
        <SelectButton
          label={divisions[0].label}
          value={selectedDivision}
          onChange={onDivisionChange}
          options={divisions}
        />
      )}
      {rounds.length > 0 && (
        <SelectButton
          label={rounds[0].label}
          value={selectedRound}
          onChange={onRoundChange}
          options={rounds}
        />
      )}
      {events.length > 0 && (
        <SelectButton
          label={events[0].label}
          value={selectedEvent}
          onChange={onEventChange}
          options={events}
        />
      )}
      {sessions.length > 0 && (
        <SelectButton
          label={sessions[0].label}
          value={selectedSession}
          onChange={onSessionChange}
          options={sessions}
        />
      )}
      </FilterList>
      {text && <FilterText>{text}</FilterText>}
    </FilterBarContainer>
  )
}

export default FilterBar