import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
// import CreateIcon from "@assets/Icon/Create.svg?react";
// import SearchIcon from "@assets/Icon/Search.svg?react";
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
          title="No Leagues Hosted"
          icon={<LeagueIcon />}
          subtitle="This Squad is currently not hosting any Leagues."
          // actions={{
          //   primary: {
          //     label: "Create New League",
          //     onClick: () => {},
          //     leftIcon: <CreateIcon />,
          //   },
          //   secondary: {
          //     label: "Find a League",
          //     onClick: () => {},
          //     leftIcon: <SearchIcon />,
          //   },
          // }}
        />
      </ListContainer>
    </CardListWrapper>
  );
};

export default LeaguesListCard;