import Dialog from '@/components/Dialog/Dialog'
import { useModal } from '@/providers/modal/useModal';


const DriversAssigned = () => {
  const { closeModal } = useModal();
  
  return (
    <Dialog 
      type='alert'
      title='Drivers Currently Assigned'
      subtitle="All drivers must be unassigned from this team before you can delete this team."
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