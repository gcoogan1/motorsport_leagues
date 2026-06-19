import Button from "@/components/Button/Button";
import StewardsIcon from "@assets/Icon/Stewards.svg?react";
import {
  Container,
  TextContainer,
  TitleContainer,
  SubTitle,
  Title,
  Time,
} from "./RulesHeader.styles";

type RulesHeaderProps = {
  title?: string;
  editedAt?: string;
  showStewardDecisions?: boolean;
  stewardDecisionsClick?: () => void;
};

const RulesHeader = ({
  title,
  editedAt,
  showStewardDecisions,
  stewardDecisionsClick,
}: RulesHeaderProps) => {
  return (
    <Container>
      <TextContainer>
        <TitleContainer>
          <SubTitle>{title}</SubTitle>
          <Title>Sporting Regulations</Title>
        </TitleContainer>
        {editedAt && <Time>{editedAt}</Time>}
      </TextContainer>
      {showStewardDecisions && (
        <Button
          color="base"
          onClick={stewardDecisionsClick}
          icon={{ left: <StewardsIcon /> }}
        >
          Steward Decisions
        </Button>
      )}
    </Container>
  );
};

export default RulesHeader;
