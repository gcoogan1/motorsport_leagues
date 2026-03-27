import { useModal } from '@/providers/modal/useModal';
import Dialog from '@/components/Dialog/Dialog'
import { navigate } from '@/app/navigation/navigation';

type GuestJoinSquadProps = {
  onCancel?: () => void;
};

const GuestJoinSquad = ({ onCancel }: GuestJoinSquadProps) => {
  const { closeAllModals } = useModal();

  const handleContinue = () => {
    navigate('/create-account');
    closeAllModals();
  }

  const handleCancel = () => {
    onCancel?.();
    closeAllModals();
  };
  
  return (
    <Dialog 
      type='alert'
      title='Account Required to Join Squads'
      subtitle={`Please log in or sign up to join this Squad.`}
      buttons={{
        onCancel: {
          label: 'Cancel',
          action: handleCancel,
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