import SetupIcon from "@assets/Icon/Season_Setup.svg?react";
import DefaultContentPoster from "@/assets/Overview/defaultContent.png";
import ChampPoints from "@/components/Structures/ChampPoints/ChampPoints";
import ContentBlocksBlock from "@/components/Structures/ContentBlocksBlock/ContentBlocksBlock";
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import SeasonPoster from "@/components/Structures/SeasonPoster/SeasonPoster";
import { useGetLeagueSeasonChampPointsQuery, useGetLeagueSeasonContentBlocksQuery, useGetLeagueSeasonDriversBySeasonIdQuery, useGetLeagueSeasonTeamsBySeasonIdQuery, useGetLeagueSeasonDivisionsQuery, useGetLeagueSeasonDriversByDivisionQuery, useGetLeagueSeasonTeamsByDivisionQuery } from "@/rtkQuery/API/leagueApi";
import { useRoundsBySeason } from "@/rtkQuery/hooks/queries/useRounds";
import { useMemo } from "react";
import { resolveLeagueSeasonPosterUrl } from "@/services/league/leagueSeason.service";
import type { LeagueSeasonTable, LeagueStatus } from "@/types/league.types";
import { OverviewContainer, ContentBlocksContainer } from "./Overview.styles";

type OverviewProps = {
  seasonStatus: LeagueStatus;
  seasonData?: LeagueSeasonTable;
};

const Overview = ({ seasonStatus, seasonData }: OverviewProps) => {
  const seasonId = seasonData?.id ?? "";
  const hasPreQual = seasonData?.includes_pre_qual ?? false;

  const { data: champPointsData, isLoading: isChampPointsLoading } = useGetLeagueSeasonChampPointsQuery(
    seasonId,
    {
      skip: !seasonId,
      refetchOnMountOrArgChange: true,
    },
  );
  const { data: contentBlocksData, isLoading: isContentBlocksLoading } = useGetLeagueSeasonContentBlocksQuery(
    seasonId,
    {
      skip: !seasonId,
      refetchOnMountOrArgChange: true,
    },
  );

  // Get divisions to identify pre-qual division if it exists
  const { data: divisionsData } = useGetLeagueSeasonDivisionsQuery(seasonId, { skip: !seasonId || !hasPreQual });

  // Find pre-qual division (division_number === 0)
  const preQualDivision = useMemo(
    () => (divisionsData ?? []).find((div) => div.division_number === 0),
    [divisionsData],
  );

  const preQualDivisionId = preQualDivision?.id ?? "";

  // Query drivers from pre-qual if it exists, otherwise from season
  const { data: preQualDriversData } = useGetLeagueSeasonDriversByDivisionQuery(preQualDivisionId, {
    skip: !hasPreQual || !preQualDivisionId,
  });
  const { data: seasonDriversData } = useGetLeagueSeasonDriversBySeasonIdQuery(seasonId, {
    skip: hasPreQual || !seasonId,
  });

  const driversData = hasPreQual ? preQualDriversData : seasonDriversData;

  // Query teams from pre-qual if it exists and it's a team championship, otherwise from season
  const { data: preQualTeamsData } = useGetLeagueSeasonTeamsByDivisionQuery(preQualDivisionId, {
    skip: !hasPreQual || !preQualDivisionId || !seasonData?.is_team_championship,
  });
  const { data: seasonTeamsData } = useGetLeagueSeasonTeamsBySeasonIdQuery(seasonId, {
    skip: hasPreQual || !seasonId || !seasonData?.is_team_championship,
  });

  const teamsData = hasPreQual ? preQualTeamsData : seasonTeamsData;

  const { data: roundsData } = useRoundsBySeason(seasonId);

  const hasPoster = Boolean(seasonData?.poster_url);
  const hasContentBlocks = (contentBlocksData?.length ?? 0) > 0;
  const hasChampPoints = (champPointsData?.length ?? 0) > 0;
  const hasOverviewData = hasPoster || hasContentBlocks || hasChampPoints;

  const isLoading = isChampPointsLoading || isContentBlocksLoading;

  return (
    <>
      {seasonStatus === "setup" ? (
        <EmptyMessage
          icon={<SetupIcon />}
          title="Coming Soon"
          subtitle="The latest Season of this League is being set up!"
        />
      ) : !seasonData?.id ? (
        <EmptyMessage
          icon={<SetupIcon />}
          title="No Active Season"
          subtitle="There is no active season selected for this league yet."
        />
      ) : isLoading && !hasOverviewData ? (
        <EmptyMessage
          icon={<SetupIcon />}
          title="Loading Overview"
          subtitle="Fetching the latest season poster, content, and champ points."
        />
      ) : hasOverviewData ? (
        <OverviewContainer>
          {hasPoster && (
            <SeasonPoster
              posterUrl={resolveLeagueSeasonPosterUrl(seasonData.poster_url)}
            />
          )}

          {hasContentBlocks && (
            <ContentBlocksContainer>
              {(contentBlocksData ?? []).map((block, index) => (
                <ContentBlocksBlock
                  key={block.id}
                  title={block.header}
                  description={block.description}
                  imageSrc={block.content_image_url || DefaultContentPoster}
                  isFlipped={index % 2 === 1}
                />
              ))}
            </ContentBlocksContainer>
          )}

          {hasChampPoints && (
            <ChampPoints
              stats={(champPointsData ?? []).map((row) => ({
                position: row.position,
                points: row.points,
              }))}
              numOfDivisions={seasonData.num_of_divisions}
              numOfRounds={roundsData?.length}
              numOfDrivers={driversData?.length}
              numOfTeams={seasonData.is_team_championship ? teamsData?.length : undefined}
            />
          )}
        </OverviewContainer>
      ) : (
        <EmptyMessage
          icon={<SetupIcon />}
          title="Overview Not Published"
          subtitle="No season poster, content blocks, or champ points have been published yet."
        />
      )}
    </>
  );
};

export default Overview;
