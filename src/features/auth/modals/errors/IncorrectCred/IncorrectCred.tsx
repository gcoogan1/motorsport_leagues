import { navigate } from '@/app/navigation/navigation';
import Dialog from '@/components/Dialog/Dialog'
import { useModal } from '@/providers/modal/useModal';


const IncorrectCred = () => {
  const { closeModal } = useModal();

  const handleResetPassword = () => {
    navigate("/reset-password?status=verify");
    closeModal();
    return;
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