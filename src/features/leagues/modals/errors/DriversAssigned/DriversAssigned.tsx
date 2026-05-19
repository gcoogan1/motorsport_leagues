import Dialog from '@/components/Dialog/Dialog'
import { useModal } from '@/providers/modal/useModal';

type DriversAssignedProps = {
  isPreQual?: boolean;
}

const DriversAssigned = ({ isPreQual }: DriversAssignedProps) => {
  const { closeModal } = useModal();
  
  const subtitle = isPreQual
    ? "All drivers must be unassigned from their division before you can delete this driver(s)."
    : "All drivers must be unassigned from this team before you can delete this team.";
    
  return (
    <Dialog 
      type='alert'
      title='Drivers Currently Assigned'
      subtitle={subtitle}
      buttons={{
        onContinue: {
          label: "Okay",
          action: () => closeModal(),
        },
      }}
    />
  )
}

export default DriversAssigned;