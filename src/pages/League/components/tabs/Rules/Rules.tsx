import SetupIcon from "@assets/Icon/Season_Setup.svg?react";
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import { useGetLeagueRulesQuery } from "@/rtkQuery/API/leagueApi";
import type { LeagueSeasonTable, LeagueStatus } from "@/types/league.types";
import RulesHeader from "@/components/Structures/RulesHeader/RulesHeader";
import { RulesContainer, RulesContent, TextContainer } from "./Rules.styles";

type RulesProps = {
  seasonStatus: LeagueStatus;
  seasonData?: LeagueSeasonTable;
};

const Rules = ({ seasonStatus, seasonData }: RulesProps) => {
  const leagueId = seasonData?.league_id ?? "";
  const { data: rulesData, isLoading } = useGetLeagueRulesQuery(leagueId, {
    skip: !leagueId,
  });

  const content = rulesData?.rules ?? "";
  const hasRules = content.replace(/<[^>]*>/g, "").trim().length > 0;

  return (
    <>
      {seasonStatus === "setup" ? (
        <EmptyMessage
          icon={<SetupIcon />}
          title="Coming Soon"
          subtitle="The latest Season of this League is being set up!"
        />
      ) : isLoading ? (
        <EmptyMessage
          icon={<SetupIcon />}
          title="Loading Rules"
          subtitle="Fetching current league rules and regulations."
        />
      ) : hasRules ? (
        <RulesContainer>
          <RulesHeader
            title={seasonData?.season_name}
            editedAt={rulesData?.edited_at}
            // showStewardDecisions={rulesData?.showStewardDecisions}
            // stewardDecisionsClick={rulesData?.stewardDecisionsClick}
          />
          <TextContainer>
            <RulesContent>
              <div className="ProseMirror" dangerouslySetInnerHTML={{ __html: content }} />
            </RulesContent>
          </TextContainer>
        </RulesContainer>
      ) : (
        <EmptyMessage
          icon={<SetupIcon />}
          title="No Rules Posted"
          subtitle="League directors have not published rules yet."
        />
      )}
    </>
  );
};

export default Rules;
