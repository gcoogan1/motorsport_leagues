import type { LeagueStatus } from "@/types/league.types";
import { StatusContainer, StatusText } from "./Status.styles";


const StatusContent = {
  setup: "Coming Soon",
  active: "Season Active",
  complete: "Season Complete",
}

type StatusProps ={
  statusType: LeagueStatus;
}

const Status = ({ statusType }: StatusProps) => {

  const statusText = StatusContent[statusType];

  return (
    <StatusContainer>
      <StatusText>{statusText}</StatusText>
    </StatusContainer>
  )
}

export default Status