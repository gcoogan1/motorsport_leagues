import Dialog from '@/components/Dialog/Dialog'
import { useModal } from '@/providers/modal/useModal';

type AccountVerifiedProps = {
  onContinue?: () => void;
};

const AccountVerified = ({ onContinue }: AccountVerifiedProps) => {
  const { closeModal } = useModal();

  const handleContinue = () => {
    closeModal();
    if (onContinue) {
      onContinue();
    }
    return
  }
  
  return (
    <Dialog 
      type='success'
      title='Account Verified!'
      subtitle='Your account has been successfully verified. Welcome to Motorsport Leagues.'
      buttons={{
        onContinue: {
          label: 'Yay!',
          action: handleContinue
        }
      }}
    />
  )
}

export default AccountVerified;