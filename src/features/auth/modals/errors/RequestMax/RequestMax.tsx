import Dialog from '@/components/Dialog/Dialog'
import { useModal } from '@/providers/modal/useModal';


const RequestMax = () => {
  const { closeModal } = useModal();
  
  return (
    <Dialog 
      type='alert'
      title='Too Many Requests'
      subtitle='Please wait a minute before requesting a new code.'
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

export default RequestMax;