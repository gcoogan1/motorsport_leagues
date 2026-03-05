import { useModal } from '@/providers/modal/useModal';
import Dialog from '@/components/Dialog/Dialog'

const SquadCreated = () => {
  const { closeModal } = useModal();
  
  return (
    <Dialog 
      type='success'
      title='Squad Created!'
      subtitle={`Your Squad has been successfully created. You can now use it to host Leagues.`}
      buttons={{
        onContinue: {
          label: 'Yay!',
          action: () => closeModal(),
        }
      }}
    />
  )
}

export default SquadCreated;