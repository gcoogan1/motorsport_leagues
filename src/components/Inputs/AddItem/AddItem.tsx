import AddIcon from "@assets/Icon/Add.svg?react";
import Button from "@/components/Button/Button";
import { ItemContainer } from './AddItem.styles'

type AddItemProps = {
  onClick?: () => void;
}

const AddItem = ({ onClick }: AddItemProps) => {
  return (
    <ItemContainer>
      <Button color="base" variant="ghost" ariaLabel="Add Item" icon={{ left: <AddIcon />}} onClick={onClick}>Add Item</Button>
    </ItemContainer>
  )
}

export default AddItem