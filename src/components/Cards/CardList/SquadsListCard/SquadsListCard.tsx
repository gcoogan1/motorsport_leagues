import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import SquadIcon from "@assets/Icon/Squad.svg?react";
import CreateIcon from "@assets/Icon/Create.svg?react";
import SearchIcon from "@assets/Icon/Search.svg?react";
import SquadCard from "../../SquadCard/SquadCard";
import {
  CardListWrapper,
  HeaderContainer,
  ListContainer,
  Title,
} from "./SquadsListCard.styles";

type SquadsListCardProps = {
  squads: Array<{
    id: string;
    name: string;
    bannerUrl?: string;
    membersCount?: number;
    onClick: () => void;
  }>;
  onCreateSquad?: () => void;
  onFindSquad?: () => void;
  isOwner: boolean;
};  

const SquadsListCard = ({ squads, isOwner, onCreateSquad, onFindSquad }: SquadsListCardProps) => {

  const handleCreateSquad = () => {
    if (onCreateSquad) {
      onCreateSquad();
    }
  };

  const handleFindSquad = () => {
    if (onFindSquad) {
      onFindSquad();
    }
  };

  return (
    <CardListWrapper>
      <HeaderContainer>
        <Title>My Squads</Title>
      </HeaderContainer>
      <ListContainer>
        {squads && squads.length > 0 ? (
          squads.map((squad) => (
            <SquadCard
              key={squad.id}
              name={squad.name}
              size="medium"
              bannerImageUrl={squad.bannerUrl}
              memberCount={squad.membersCount ?? 0}
              onClick={squad.onClick}
            />
          ))
        ) : !isOwner ? (
          <EmptyMessage
            title="No Squads Created or Joined"
            subtitle="This Profile is currently not part of any Squads."
            icon={<SquadIcon />}
          />
        ) : (
          <EmptyMessage
            title="No Squads Created or Joined"
            icon={<SquadIcon />}
            subtitle="Start building your racing community by creating or joining your first Squad with a Profile."
            actions={{
              primary: {
                label: "Create New Squad",
                onClick: handleCreateSquad,
                leftIcon: <CreateIcon />,
              },
              secondary: {
                label: "Find a Squad",
                onClick: handleFindSquad,
                leftIcon: <SearchIcon />,
              },
            }}
          />
        )}
      </ListContainer>
    </CardListWrapper>
  );
};

export default SquadsListCard;
