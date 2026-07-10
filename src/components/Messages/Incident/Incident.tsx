import ReadOnlyInput from "@/components/Inputs/ReadOnlyInput/ReadOnlyInput";
import FormRow from "@/components/Forms/FormRow/FormRow";
import { Details, IncidentWrapper, Reporter } from "./Incident.styles";

type IncidentProps = {
  reportingDriver: {
    username: string;
    avatarType: "preset" | "upload";
    avatarValue: string;
    teamName?: string;
  };
  offendingDriver: {
    username: string;
    avatarType: "preset" | "upload";
    avatarValue: string;
    teamName?: string;
  };
  eventName: string;
  session: string;
  description: string;
  createdAt: string;
};

const Incident = ({
  reportingDriver,
  offendingDriver,
  eventName,
  session,
  description,
  createdAt,
}: IncidentProps) => {
  return (
    <IncidentWrapper>
      <Reporter>
        <ReadOnlyInput
          label="Reporter"
          profile={{ ...reportingDriver, information: reportingDriver.teamName, size: reportingDriver.teamName ? "medium" : "small" }}
          helperText={createdAt}
        />
      </Reporter>
      <Details>
        <FormRow>
          <ReadOnlyInput
            label="Event"
            textValue={eventName}
          />
          <ReadOnlyInput
            label="Session"
            textValue={session}
          />
        </FormRow>
        <ReadOnlyInput
          label="Offending Driver"
          profile={{ ...offendingDriver, information: offendingDriver.teamName, size: offendingDriver.teamName ? "medium" : "small" }}
        />
        <ReadOnlyInput
          label="Incident Description"
          richText={description}
        />
      </Details>
    </IncidentWrapper>
  );
};

export default Incident;
