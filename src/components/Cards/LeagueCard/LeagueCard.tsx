import { useEffect, useState } from "react";
import type { Tag } from "@/components/Tags/Tags.variants";
import type { LeagueStatus } from "@/types/league.types";
import type { GameType } from "@/types/profile.types";
import Icon from "@/components/Icon/Icon";
import ParticipantsIcon from "@/assets/Icon/Participants.svg?react";
import GameIcon from "@/assets/Icon/Game.svg?react";
import HostIcon from "@/assets/Icon/Hosts.svg?react";
import { ClickableWrapper, Divider, ImageContainer, IndicatorsContainer, LeagueInfoContainer, LeagueInfoContent, LeagueInfoText, LeagueName, SquadInfoText, TextContainer } from "./LeagueCard.styles";
import Status from "@/components/Status/Status";
import Tags from "@/components/Tags/Tags";
import { ThemeProvider } from "styled-components";
import { themeTokens, type ThemeName } from "@/app/design/tokens/theme";
import { designTokens } from "@/app/design/tokens";

type LeagueCardProps = {
  name: string;
  coverImageUrl: string;
  seasonStatus: LeagueStatus;
  size: "small" | "medium";
  hostingSquad?: string;
  numOfParticipants?: number;
  gameType?: GameType;
  tags?: Tag[];
  themeColor?: ThemeName;
  onClick?: () => void;
}

const LeagueCard = ({
  name,
  coverImageUrl,
  seasonStatus,
  size,
  hostingSquad,
  numOfParticipants,
  gameType,
  tags,
  onClick,
  themeColor = "yellow",
}: LeagueCardProps) => {
  const visibleTags = tags?.slice(0, size === "medium" ? 3 : 2);
  const [loadedCoverImageUrl, setLoadedCoverImageUrl] = useState<string>(coverImageUrl);

  const gameTypeMap: Record<GameType, string> = {
    gt7: "GT7",
    iRacing: "iRacing",
    assetoCorsaEvo: "Evo",
    leMansUltimate: "LMU",
  }

  useEffect(() => {
    if (!coverImageUrl) return;

    let isActive = true;
    const image = new Image();

    image.onload = () => {
      if (isActive) {
        setLoadedCoverImageUrl(coverImageUrl);
      }
    };

    image.onerror = () => {
      if (isActive) {
        setLoadedCoverImageUrl("");
      }
    };

    image.src = coverImageUrl;

    return () => {
      isActive = false;
    };
  }, [coverImageUrl]);

  const imageBg = coverImageUrl && loadedCoverImageUrl === coverImageUrl
    ? loadedCoverImageUrl
    : "";

  return (
    <ThemeProvider theme={{ ...designTokens, theme: themeTokens[themeColor] }}>
      <ClickableWrapper onClick={onClick} $cardSize={size}>
        <ImageContainer $cardSize={size} $imageBg={imageBg}>
          <IndicatorsContainer>
            {visibleTags && <Tags variants={visibleTags} />}
            {seasonStatus && <Status statusType={seasonStatus} />}
          </IndicatorsContainer>
        </ImageContainer>
        <TextContainer $cardSize={size}>
          <LeagueName>{name}</LeagueName>
          {size === "medium" ? (
            <LeagueInfoContainer>
                {numOfParticipants !== undefined && (
                  <>
                  <LeagueInfoContent>
                    <Icon size="small"><ParticipantsIcon /></Icon>
                    <LeagueInfoText>{numOfParticipants}</LeagueInfoText>
                  </LeagueInfoContent>
                  <Divider />
                  </>
                )}
                {gameType && (
                  <>
                    <LeagueInfoContent>
                      <Icon size="small"><GameIcon /></Icon>
                      <LeagueInfoText>{gameTypeMap[gameType]}</LeagueInfoText>
                    </LeagueInfoContent>
                    <Divider />
                  </>
                )}
                {hostingSquad && (
                  <LeagueInfoContent>
                    <Icon size="small"><HostIcon /></Icon>
                    <LeagueInfoText>{hostingSquad}</LeagueInfoText>
                  </LeagueInfoContent>
                )}
            </LeagueInfoContainer>
          ) : (
            <SquadInfoText>{`Hosted by ${hostingSquad}`}</SquadInfoText>
          )}
        </TextContainer>
      </ClickableWrapper>
    </ThemeProvider>
  )
}

export default LeagueCard