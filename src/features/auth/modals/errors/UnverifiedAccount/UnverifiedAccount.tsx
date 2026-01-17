import Dialog from '@/components/Dialog/Dialog'
import { useModal } from '@/providers/modal/useModal';

type UnverifiedAccountProps = {
  email?: string;
  onVerify?: () => void;
}

const UnverifiedAccount = ({ email, onVerify }: UnverifiedAccountProps) => {
  const { closeModal } = useModal();

  const handleVerify = () => {
    if (onVerify) {
      onVerify();
      closeModal();
    }
  }
  
  return (
    <Dialog 
      type='alert'
      title='Your Account Is Unverified'
      subtitle={`Please verify your email, ${email}, to finalize creating your account.`}
      buttons={{
        onContinue: {
          label: 'Verify',
          action: handleVerify
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

export default UnverifiedAccount