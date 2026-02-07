import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import CreateIcon from "@assets/Icon/Create.svg?react";
import SearchIcon from "@assets/Icon/Search.svg?react";
import LeagueIcon from "@assets/Icon/League.svg?react";
import {
  CardListWrapper,
  HeaderContainer,
  ListContainer,
  Title,
} from "./LeaguesListCard.styles";

const LeaguesListCard = () => {
  return (
    <CardListWrapper>
      <HeaderContainer>
        <Title>List of Leagues</Title>
      </HeaderContainer>
      <ListContainer>
        <EmptyMessage
          title="No Leagues Created or Joined"
          icon={<LeagueIcon />}
          subtitle="Use your driver Profile to join a League or use a Squad to create your perfect racing series."
          actions={{
            primary: {
              label: "Create New League",
              onClick: () => {},
              leftIcon: <CreateIcon />,
            },
            secondary: {
              label: "Find a League",
              onClick: () => {},
              leftIcon: <SearchIcon />,
            },
          }}
        />
      </ListContainer>
    </CardListWrapper>
  );
};

export default LeaguesListCard;