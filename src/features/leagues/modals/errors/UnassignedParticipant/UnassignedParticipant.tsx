import Dialog from '@/components/Dialog/Dialog'
import { useModal } from '@/providers/modal/useModal';


const UnassignedParticipant = () => {
  const { closeModal } = useModal();
  
  return (
    <Dialog 
      type='alert'
      title='Unassigned Participant(s)'
      subtitle="Please ensure every participant is assigned at least one role."
      buttons={{
        onContinue: {
          label: "Okay",
          action: () => closeModal(),
        },
      }}
    />
  )
}

export default UnassignedParticipant;