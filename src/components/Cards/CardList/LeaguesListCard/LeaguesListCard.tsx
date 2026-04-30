import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import type { FC } from "react";
import type { ThemeName } from "@/app/design/tokens/theme";
import CreateIcon from "@assets/Icon/Create.svg?react";
import SearchIcon from "@assets/Icon/Search.svg?react";
import LeagueIcon from "@assets/Icon/League.svg?react";
import LeagueCard from "@/components/Cards/LeagueCard/LeagueCard";
import { getCoverVariants } from "@/components/Structures/Cover/Cover.variants";
import type { LeagueWithInfo } from "@/types/league.types";
import type { Tag } from "@/components/Tags/Tags.variants";
import {
  CardListWrapper,
  HeaderContainer,
  ListContainer,
  Title,
} from "./LeaguesListCard.styles";
import { navigate } from "@/app/navigation/navigation";

type LeaguesListCardProps = {
  leagues?: LeagueWithInfo[];
  isOwner?: boolean;
  currentUserId?: string;
  onCreateLeague?: () => void;
  onFindLeague?: () => void;
  squadPageView?: boolean;
};

const LeaguesListCard: FC<LeaguesListCardProps> = ({
  leagues = [],
  isOwner = false,
  currentUserId,
  onCreateLeague,
  onFindLeague,
  squadPageView
}) => {

  const handleCreateLeague = () => {
    if (onCreateLeague) {
      onCreateLeague();
    }

  };

  const handleFindLeague = () => {
    if (onFindLeague) {
      onFindLeague();
    } 
  };

  const handleLeagueClick = (leagueId: string) => {
    navigate(`/league/${leagueId}`);
    return;
  }

  return (
    <CardListWrapper>
      <HeaderContainer>
        <Title>{squadPageView ? "Hosted Leagues" : "My Leagues"}</Title>
      </HeaderContainer>
      <ListContainer>
        {leagues && leagues.length > 0 ? (
          leagues.map((league) => {
            const coverImageUrl =
              league.cover_type === "preset"
                ? getCoverVariants()[
                    league.cover_value as keyof ReturnType<typeof getCoverVariants>
                  ]
                : league.cover_value;
            // Determine if the current user is a participant in the league and get their roles for tag display
            const isParticipant = currentUserId
              ? league.participants.some((participant) => participant.account_id === currentUserId)
              : false;
            const participant = isParticipant
              ? league.participants.find((p) => p.account_id === currentUserId)
              : undefined;
            const roleTags: Tag[] = participant?.roles ?? [];

            return (
              <LeagueCard
                key={league.id}
                name={league.league_name}
                coverImageUrl={coverImageUrl}
                seasonStatus={league.league_status}
                size="medium"
                gameType={league.game_type}
                hostingSquad={league.hosting_squad_name}
                numOfParticipants={league.participants.length}
                tags={isParticipant ? roleTags : undefined}
                onClick={() => handleLeagueClick(league.id)}
                themeColor={league.theme_color as ThemeName}
              />
            );
          })
        ) : !isOwner ? (
          <EmptyMessage
            title={squadPageView ? "No Hosted Leagues" : "No Leagues Created or Joined"}
            subtitle={squadPageView ? "This Squad is currently not hosting any Leagues." : "This Profile is currently not part of any Leagues."}
            icon={<LeagueIcon />}
          />
        ) : (
          <EmptyMessage
            title={squadPageView ? "No Hosted Leagues" : "No Leagues Created or Joined"}
            subtitle={squadPageView ? "This Squad is currently not hosting any Leagues." : "Use your driver Profile to join a League or use a Squad to create your perfect racing series."}
            icon={<LeagueIcon />}
            actions={{
              primary: {
                label: "Create New League",
                onClick: handleCreateLeague,
                leftIcon: <CreateIcon />,
              },
              secondary: {
                label: 'Find a League',
                onClick: handleFindLeague,
                leftIcon: <SearchIcon />,
              }
            }}
          />
        )}
      </ListContainer>
    </CardListWrapper>
  );
};

export default LeaguesListCard;