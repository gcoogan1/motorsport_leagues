import Dialog from '@/components/Dialog/Dialog'
import { useModal } from '@/providers/modal/useModal';

type ExistingAccountProps = {
  onContinue?: () => void;
}


const ExistingAccount = ({ onContinue }: ExistingAccountProps) => {
  const { closeModal } = useModal();

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
      closeModal();
    }
  }
  
  return (
    <Dialog 
      type='alert'
      title='Existing Account'
      subtitle='An account already exists with this email. Go to log in with this email address, or reset your password.'
      buttons={{
        onContinue: {
          label: 'Go to Log In',
          action: handleContinue
        },
        onCancel: {
          label: 'Close',
          action: () => {
            closeModal();
          }
        }
      }}
    />
  )
}

export default ExistingAccount