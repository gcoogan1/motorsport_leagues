import ReadOnlyInput from "@/components/Inputs/ReadOnlyInput/ReadOnlyInput";
import {
  InputContainer,
  ReadOnlyContainer,
  ReadOnlyRow,
  TableHeader,
  TableWrapper,
} from "./SpecialInputTable.styles";
import Button from "@/components/Button/Button";
import MoreIcon from "@assets/Icon/More_Vertical.svg?react";

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
    moreOnClick?: () => void;
  }[];
};

const SpecialInputTable = ({ header, rows }: SpecialInputTableProps) => {
  return (
    <TableWrapper>
      <TableHeader>{header}</TableHeader>
      <ReadOnlyContainer>
        {rows.map((row) => (
          <ReadOnlyRow key={row.id}>
            <InputContainer><ReadOnlyInput profile={row.user} /></InputContainer>
            <Button
              size="small"
              color="base"
              rounded
              variant="ghost"
              ariaLabel="remove row"
              icon={{ left: <MoreIcon /> }}
              onClick={() => row.moreOnClick && row.moreOnClick()}
            />
          </ReadOnlyRow>
        ))}
      </ReadOnlyContainer>
    </TableWrapper>
  );
};

export default SpecialInputTable;
