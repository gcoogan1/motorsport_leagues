import Dialog from '@/components/Dialog/Dialog'
import { useModal } from '@/providers/modal/useModal';


const NameTaken = () => {
  const { closeModal } = useModal();
  
  return (
    <Dialog 
      type='alert'
      title='Name Taken'
      subtitle="A Squad already exists with this name."
      buttons={{
        onContinue: {
          label: "Okay",
          action: () => closeModal(),
        },
      }}
    />
  )
}

export default NameTaken;