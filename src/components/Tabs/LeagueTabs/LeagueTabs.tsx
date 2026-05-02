import SelectButton from "@/components/SelectButton/SelectButton"
import Tabs from "../Tabs/Tabs"
import { TabsContainer } from "./LeagueTabs.styles"

export type Season = {
  value: string;
  label: string;
}

export type LeagueTabs = { 
  id: string
  label: string
}

type LeagueTabsProps = {
  seasons: Season[];
  activeSeason: string;
  onSeasonChange: (seasonValue: string) => void;
  leagues: LeagueTabs[];
  activeLeague?: string;
  onLeagueChange?: (leagueId: string) => void;
}

const LeagueTabs = ({ seasons, activeSeason, onSeasonChange, leagues, activeLeague, onLeagueChange }: LeagueTabsProps) => {
  return (
    <TabsContainer>
      <Tabs tabs={leagues} activeTab={activeLeague} onTabChange={onLeagueChange} />
      <SelectButton options={seasons} value={activeSeason} onChange={onSeasonChange} />
    </TabsContainer>
  )
}

export default LeagueTabs