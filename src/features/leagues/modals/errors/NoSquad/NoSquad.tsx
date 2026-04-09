import Dialog from '@/components/Dialog/Dialog'
import { useModal } from '@/providers/modal/useModal';


const NoSquad = () => {
  const { closeModal } = useModal();
  
  return (
    <Dialog 
      type='alert'
      title='Not a Member of a Squad'
      subtitle="To create a League with this Profile, it needs to be a member of a Squad. Choose another Profile or create your own Squad."
      buttons={{
        onContinue: {
          label: "Okay",
          action: () => closeModal(),
        },
      }}
    />
  )
}

export default NoSquad;