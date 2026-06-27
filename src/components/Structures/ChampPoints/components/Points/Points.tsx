import {
  Headers,
  HeaderText,
  RowContent,
  RowText,
  TableBody,
  TableContainer,
  TableHeader,
  TableRow,
} from "../../ChampPoints.styles";

type PointsProps = {
  stats: {
    position: number;
    points: string;
  }[];
};

const Points = ({ stats }: PointsProps) => {
  return (
    <TableContainer>
      <TableHeader>
        <Headers>
          <HeaderText>Position</HeaderText>
        </Headers>
        <Headers>
          <HeaderText>Points</HeaderText>
        </Headers>
      </TableHeader>
      <TableBody>
        {stats.map(({ position, points }, index) => (
          <TableRow key={index}>
            <RowContent>
              <RowText>{position}</RowText>
            </RowContent>
            <RowContent>
              <RowText>{points}</RowText>
            </RowContent>
          </TableRow>
        ))}
      </TableBody>
    </TableContainer>
  );
};

export default Points;