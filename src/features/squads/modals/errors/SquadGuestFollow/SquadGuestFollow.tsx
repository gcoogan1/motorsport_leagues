import { useModal } from '@/providers/modal/useModal';
import Dialog from '@/components/Dialog/Dialog'
import { navigate } from '@/app/navigation/navigation';

const SquadGuestFollow = () => {
  const { closeModal } = useModal();

  const handleContinue = () => {
    navigate('/create-account');
    closeModal();
  }
  
  return (
    <Dialog 
      type='alert'
      title='Account Required to Follow Squads'
      subtitle={`Please log in or sign up to follow this Squad.`}
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

export default SquadGuestFollow;