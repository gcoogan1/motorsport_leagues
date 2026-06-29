import {
  RowWrapper,
  RowContainer,
  RowText,
  TimeCell,
  RacesCell,
  PointsCell,
  TeamCell,
  ParticipantCell,
  RoundContainer,
  TrackName,
  RoundName,
} from "./Row.styles";
import Position from "../Position/Position";
import UserProfile from "@/components/Users/Profile/UserProfile";
import type { Tag } from "@/components/Tags/Tags.variants";
import type { AvatarVariants } from "@/components/Avatar/Avatar.variants";

type DriverInfo = {
  id: string;
  username: string;
  avatarType: "preset" | "upload";
  avatarValue: AvatarVariants | string;
  tags?: Tag[];
  teamName?: string;
};

type RoundInfo = {
  roundName: string;
  trackName: string;
};

type RowProps = {
  position: number;
  points: number;
  driverInfo: DriverInfo;
  time?: string;
  races?: number;
  isTeamRow?: boolean;
  resultPerRound?: boolean;
  roundInfo?: RoundInfo;
  onClick: () => void;
};

const Row = ({
  position,
  time,
  races,
  points,
  onClick,
  driverInfo,
  isTeamRow,
  resultPerRound,
  roundInfo,
}: RowProps) => {
  return (
    <RowWrapper>
      <RowContainer onClick={onClick}>
        <Position position={position} />
        {resultPerRound ? (
          <ParticipantCell>
            <RoundContainer>
              <RoundName $shortenText={true}>{roundInfo?.roundName}</RoundName>
              <TrackName $shortenText={true}>{roundInfo?.trackName}</TrackName>
            </RoundContainer>
          </ParticipantCell>
        ) : (
          <>
            {isTeamRow ? (
              <TeamCell>
                <RowText>{driverInfo.teamName ?? driverInfo.username}</RowText>
              </TeamCell>
            ) : (
              <ParticipantCell>
                <UserProfile
                  username={driverInfo.username}
                  information={driverInfo.teamName}
                  avatarType={driverInfo.avatarType}
                  avatarValue={driverInfo.avatarValue}
                  tags={driverInfo.tags}
                  shortenTeamText={true}
                />
              </ParticipantCell>
            )}
          </>
        )}
        {!time && !!races ? (
          <RacesCell>
            <RowText>{races ?? 0}</RowText>
          </RacesCell>
        ) : time && (
          <TimeCell>
            <RowText>{time}</RowText>
          </TimeCell>
        )}
        <PointsCell>
          <RowText>{points}</RowText>
        </PointsCell>
      </RowContainer>
    </RowWrapper>
  );
};

export default Row;