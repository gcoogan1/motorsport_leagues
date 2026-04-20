import ReadOnlyInput from "@/components/Inputs/ReadOnlyInput/ReadOnlyInput";
import {
  ColumnText,
  NumberCell,
  NumberColumn,
  NumberText,
  ParticipantCell,
  ParticipantColumn,
  ParticipantHeader,
  RoleCell,
  RoleColumn,
  TableBody,
  TableRow,
  TableWrapper,
} from "../InputTable.styles";
import type { ParticipantTable as ParticipantTableRow } from "./InputTable.variants";
import MultiInput from "@/components/Inputs/MultiInput/MultiInput";
import { useFieldArray, useFormContext } from "react-hook-form";

type ParticipantTableProps = {
  name: string;
  columns: ParticipantTableRow;
  customWidth?: string;
};

type ParticipantProfile = NonNullable<ParticipantTableRow["participant"]>["user"];

const ParticipantTable = ({ name, columns, customWidth }: ParticipantTableProps) => {
  const { control } = useFormContext();
  const { fields } = useFieldArray({ control, name });

  return (
    <TableWrapper style={{ width: customWidth || "640px" }}>
      <ParticipantHeader>
        <TableRow>
          {columns.number && (
            <NumberColumn>
              <ColumnText>{columns.number.value}</ColumnText>
            </NumberColumn>
          )}
          {columns.participant && (
            <ParticipantColumn>
              <ColumnText>Participant</ColumnText>
            </ParticipantColumn>
          )}
          {columns.role && (
            <RoleColumn>
              <ColumnText>Role</ColumnText>
            </RoleColumn>
          )}
        </TableRow>
      </ParticipantHeader>
      <TableBody>
        {fields.map((field, i) => {
          const participantProfile = (field as { participant?: ParticipantProfile }).participant;

          return (
          <TableRow key={field.id}>
            {columns.number && (
              <NumberCell>
                <NumberText>{i + 1}</NumberText>
              </NumberCell>
            )}
            {columns.participant && (
              <ParticipantCell>
                <ReadOnlyInput  profile={participantProfile} />
              </ParticipantCell>
            )}
            {columns.role && (
              <RoleCell>
                <MultiInput
                  name={`${name}.${i}.${columns.role.name}`}
                  options={columns.role.options}
                />
              </RoleCell>
            )}
          </TableRow>
        )})}
      </TableBody>
    </TableWrapper>
  );
};

export default ParticipantTable;
