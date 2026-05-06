import SetupIcon from "@assets/Icon/Season_Setup.svg?react";
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import type { LeagueStatus } from "@/types/league.types";
import ContentTextBlock from "@/components/Structures/ContentBlocks/ContentTextBlock/ContentTextBlock";

type OverviewProps = {
  seasonStatus: LeagueStatus;
};

const Overview = ({ seasonStatus }: OverviewProps) => {
  return (
    <>
      {seasonStatus === "setup" ? (
        <EmptyMessage
          icon={<SetupIcon />}
          title="Coming Soon"
          subtitle="The latest Season of this League is being set up!"
        />
      ) : (
        <ContentTextBlock
          title="Overview"
          message="Enter some text here to provide description about this season. This content blocks in the overview tab are unique for each season, along with the poster image."
        />
      )}
    </>
  );
};

export default Overview;
