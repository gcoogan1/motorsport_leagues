import { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import ReadOnlyInput from "@/components/Inputs/ReadOnlyInput/ReadOnlyInput";
import MultiInput from "@/components/Inputs/MultiInput/MultiInput";
import MoreIcon from "@assets/Icon/More_Vertical.svg?react";
import type { ParticipantOption, ParticipantTable as ParticipantTableRow } from "../InputTable.variants";
import MenuDropdown from "@/components/Dropdowns/MenuDropdown/MenuDropdown";
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
  actions?: 
    | {
        label: string;
        value: string;
        icon?: React.ReactNode;
        onSelect: (rowIndex: number) => void;
      }[]
    | ((rowIndex: number) => { // This allows for dynamic actions based on the row index or data
        label: string;
        value: string;
        icon?: React.ReactNode;
        onSelect: (rowIndex: number) => void;
      }[]);
};

const ParticipantTable = ({
  name,
  columns,
  customWidth,
  actions,
}: ParticipantTableProps) => {
  const { control } = useFormContext();
  const [openRowMenuId, setOpenRowMenuId] = useState<string | null>(null);

  useEffect(() => {
    if (!openRowMenuId) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;

      if (target?.closest("[data-actions-container='true']")) {
        return;
      }

      setOpenRowMenuId(null);
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openRowMenuId]);

  // The fields is the mapped array of participants that is being rendered in the table. 
  // Each field corresponds to a row in the table.
  const { fields } = useFieldArray({ control, name });

  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);

  return (
    <TableWrapper
      style={customWidth ? { width: customWidth } : { width: "100%", maxWidth: "640px" }}
    >
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
            field as { participant?: ParticipantOption }
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
                    useCheckboxOptions
                    menuIsOpen={openDropdownIndex === i}
                    onMenuOpen={() => setOpenDropdownIndex(i)}
                    onMenuClose={() => setOpenDropdownIndex(null)}
                  />
                </RoleCell>
              )}
              <ExtraCell data-actions-container="true" style={{ position: "relative" }}>
                <Button
                  size="small"
                  color="base"
                  rounded
                  variant="ghost"
                  ariaLabel="row actions"
                  icon={{ left: <MoreIcon /> }}
                  onClick={() => {
                    setOpenRowMenuId((prev) => (prev === field.id ? null : field.id));
                  }}
                />
                {openRowMenuId === field.id && (
                  (() => {
                    const rowActions = typeof actions === "function" ? actions(i) : actions;
                    return rowActions && rowActions.length > 0 ? (
                      <MenuDropdown
                        type="text"
                        isStandAlone
                        options={rowActions.map((action) => ({
                          label: action.label,
                          value: action.value,
                          icon: action.icon,
                        }))}
                        onSelect={(value) => {
                          const selectedAction = rowActions.find((action) => action.value === value);
                          selectedAction?.onSelect(i);
                          setOpenRowMenuId(null);
                        }}
                      />
                    ) : null;
                  })()
                )}
              </ExtraCell>
            </TableRow>
          );
        })}
      </TableBody>
    </TableWrapper>
  );
};

export default ParticipantTable;
