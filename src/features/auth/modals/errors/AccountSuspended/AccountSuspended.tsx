import Dialog from '@/components/Dialog/Dialog'
import { useModal } from '@/providers/modal/ModalProvider';


const AccountSuspended = () => {
  const { closeModal } = useModal();
  
  return (
    <Dialog 
      type='alert'
      title='Account Suspended'
      subtitle='Your account is no longer allowed on the platform.'
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

export default AccountSuspended;