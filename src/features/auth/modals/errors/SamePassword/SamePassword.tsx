import Dialog from '@/components/Dialog/Dialog'
import { useModal } from '@/providers/modal/useModal';


const SamePassword = () => {
  const { closeModal } = useModal();
  
  return (
    <Dialog 
      type='alert'
      title='Cannot Use Same Password'
      subtitle='You are not allowed to use the same password consecutively. Please choose a different password.'
      buttons={{
        onContinue: {
          label: 'Okay',
          action: () => {
            closeModal();
          }
        }
      }}
    />
  )
}

export default SamePassword;