import AddIcon from "@assets/Icon/Add.svg?react";
import Button from "@/components/Button/Button";
import { ItemContainer } from './AddItem.styles'

type AddItemProps = {
  label?: string;
  onClick?: () => void;
}

const AddItem = ({ label = "Add Item", onClick }: AddItemProps) => {
  return (
    <ItemContainer>
      <Button color="base" variant="ghost" ariaLabel={label} icon={{ left: <AddIcon />}} onClick={onClick}>{label}</Button>
    </ItemContainer>
  )
}

export default AddItem