import Dialog from '@/components/Dialog/Dialog'
import { useModal } from '@/providers/modal/ModalProvider';


const NameUpdateFail = () => {
  const { closeModal } = useModal();
  
  return (
    <Dialog 
      type='alert'
      title='Name Change Failed'
      subtitle='Please try again.'
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

export default NameUpdateFail;