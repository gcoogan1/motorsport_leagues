import { useEffect, useState } from "react";
import ReadOnlyInput from "@/components/Inputs/ReadOnlyInput/ReadOnlyInput";
import {
  ActionsContainer,
  InputContainer,
  ReadOnlyContainer,
  ReadOnlyRow,
  TableHeader,
  TableWrapper,
} from "./SpecialInputTable.styles";
import Button from "@/components/Button/Button";
import MoreIcon from "@assets/Icon/More_Vertical.svg?react";
import MenuDropdown from "@/components/Dropdowns/MenuDropdown/MenuDropdown";

type UserOption = {
  username: string;
  information: string;
  size: "small" | "medium" | "large";
  avatarType: "preset" | "upload";
  avatarValue: string;
};

type SpecialInputTableProps = {
  header: string;
  rows: {
    id: string;
    user: UserOption;
    actions?: {
      label: string;
      icon?: React.ReactNode;
      value: string;
      onSelect: () => void;
    }[];
    moreOnClick?: () => void;
  }[];
};

const SpecialInputTable = ({ header, rows }: SpecialInputTableProps) => {
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

  return (
    <TableWrapper>
      <TableHeader>{header}</TableHeader>
      <ReadOnlyContainer>
        {rows.map((row) => (
          <ReadOnlyRow key={row.id}>
            <InputContainer><ReadOnlyInput profile={row.user} /></InputContainer>
            <ActionsContainer data-actions-container="true">
              <Button
                size="small"
                color="base"
                rounded
                variant="ghost"
                ariaLabel="row actions"
                icon={{ left: <MoreIcon /> }}
                onClick={() => {
                  if (row.actions?.length) {
                    setOpenRowMenuId((prev) => (prev === row.id ? null : row.id));
                    return;
                  }

                  row.moreOnClick?.();
                }}
              />
              {openRowMenuId === row.id && !!row.actions?.length && (
                <MenuDropdown
                  type="text"
                  isStandAlone
                  options={row.actions.map((action) => ({
                    label: action.label,
                    value: action.value,
                    icon: action.icon,
                  }))}
                  onSelect={(value) => {
                    const selectedAction = row.actions?.find((action) => action.value === value);
                    selectedAction?.onSelect();
                    setOpenRowMenuId(null);
                  }}
                />
              )}
            </ActionsContainer>
          </ReadOnlyRow>
        ))}
      </ReadOnlyContainer>
    </TableWrapper>
  );
};

export default SpecialInputTable;
