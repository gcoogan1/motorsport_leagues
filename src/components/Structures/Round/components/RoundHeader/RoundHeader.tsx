import BriefingIcon from "@assets/Icon/Briefing.svg?react";
import ReportIcon from "@assets/Icon/Report.svg?react";
import { HeaderContainer, TextContainer, Title, ActionsContainer } from './RoundHeader.styles'
import Button from "@/components/Button/Button";

type EventButton = {
  onClick: () => void;
  isDisabled?: boolean;
};

type RoundHeaderProps = {
  roundName: string;
  briefingButton?: EventButton;
  reportButton?: EventButton;
}

const RoundHeader = ({ roundName, briefingButton, reportButton }: RoundHeaderProps) => {
  return (
    <HeaderContainer>
      <TextContainer>
        <Title>{roundName}</Title>
      </TextContainer>
      <ActionsContainer>
        {briefingButton && (
          <Button color="base" onClick={briefingButton.onClick} icon={{ left: <BriefingIcon /> }}>
            Driver Briefing
          </Button>
        )}
        {reportButton && (
          <Button color="base" onClick={reportButton.onClick} icon={{ left: <ReportIcon /> }}>
            Report Incident
          </Button>
        )}
      </ActionsContainer>
    </HeaderContainer>
  )
}

export default RoundHeader