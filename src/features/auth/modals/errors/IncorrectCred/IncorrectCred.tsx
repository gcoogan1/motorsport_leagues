import Dialog from '@/components/Dialog/Dialog'
import { useModal } from '@/providers/modal/useModal';

type IncorrectCredProps = {
  onResetPassword?: () => void;
}

const IncorrectCred = ({ onResetPassword }: IncorrectCredProps) => {
  const { closeModal } = useModal();

  const handleResetPassword = () => {
    if (onResetPassword) {
      onResetPassword();
      closeModal();
    }
  }
  
  return (
    <Dialog 
      type='alert'
      title='Incorrect Email or Password'
      subtitle='You’ve entered incorrect credentials. Try again or reset your password.'
      buttons={{
        onContinue: {
          label: 'Try Again',
          action: () => {
            closeModal();
          }
        },
        onCancel: {
          label: 'Reset Password',
          action: handleResetPassword
        }
      }}
    />
  )
}

export default IncorrectCred