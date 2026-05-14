import type { AvatarVariants } from "@/components/Avatar/Avatar.variants";
import type { Tag } from "@/components/Tags/Tags.variants";
import {
  CardTitle,
  DriverInfo,
  DriverName,
  EmptyTeamContent,
  EmptyTeamSubtitle,
  TeamButton,
  TeamLineupWrapper,
  TeamTitle,
  TitleText,
} from "./TeamLineup.styles";
import UserProfile from "@/components/Users/Profile/UserProfile";

type DriverInfo = {
  id: string;
  username: string;
  driverNumber: string;
  avatarType: "preset" | "upload";
  avatarValue: AvatarVariants | string;
  tags?: Tag[];
};

type TeamLineupProps = {
  teamName: string;
  teamNumber: number;
  drivers?: DriverInfo[];
  onTeamClick?: () => void;
};

const TeamLineup = ({
  teamName,
  drivers,
  teamNumber,
  onTeamClick,
}: TeamLineupProps) => {
  return (
    <TeamLineupWrapper>
      <CardTitle>
        <TitleText>{`Team #${teamNumber}`}</TitleText>
      </CardTitle>
      {drivers && drivers.length > 0 ? (
        <TeamButton
          onClick={onTeamClick}
          aria-label={`View details for ${teamName}`}
        >
          <TeamTitle>{teamName}</TeamTitle>
          {drivers.map((driver) => (
            <DriverInfo key={driver.id}>
              <DriverName>{`Driver ${driver.driverNumber}`}</DriverName>
              <UserProfile
                username={driver.username}
                avatarType={driver.avatarType}
                avatarValue={driver.avatarValue}
                size="small"
                tags={driver.tags}
              />
            </DriverInfo>
          ))}
        </TeamButton>
      ) : (
        <EmptyTeamContent>
          <TeamTitle>{teamName}</TeamTitle>
          <EmptyTeamSubtitle>No drivers assigned</EmptyTeamSubtitle>
        </EmptyTeamContent>
      )}
    </TeamLineupWrapper>
  );
};

export default TeamLineup;
