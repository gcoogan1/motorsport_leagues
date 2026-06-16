import { RowWrapper, RowContainer, RowText, TimeCell, RacesCell, PointsCell } from "./Row.styles";
import Position from "../Position/Position";
import UserProfile from "@/components/Users/Profile/UserProfile";
import type { Tag } from "@/components/Tags/Tags.variants";
import type { AvatarVariants } from "@/components/Avatar/Avatar.variants";

type DriverInfo = {
  id: string;
  username: string;
  driverNumber: string;
  avatarType: "preset" | "upload";
  avatarValue: AvatarVariants | string;
  tags?: Tag[];
};

type RowProps = {
  position: number;
  points: number;
  driverInfo: DriverInfo;
  time?: string;
  races?: number;
  isTeam?: boolean;
  onClick: () => void;
}

const Row = ({ position, time, races, points, onClick, isTeam, driverInfo }: RowProps) => {
  return (
    <RowWrapper>
      <RowContainer onClick={onClick}>
        <Position position={position} />
        <UserProfile username={driverInfo.username} avatarType={driverInfo.avatarType} avatarValue={driverInfo.avatarValue} />
        {isTeam ? <RacesCell><RowText>{races}</RowText></RacesCell> : <TimeCell><RowText>{time}</RowText></TimeCell>}
        <PointsCell><RowText>{points}</RowText></PointsCell>
      </RowContainer>
    </RowWrapper>
  );
};

export default Row;