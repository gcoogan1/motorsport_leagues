
type SheetFormProps = {
  seasonName: string;
  header: string;
  blockHeader?: string;
  blockDescription?: string;
  headerChildren?: React.ReactNode;
  tabs?: React.ReactNode;
  filters?: React.ReactNode;
  details?: {
    title: string;
    information: string;
  }
  listChildren: React.ReactNode;
  onSave: () => void;
}

const SheetForm = ({}: SheetFormProps) => {
  return (
    <div>SheetForm</div>
  )
}

export default SheetForm