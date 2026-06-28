import Dialog from '@/components/Dialog/Dialog'
import { useModal } from '@/providers/modal/useModal';


const Duplicate = () => {
  const { closeModal } = useModal();
  
  return (
    <Dialog 
      type='alert'
      title='Invite Already Sent'
      subtitle="The user already has been notified of the invite."
      buttons={{
        onContinue: {
          label: "Okay",
          action: () => closeModal(),
        },
      }}
    />
  )
}

export default Duplicate;