import { useModal } from '@/providers/modal/useModal';
import Dialog from '@/components/Dialog/Dialog'
import { navigate } from '@/app/navigation/navigation';

const SquadNoProfile = () => {
  const { closeModal } = useModal();

  const handleContinue = () => {
    navigate('/create-profile');
    closeModal();
  }
  
  return (
    <Dialog 
      type='core'
      title='Profile Required to Follow Squads'
      subtitle={`Please create a Profile to be able to follow this, and other, Squads.`}
      buttons={{
        onCancel: {
          label: 'Cancel',
          action: () => closeModal(),
        },
        onContinue: {
          label: 'Create Profile',
          action: () => handleContinue(),
        }
      }}
    />
  )
}

export default SquadNoProfile;