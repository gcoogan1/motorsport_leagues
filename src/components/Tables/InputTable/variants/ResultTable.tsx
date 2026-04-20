import { useFieldArray, useFormContext } from "react-hook-form";
import ProfileSelectInput from "@/components/Inputs/ProfileSelectInput/ProfileSelectInput";
import TimeInput from "@/components/Inputs/TimeInput/TimeInput";
import MoreIcon from "@assets/Icon/More_Vertical.svg?react";
import {
  ColumnText,
  DriverCell,
  DriverColumn,
  ExtraCell,
  ExtraColumn,
  PCell,
  PComlumn,
  PointsCell,
  PointsColumn,
  PText,
  ResultHeader,
  TableBody,
  TableRow,
  TableWrapper,
  TimeCell,
  TimeColumn,
} from "../InputTable.styles";
import type { ResultTable as ResultTableRow } from "./InputTable.variants";
import TextInput from "@/components/Inputs/TextInput/TextInput";
import Button from "@/components/Button/Button";

type ResultTableProps = {
  name: string;
  columns: ResultTableRow;
  customWidth?: string; // should be "116px",
  moreOnClick?: () => void;
};

const ResultTable = ({ name, columns, customWidth, moreOnClick }: ResultTableProps) => {
  const { control } = useFormContext();
  const { fields } = useFieldArray({ control, name });

  return (
    <TableWrapper style={{ width: customWidth || "640px" }}>
      <ResultHeader>
        <TableRow>
          {columns.p && (
            <PComlumn>
              <ColumnText>P</ColumnText>
            </PComlumn>
          )}
          {columns.driver && (
            <DriverColumn>
              <ColumnText>{columns.driver.label}</ColumnText>
            </DriverColumn>
          )}
          {columns.time && (
            <TimeColumn>
              <ColumnText>{columns.time.value}</ColumnText>
            </TimeColumn>
          )}
          {columns.points && (
            <PointsColumn>
              <ColumnText>{columns.points.value}</ColumnText>
            </PointsColumn>
          )}
          <ExtraColumn />
        </TableRow>
      </ResultHeader>
      <TableBody>
        {fields.map((field, i) => (
          <TableRow key={field.id}>
            {columns.p && (
              <PCell>
                <PText>{i + 1}</PText>
              </PCell>
            )}
            {columns.driver && (
              <DriverCell>
                <ProfileSelectInput
                  name={`${name}.${i}.${columns.driver.name}`}
                  type="driver"
                  profiles={columns.driver.profiles}
                />
              </DriverCell>
            )}
            {columns.time && (
              <TimeCell>
                <TimeInput name={`${name}.${i}.${columns.time.name}`} />
              </TimeCell>
            )}
            {columns.points && (
              <PointsCell>
                <TextInput
                  type="number"
                  maxLength={3}
                  name={`${name}.${i}.${columns.points.name}`}
                />
              </PointsCell>
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
        ))}
      </TableBody>
    </TableWrapper>
  );
};

export default ResultTable;
