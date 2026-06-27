import {
  DescriptionText,
  Detail,
  DetailBlockContainer,
  DetailBlocksContainer,
  NumberText,
  TitleText,
} from "../../ChampPoints.styles";

type DetailBlockProps = {
  numOfDivisions: number;
  numOfRounds?: number;
  numOfTeams?: number;
  numOfDrivers?: number;
};

const DetailBlock = ({
  numOfDivisions,
  numOfRounds,
  numOfTeams,
  numOfDrivers,
}: DetailBlockProps) => {
  return (
    <DetailBlocksContainer>
      {numOfDivisions && (
        <DetailBlockContainer>
          <Detail>
            <NumberText>{numOfDivisions}</NumberText>
            <TitleText>Divisions</TitleText>
          </Detail>
          <DescriptionText>
            This season is split into multiple divisions, each with their own
            lineup, schedule and standings.
          </DescriptionText>
        </DetailBlockContainer>
      )}
      {numOfRounds && (
        <DetailBlockContainer>
          <Detail>
            <NumberText>{numOfRounds}</NumberText>
            <TitleText>Rounds</TitleText>
          </Detail>
          <DescriptionText>
            Each division is split into multiple rounds, each with their own
            events.
          </DescriptionText>
        </DetailBlockContainer>
      )}
      {numOfDrivers && (
        <DetailBlockContainer>
          <Detail>
            <NumberText>{numOfDrivers}</NumberText>
            <TitleText>Drivers</TitleText>
          </Detail>
          <DescriptionText>
            Each division has its own lineup of drivers that are available to
            race.
          </DescriptionText>
        </DetailBlockContainer>
      )}
      {numOfTeams && (
        <DetailBlockContainer>
          <Detail>
            <NumberText>{numOfTeams}</NumberText>
            <TitleText>Teams</TitleText>
          </Detail>
          <DescriptionText>
            Each division’s lineup of drivers are placed in multiple teams.
          </DescriptionText>
        </DetailBlockContainer>
      )}
    </DetailBlocksContainer>
  );
};

export default DetailBlock;
