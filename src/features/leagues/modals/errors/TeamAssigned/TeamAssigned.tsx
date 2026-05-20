import Dialog from '@/components/Dialog/Dialog'
import { useModal } from '@/providers/modal/useModal';

const TeamAssigned = () => {
  const { closeModal } = useModal();

    
  return (
    <Dialog 
      type='alert'
      title='Team Currently Assigned'
      subtitle={"Team must be unassigned from their division before you can delete this team."}
      buttons={{
        onContinue: {
          label: "Okay",
          action: () => closeModal(),
        },
      }}
    />
  )
}

export default TeamAssigned;