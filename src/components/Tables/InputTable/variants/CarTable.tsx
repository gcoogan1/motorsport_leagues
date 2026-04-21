import { useFieldArray, useFormContext } from "react-hook-form";
import Button from "@/components/Button/Button";
import SelectInput from "@/components/Inputs/SelectInput/SelectInput";
import MoreIcon from "@assets/Icon/More_Vertical.svg?react";
import type { CarTable as CarTableRow } from "../InputTable.variants";
import {
  CarHeader,
  CategoryCell,
  CategoryColumn,
  ColumnText,
  ExtraCell,
  ModelCell,
  ModelColumn,
  TableBody,
  TableRow,
  TableWrapper,
} from "../InputTable.styles";

type CarTableProps = {
  name: string;
  columns: CarTableRow;
  customWidth?: string; // should be "400px"
  moreOnClick?: () => void;
};

const CarTable = ({
  name,
  columns,
  customWidth,
  moreOnClick,
}: CarTableProps) => {
  const { control } = useFormContext();
  const { fields } = useFieldArray({ control, name });

  return (
    <TableWrapper style={{ width: customWidth || "400px" }}>
      <CarHeader>
        <TableRow>
          {columns.category && (
            <CategoryColumn>
              <ColumnText>Category</ColumnText>
            </CategoryColumn>
          )}
          {columns.model && (
            <ModelColumn>
              <ColumnText>Model</ColumnText>
            </ModelColumn>
          )}
        </TableRow>
      </CarHeader>
      <TableBody>
        {fields.map((field, i) => (
          <TableRow key={field.id}>
            {columns.category && (
              <CategoryCell>
                <SelectInput
                  name={`${name}.${i}.${columns.category.name}`}
                  options={columns.category.options}
                />
              </CategoryCell>
            )}
            {columns.model && (
              <ModelCell>
                <SelectInput
                  name={`${name}.${i}.${columns.model.name}`}
                  options={columns.model.options}
                />
              </ModelCell>
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

export default CarTable;
