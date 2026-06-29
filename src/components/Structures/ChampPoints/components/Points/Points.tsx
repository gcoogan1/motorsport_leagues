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

const toOrdinal = (position: number): string => {
  const remainder100 = position % 100;

  if (remainder100 >= 11 && remainder100 <= 13) {
    return `${position}th`;
  }

  const remainder10 = position % 10;

  if (remainder10 === 1) return `${position}st`;
  if (remainder10 === 2) return `${position}nd`;
  if (remainder10 === 3) return `${position}rd`;

  return `${position}th`;
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
              <RowText>{toOrdinal(position)}</RowText>
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