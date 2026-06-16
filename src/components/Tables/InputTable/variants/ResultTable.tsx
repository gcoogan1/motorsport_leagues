import { useFieldArray, useFormContext } from "react-hook-form";
import ProfileSelectInput from "@/components/Inputs/ProfileSelectInput/ProfileSelectInput";
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
import type { ResultTable as ResultTableRow } from "../InputTable.variants";
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

  // NEED FOR TIME??
  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   let input = e.target.value.replace(/\D/g, ""); // Only digits

  //   // Format as HH:MM.MMM (max 7 digits: 2+2+3)
  //   if (input.length > 7) {
  //     input = input.slice(0, 7);
  //   }

  //   let formatted = "";
  //   if (input.length >= 1) {
  //     formatted = input.slice(0, 2); // HH
  //   }
  //   if (input.length >= 3) {
  //     formatted = input.slice(0, 2) + ":" + input.slice(2, 4); // HH:MM
  //   }
  //   if (input.length >= 5) {
  //     formatted = input.slice(0, 2) + ":" + input.slice(2, 4) + "." + input.slice(4, 7); // HH:MM.MMM
  //   }

  //   setValue(name, formatted);
  // };

  return (
    <TableWrapper style={{ width: customWidth || "640px" }}>
      <ResultHeader>
        <TableRow>
          {columns.p && (
            <PComlumn $hasPoints={!!columns.points}>
              <ColumnText>P</ColumnText>
            </PComlumn>
          )}
          {columns.driver && (
            <DriverColumn $hasPoints={!!columns.points}>
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
              <PCell $hasPoints={!!columns.points}>
                <PText>{i + 1}</PText>
              </PCell>
            )}
            {columns.driver && (
              <DriverCell $hasPoints={!!columns.points}>
                <ProfileSelectInput
                  name={`${name}.${i}.${columns.driver.name}`}
                  type="driver"
                  profiles={columns.driver.profiles}
                  shortenText={!!columns.points}
                />
              </DriverCell>
            )}
            {columns.time && (
              <TimeCell>
                <TextInput name={`${name}.${i}.${columns.time.name}`} placeholder="00:00.000" />
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
