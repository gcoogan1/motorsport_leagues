import { useEffect, useRef } from "react";
import type { AvatarVariants } from "@/components/Avatar/Avatar.variants";
import type { Tag } from "@/components/Tags/Tags.variants";
import Row from "./components/Row/Row";
import {
  TableWrapper,
  TableInner,
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
  avatarType: "preset" | "upload";
  avatarValue: AvatarVariants | string;
  tags?: Tag[];
  teamName?: string;
};

export type RoundInfo = {
  roundName: string;
  trackName: string;
};

type ResultRow = {
  position?: number;
  points: number;
  driver: DriverInfo;
  time?: string;
  type: "driver" | "team";
  races?: number;
  roundInfo?: RoundInfo;
  onClick: () => void;
};

type TableProps = {
  title: string;
  results: ResultRow[];
  metricLabel?: string;
  resultPerRound?: boolean;
  hidePoints?: boolean;
};

const Table= ({
  title,
  results,
  metricLabel,
  resultPerRound,
  hidePoints = false,
}: TableProps) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Used to center the table horizontally when it overflows the container
  useEffect(() => {
    const centerHorizontalScroll = () => {
      const node = wrapperRef.current;

      if (!node) {
        return;
      }

      const hasOverflow = node.scrollWidth > node.clientWidth;
      node.scrollLeft = hasOverflow
        ? (node.scrollWidth - node.clientWidth) / 2
        : 0;
    };

    centerHorizontalScroll();
    window.addEventListener("resize", centerHorizontalScroll);

    return () => {
      window.removeEventListener("resize", centerHorizontalScroll);
    };
  }, [results]);

  const hasTime = results.some((result) => typeof result.time === "string" && result.type === "driver");
  const hasTeam = results.some((result) => result.type === "team");

  const participantTypeLabel = !hasTeam ? "Driver" : "Team";
  const participantLabel = resultPerRound ? "Rounds" : participantTypeLabel;



  return (
    <TableWrapper ref={wrapperRef}>
      <TableInner>
        <TableHeader>
          <TableTitle>{title}</TableTitle>
        </TableHeader>
        <TableContent>
          <TableContentHeader>
            {results.some((result) => result.position !== undefined) && (
              <PositionHeaderRow>
                <HeaderCell>P</HeaderCell>
              </PositionHeaderRow>
            )}
            <ParticipantHeaderRow>
              <HeaderCell>{participantLabel}</HeaderCell>
            </ParticipantHeaderRow>
            {hasTime  ? (
              <TimeHeaderRow>
                <HeaderCell>Time</HeaderCell>
              </TimeHeaderRow>
            ) : (
              <>
                {!!metricLabel && (
                  <RaceHeaderRow>
                    <HeaderCell>{metricLabel ?? "Races"}</HeaderCell>
                  </RaceHeaderRow>
                )}
              </>
            )}
            {!hidePoints && (
              <PointsHeaderRow>
                <HeaderCell>Points</HeaderCell>
              </PointsHeaderRow>
            )}
          </TableContentHeader>
          {results.map(({ position, points, driver, time, races, onClick, roundInfo }) => (
            <TableRows key={driver.id}>
              <Row
                position={position}
                points={points}
                driverInfo={driver}
                isTeamRow={hasTeam}
                time={time}
                races={races}
                onClick={onClick}
                resultPerRound={resultPerRound}
                roundInfo={roundInfo}
                hidePoints={hidePoints}
              />
            </TableRows>
          ))}
        </TableContent>
      </TableInner>
    </TableWrapper>
  );
};

export default Table;
