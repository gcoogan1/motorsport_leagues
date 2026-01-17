import Dialog from '@/components/Dialog/Dialog'
import { useModal } from '@/providers/modal/useModal';


const ServerError = () => {
  const { closeModal } = useModal();
  
  return (
    <Dialog 
      type='alert'
      title='Something Went Wrong'
      subtitle='Please try again.'
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

export default ServerError;