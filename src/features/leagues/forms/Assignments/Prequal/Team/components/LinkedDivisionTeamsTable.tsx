import type { FieldArrayWithId, FieldErrors } from "react-hook-form";
import AddItem from "@/components/AddItem/AddItem";
import Button from "@/components/Button/Button";
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import SelectInput, { type SelectInputOption } from "@/components/Inputs/SelectInput/SelectInput";
import RemoveIcon from "@assets/Icon/Remove.svg?react";
import { TEAM_COLUMN_STYLE } from "../../../TeamAssignments/TeamAssignments.util";
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
} from "../../../TeamAssignments/TeamAssignments.styles";
import type { TeamAssignmentsFormValues } from "../prequalTeamAssignments.schema";

type PrequalTeamFieldRow = FieldArrayWithId<TeamAssignmentsFormValues, "teams", "id">;

type LinkedDivisionTeamsTableProps = {
  teamFields: PrequalTeamFieldRow[];
  teamErrors: FieldErrors<TeamAssignmentsFormValues>["teams"];
  getOptionsForRow: (rowIndex: number) => SelectInputOption[];
  onRemoveTeam: (index: number) => void;
  onAddTeam: () => void;
  showEmptyState: boolean;
};

const LinkedDivisionTeamsTable = ({
  teamFields,
  teamErrors,
  getOptionsForRow,
  onRemoveTeam,
  onAddTeam,
  showEmptyState,
}: LinkedDivisionTeamsTableProps) => {

  return (
    <>
      {teamFields.length > 0 ? (
        <>
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
            {teamFields.map((field, index) => {
              return (
                <TableRow key={field.id}>
                  <NumberCell $isError={!!teamErrors?.[index]}>
                    <NumberText>{index + 1}</NumberText>
                  </NumberCell>
                  <ParticipantCell style={TEAM_COLUMN_STYLE}>
                    <SelectInput
                      name={`teams.${index}.teamName`}
                      options={getOptionsForRow(index)}
                      hasError={!!teamErrors?.[index]?.teamName}
                      errorMessage={teamErrors?.[index]?.teamName?.message}
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
              );
            })}
          </TableBody>
        </TableWrapper>
          <AddItem label="Add Team" onClick={onAddTeam} />
        </>
      ) : showEmptyState ? (
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <EmptyMessage
            title="Teams Not Assigned to Division"
            subtitle="Assign teams from the Pre-Qualifying into this division."
            hideIcon
          />
        </div>
      ) : (
        <AddItem label="Add Team" onClick={onAddTeam} />
      )}
    </>
  );
};

export default LinkedDivisionTeamsTable;
