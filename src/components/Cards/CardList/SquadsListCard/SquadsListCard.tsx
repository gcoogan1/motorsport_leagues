import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import SquadIcon from "@assets/Icon/Squad.svg?react";
import CreateIcon from "@assets/Icon/Create.svg?react";
import SearchIcon from "@assets/Icon/Search.svg?react";
import {
  CardListWrapper,
  HeaderContainer,
  ListContainer,
  Title,
} from "./SquadsListCard.styles";

const SquadsListCard = () => {
  return (
    <CardListWrapper>
      <HeaderContainer>
        <Title>List of Squads</Title>
      </HeaderContainer>
      <ListContainer>
        <EmptyMessage
          title="No Squads Created or Joined"
          icon={<SquadIcon />}
          subtitle="Start building your racing community by creating or joining your first Squad with a Profile."
          actions={{
            primary: {
              label: "Create New Squad",
              onClick: () => {},
              leftIcon: <CreateIcon />,
            },
            secondary: {
              label: "Find a Squad",
              onClick: () => {},
              leftIcon: <SearchIcon />,
            },
          }}
        />
      </ListContainer>
    </CardListWrapper>
  );
};

export default SquadsListCard;
