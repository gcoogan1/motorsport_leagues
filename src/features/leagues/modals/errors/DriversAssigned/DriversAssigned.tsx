import Dialog from '@/components/Dialog/Dialog'
import { useModal } from '@/providers/modal/useModal';

type DriversAssignedProps = {
  isPreQual?: boolean;
  driverInEvent?: boolean;
}

const DriversAssigned = ({ isPreQual, driverInEvent }: DriversAssignedProps) => {
  const { closeModal } = useModal();
  
  const subtitle = isPreQual
    ? "All drivers must be unassigned from their division before you can delete this driver(s)."
    : driverInEvent
    ? "Driver(s) are currently assigned to an event and cannot be deleted or reassigned until they are unassigned."
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