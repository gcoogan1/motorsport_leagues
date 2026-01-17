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
      subtitle='An account with this email address already exists. Please log in to continue.'
      buttons={{
        onContinue: {
          label: 'Continue',
          action: handleContinue
        },
        onCancel: {
          label: 'Cancel',
          action: () => {
            closeModal();
          }
        }
      }}
    />
  )
}

export default ExistingAccount