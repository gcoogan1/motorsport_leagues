import Dialog from '@/components/Dialog/Dialog'
import { useModal } from '@/providers/modal/useModal';


const AttemptMax = () => {
  const { closeModal } = useModal();
  
  return (
    <Dialog 
      type='alert'
      title='Too Many Failed Attempts'
      subtitle='Please wait a few minutes before trying again, or request a code to be resent.'
      buttons={{
        onContinue: {
          label: 'Okay',
          action: () => {
            closeModal()
          }
        }
      }}
    />
  )
}

export default AttemptMax;