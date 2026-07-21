import { useMemo } from "react";
import { useSelector } from "react-redux";
import SetupIcon from "@assets/Icon/Season_Setup.svg?react";
import type { RootState } from "@/store";
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import { useGetLeagueRulesQuery } from "@/rtkQuery/API/leagueApi";
import { useLeagueParticipants } from "@/rtkQuery/hooks/queries/useLeagues";
import type { LeagueSeasonTable, LeagueStatus } from "@/types/league.types";
import RulesHeader from "@/components/Structures/RulesHeader/RulesHeader";
import { RulesContainer, RulesContent, TextContainer } from "./Rules.styles";
import { usePanel } from "@/providers/panel/usePanel";
import LoadingMessage from "@/components/Messages/LoadingMessage/LoadingMessage";

type RulesProps = {
  seasonStatus: LeagueStatus;
  seasonData?: LeagueSeasonTable;
};

const Rules = ({ seasonStatus, seasonData }: RulesProps) => {
  const {openPanel} = usePanel()
  const accountId = useSelector((state: RootState) => state.account.data?.id);
  const leagueId = seasonData?.league_id ?? "";
  const { data: rulesData, isLoading } = useGetLeagueRulesQuery(leagueId, {
    skip: !leagueId,
  });
  const { data: participants = [] } = useLeagueParticipants(leagueId);

  // Check if current user is a steward or director
  const isStewardOrDirector = useMemo(() => {
    if (!accountId) return false;
    const currentParticipant = participants.find(
      (p) => p?.account_id === accountId
    );
    return currentParticipant?.roles.includes("steward") || currentParticipant?.roles.includes("director") ? true : false;
  }, [participants, accountId]);

  const content = rulesData?.rules ?? "";
  const hasRules = content.replace(/<[^>]*>/g, "").trim().length > 0;

  const handleStewardOnClick = () => {
    openPanel("TICKET", { isStewardOrDirector, seasonData });
  }

  

  return (
    <>
      {seasonStatus === "setup" ? (
        <EmptyMessage
          icon={<SetupIcon />}
          title="Coming Soon"
          subtitle="The latest Season of this League is being set up!"
        />
      ) : isLoading ? (
        <LoadingMessage />
      ) : hasRules ? (
        <RulesContainer>
          <RulesHeader
            title={seasonData?.season_name}
            editedAt={rulesData?.edited_at}
            showStewardDecisions
            stewardDecisionsClick={handleStewardOnClick}
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
