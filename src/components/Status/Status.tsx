import { StatusContainer, StatusText } from "./Status.styles";


const StatusContent = {
  unavailable: "Season Unavailable",
  open: "Registration Open",
  active: "Season Active",
  complete: "Season Complete",
}

type StatusProps ={
  statusType: "unavailable" | "open" | "active" | "complete";
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