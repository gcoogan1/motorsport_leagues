import DetailBlock from './components/DetailBlock/DetailBlock';
import Points from './components/Points/Points';
import { ChampPointsContainer } from './ChampPoints.styles'

type ChampPointsProps = {
  stats: {
    position: number;
    points: string;
  }[];
  numOfDivisions: number;
  numOfRounds?: number;
  numOfTeams?: number;
  numOfDrivers?: number;
};

const ChampPoints = ({ stats, numOfDivisions, numOfRounds, numOfTeams, numOfDrivers }: ChampPointsProps) => {
  return (
    <ChampPointsContainer>
      <DetailBlock
        numOfDivisions={numOfDivisions}
        numOfRounds={numOfRounds}
        numOfTeams={numOfTeams}
        numOfDrivers={numOfDrivers}
      />
      <Points stats={stats} />
    </ChampPointsContainer>
  )
}

export default ChampPoints
