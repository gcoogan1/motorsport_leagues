import { useModal } from '@/providers/modal/useModal';
import Dialog from '@/components/Dialog/Dialog'
import { navigate } from '@/app/navigation/navigation';

const GuestJoinSquad = () => {
  const { closeAllModals } = useModal();

  const handleContinue = () => {
    navigate('/create-account');
    closeAllModals();
  }
  
  return (
    <Dialog 
      type='alert'
      title='Account Required to Join Squads'
      subtitle={`Please log in or sign up to join this Squad.`}
      buttons={{
        onCancel: {
          label: 'Cancel',
          action: () => closeAllModals(),
        },
        onContinue: {
          label: 'Create Account',
          action: () => handleContinue(),
        }
      }}
    />
  )
}

export default GuestJoinSquad;