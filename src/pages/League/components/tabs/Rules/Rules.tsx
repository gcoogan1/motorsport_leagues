import SetupIcon from "@assets/Icon/Season_Setup.svg?react";
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import type { LeagueStatus } from "@/types/league.types";

type RulesProps = {
  seasonStatus: LeagueStatus;
};

const Rules = ({ seasonStatus }: RulesProps) => {
  return (
    <>
      {seasonStatus === "setup" ? (
        <EmptyMessage
          icon={<SetupIcon />}
          title="Coming Soon"
          subtitle="The latest Season of this League is being set up!"
        />
      ) : (
        <EmptyMessage
          icon={<SetupIcon />}
          title="Coming Soon"
          subtitle="The latest Season of this League is being set up!"
        />
      )}
    </>
  );
};

export default Rules;
