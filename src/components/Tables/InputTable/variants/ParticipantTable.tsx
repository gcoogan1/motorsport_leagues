import { useFieldArray, useFormContext } from "react-hook-form";
import ReadOnlyInput from "@/components/Inputs/ReadOnlyInput/ReadOnlyInput";
import MultiInput from "@/components/Inputs/MultiInput/MultiInput";
import MoreIcon from "@assets/Icon/More_Vertical.svg?react";
import type { ParticipantTable as ParticipantTableRow } from "./InputTable.variants";
import {
  ColumnText,
  ExtraCell,
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
import Button from "@/components/Button/Button";

type ParticipantTableProps = {
  name: string;
  columns: ParticipantTableRow;
  customWidth?: string;
  moreOnClick?: () => void;
};

type ParticipantProfile = NonNullable<
  ParticipantTableRow["participant"]
>["user"];

const ParticipantTable = ({
  name,
  columns,
  customWidth,
  moreOnClick,
}: ParticipantTableProps) => {
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
          const participantProfile = (
            field as { participant?: ParticipantProfile }
          ).participant;

          return (
            <TableRow key={field.id}>
              {columns.number && (
                <NumberCell>
                  <NumberText>{i + 1}</NumberText>
                </NumberCell>
              )}
              {columns.participant && (
                <ParticipantCell>
                  <ReadOnlyInput profile={participantProfile} />
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
              <ExtraCell>
                <Button
                  size="small"
                  color="base"
                  rounded
                  variant="ghost"
                  ariaLabel="remove row"
                  icon={{ left: <MoreIcon /> }}
                  onClick={() => moreOnClick && moreOnClick()}
                />
              </ExtraCell>
            </TableRow>
          );
        })}
      </TableBody>
    </TableWrapper>
  );
};

export default ParticipantTable;
