import { useModal } from '@/providers/modal/useModal';
import Dialog from '@/components/Dialog/Dialog'
import SquadNoProfile from '../SquadNoProfile/SquadNoProfile';

type JoinSquadProps = {
  hasProfile: boolean;
}

const JoinSquad = ({ hasProfile }: JoinSquadProps) => {
  const { openModal, closeModal } = useModal();

  const handleContinue = () => {
    if (!hasProfile) {
      // open modal prompting user to create profile before joining squad
      openModal(<SquadNoProfile type="join" />);
    } else {
      // Logic to join the squad
    }
    closeModal();
  }
  
  return (
    <Dialog 
      type='core'
      title='Squad Invite'
      subtitle={`You’ve been invited to join this Squad.`}
      buttons={{
        onCancel: {
          label: 'Cancel',
          action: () => closeModal(),
        },
        onContinue: {
          label: 'Join Squad',
          action: () => handleContinue(),
        }
      }}
    />
  )
}

export default JoinSquad;