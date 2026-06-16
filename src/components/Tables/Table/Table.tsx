import type { AvatarVariants } from "@/components/Avatar/Avatar.variants";
import type { Tag } from "@/components/Tags/Tags.variants";
import Row from "./components/Row/Row";
import {
  TableWrapper,
  TableHeader,
  TableTitle,
  TableContent,
  TableContentHeader,
  PositionHeaderRow,
  ParticipantHeaderRow,
  TimeHeaderRow,
  RaceHeaderRow,
  PointsHeaderRow,
  HeaderCell,
  TableRows,
} from "./Table.styles";

type DriverInfo = {
  id: string;
  username: string;
  driverNumber: string;
  avatarType: "preset" | "upload";
  avatarValue: AvatarVariants | string;
  tags?: Tag[];
};

type ResultRow = {
  position: number;
  points: number;
  driver: DriverInfo;
  time?: string;
  races?: number;
  isTeam?: boolean;
  onClick: () => void;
};

type TableProps = {
  title: string;
  isTeam?: boolean;
  results: ResultRow[];
};

const Table= ({ title, isTeam, results }: TableProps) => {
  return (
    <TableWrapper>
      <TableHeader>
        <TableTitle>{title}</TableTitle>
      </TableHeader>
      <TableContent>
        <TableContentHeader>
          <PositionHeaderRow>
            <HeaderCell>P</HeaderCell>
          </PositionHeaderRow>
          <ParticipantHeaderRow>
            <HeaderCell>{isTeam ? "Team" : "Driver"}</HeaderCell>
          </ParticipantHeaderRow>
          {isTeam ? (
            <RaceHeaderRow>
              <HeaderCell>Race</HeaderCell>
            </RaceHeaderRow>
          ) : (
            <TimeHeaderRow>
              <HeaderCell>Time</HeaderCell>
            </TimeHeaderRow>
          )}
          <PointsHeaderRow>
            <HeaderCell>Points</HeaderCell>
          </PointsHeaderRow>
        </TableContentHeader>
        {results.map(({ position, points, driver, time, races, onClick }) => (
          <TableRows key={driver.id}>
            <Row
              position={position}
              points={points}
              driverInfo={driver}
              time={time}
              races={races}
              isTeam={isTeam}
              onClick={onClick}
            />
          </TableRows>
        ))}
      </TableContent>
    </TableWrapper>
  );
};

export default Table;
