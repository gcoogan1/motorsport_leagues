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
  text?: string;
}

const FilterBar = ({ divisions, rounds, events, sessions, text }: FilterBarProps) => {
  return (
    <FilterBarContainer $hasText={!!text}>
      <FilterList>
      {divisions.length > 0 && (<SelectButton label={divisions[0].label} options={divisions} />)}
      {rounds.length > 0 && (<SelectButton label={rounds[0].label} options={rounds} />)}
      {events.length > 0 && (<SelectButton label={events[0].label} options={events} />)}
      {sessions.length > 0 && (<SelectButton label={sessions[0].label} options={sessions} />)}
      </FilterList>
      {text && <FilterText>{text}</FilterText>}
    </FilterBarContainer>
  )
}

export default FilterBar