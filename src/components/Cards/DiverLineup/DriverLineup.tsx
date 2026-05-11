import type { AvatarVariants } from "@/components/Avatar/Avatar.variants";
import {
  CardTitle,
  DriverButton,
  DriverLineupWrapper,
  TitleText,
} from "./DriverLineup.styles";
import UserProfile from "@/components/Users/Profile/UserProfile";
import { ThemeProvider } from "styled-components";
import { designTokens } from "@/app/design/tokens";
import { themeTokens, type ThemeName } from "@/app/design/tokens/theme";

type DriverLineupProps = {
  username: string;
  teamName: string;
  avatarType: "preset" | "upload";
  avatarValue: AvatarVariants | string;
  cardNumber: string;
  driverId: string;
  themeColor?: ThemeName;
  onClick?: (id: string) => void;
};

const DriverLineup = ({
  username,
  teamName,
  avatarType,
  avatarValue,
  cardNumber,
  driverId,
  themeColor = "yellow",
  onClick,
}: DriverLineupProps) => {
  return (
    <ThemeProvider theme={{ ...designTokens, theme: themeTokens[themeColor] }}>
      <DriverLineupWrapper>
        <CardTitle>
          <TitleText>{`Driver #${cardNumber}`}</TitleText>
        </CardTitle>
        <DriverButton onClick={() => onClick?.(driverId)}>
          <UserProfile
            username={username}
            information={teamName}
            avatarType={avatarType}
            avatarValue={avatarValue}
            size="large"
          />
        </DriverButton>
      </DriverLineupWrapper>
    </ThemeProvider>
  );
};

export default DriverLineup;
