import { useModal } from '@/providers/modal/useModal';
import Dialog from '@/components/Dialog/Dialog'
import { navigate } from '@/app/navigation/navigation';

const GuestFollow = () => {
  const { closeModal } = useModal();

  const handleContinue = () => {
    navigate('/create-account');
    closeModal();
  }
  
  return (
    <Dialog 
      type='alert'
      title='Account Required to Follow Profiles'
      subtitle={`Please log in or sign up to follow this Profile.`}
      buttons={{
        onCancel: {
          label: 'Cancel',
          action: () => closeModal(),
        },
        onContinue: {
          label: 'Create Account',
          action: () => handleContinue(),
        }
      }}
    />
  )
}

export default GuestFollow;