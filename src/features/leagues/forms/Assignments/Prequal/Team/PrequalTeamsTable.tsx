import type { FieldErrors } from "react-hook-form";
import AddItem from "@/components/AddItem/AddItem";
import Button from "@/components/Button/Button";
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import SelectInput, { type SelectInputOption } from "@/components/Inputs/SelectInput/SelectInput";
import RemoveIcon from "@assets/Icon/Remove.svg?react";
import { TEAM_COLUMN_STYLE } from "../../TeamAssignments/TeamAssignments.util";
import {
  ColumnText,
  ExtraCell,
  NumberCell,
  NumberColumn,
  NumberText,
  ParticipantCell,
  ParticipantColumn,
  ParticipantHeader,
  TableBody,
  TableRow,
  TableWrapper,
} from "../../TeamAssignments/TeamAssignments.styles";
import type { TeamAssignmentsFormValues } from "../../TeamAssignments/teamAssignments.schema";

type PrequalTeamsTableProps = {
  teamFields: Array<{ id: string }>;
  teamErrors: FieldErrors<TeamAssignmentsFormValues>["teams"];
  getOptionsForRow: (rowIndex: number) => SelectInputOption[];
  onRemoveTeam: (index: number) => void;
  onAddTeam: () => void;
};

const PrequalTeamsTable = ({
  teamFields,
  teamErrors,
  getOptionsForRow,
  onRemoveTeam,
  onAddTeam,
}: PrequalTeamsTableProps) => {
  return (
    <>
      {teamFields.length > 0 ? (
        <TableWrapper>
          <ParticipantHeader>
            <TableRow>
              <NumberColumn>
                <ColumnText>#</ColumnText>
              </NumberColumn>
              <ParticipantColumn style={TEAM_COLUMN_STYLE}>
                <ColumnText>Team</ColumnText>
              </ParticipantColumn>
            </TableRow>
          </ParticipantHeader>
          <TableBody>
            {teamFields.map((field, index) => (
              <TableRow key={field.id}>
                <NumberCell $isError={!!teamErrors?.[index]}>
                  <NumberText>{index + 1}</NumberText>
                </NumberCell>
                <ParticipantCell style={TEAM_COLUMN_STYLE}>
                  <SelectInput
                    name={`teams.${index}.teamName`}
                    options={getOptionsForRow(index)}
                  />
                </ParticipantCell>
                <ExtraCell $isError={!!teamErrors?.[index]?.teamName}>
                  <Button
                    size="small"
                    color="base"
                    rounded
                    variant="ghost"
                    ariaLabel="remove row"
                    icon={{ left: <RemoveIcon /> }}
                    onClick={() => onRemoveTeam(index)}
                  />
                </ExtraCell>
              </TableRow>
            ))}
          </TableBody>
          <AddItem label="Add Team" onClick={onAddTeam} />
        </TableWrapper>
      ) : (
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <EmptyMessage
            title="Teams Not Assigned to Division"
            subtitle="Assign teams from the Pre-Qualifying into this division."
            hideIcon
          />
        </div>
      )}
    </>
  );
};

export default PrequalTeamsTable;
