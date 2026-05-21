import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import ReadOnlyInput from "@/components/Inputs/ReadOnlyInput/ReadOnlyInput";
import { TEAM_COLUMN_STYLE } from "../../../TeamAssignments/util/TeamAssignments.util";
import {
  ColumnText,
  NumberCell,
  NumberColumn,
  NumberText,
  ParticipantCell,
  ParticipantColumn,
  ParticipantHeader,
  TableBody,
  TableRow,
  TableWrapper,
} from "../../../TeamAssignments/TeamAssignments.styles";
import type { ReadOnlyDivisionDriver } from "../../Team/util/prequalTeamAssignments.util";

type PrequalDriversTableProps = {
  drivers: ReadOnlyDivisionDriver[];
};

const PrequalDriversTable = ({ drivers }: PrequalDriversTableProps) => {
  const centeredDriverColumnStyle = {
    ...TEAM_COLUMN_STYLE,
    minWidth: "240px",
    maxWidth: "240px",
    flex: "0 1 240px",
    justifyContent: "center",
    textAlign: "center",
  } as const;

  if (drivers.length === 0) {
    return (
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <EmptyMessage
          hideIcon
          title="Teams Not Assigned to Division"
          subtitle="Please assign teams from the Pre-Qualifying into divisions."
        />
      </div>
    );
  }

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <TableWrapper style={{ maxWidth: "300px" }}>
        <ParticipantHeader>
          <TableRow style={{ justifyContent: "center" }}>
            <NumberColumn>
              <ColumnText>#</ColumnText>
            </NumberColumn>
            <ParticipantColumn>
              <ColumnText>Driver / Team</ColumnText>
            </ParticipantColumn>
          </TableRow>
        </ParticipantHeader>
        <TableBody>
          {drivers.map((driver, index) => (
            <TableRow key={driver.id} style={{ justifyContent: "center" }}>
              <NumberCell>
                <NumberText>{index + 1}</NumberText>
              </NumberCell>
              <ParticipantCell style={centeredDriverColumnStyle}>
                <ReadOnlyInput
                  profile={{
                    username: driver.username,
                    avatarType: driver.avatarType,
                    avatarValue: driver.avatarValue,
                    information: driver.teamName,
                  }}
                  centerContent
                />
              </ParticipantCell>
            </TableRow>
          ))}
        </TableBody>
      </TableWrapper>
    </div>
  );
};

export default PrequalDriversTable;
