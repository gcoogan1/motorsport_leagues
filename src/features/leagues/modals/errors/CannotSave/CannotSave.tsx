import Dialog from '@/components/Dialog/Dialog'
import { useModal } from '@/providers/modal/useModal';


const CannotSave = () => {
  const { closeModal } = useModal();
  
  return (
    <Dialog 
      type='alert'
      title='Cannot Save Changes'
      subtitle="Please fix the errors on the page and try again."
      buttons={{
        onContinue: {
          label: "Okay",
          action: () => closeModal(),
        },
      }}
    />
  )
}

export default CannotSave;