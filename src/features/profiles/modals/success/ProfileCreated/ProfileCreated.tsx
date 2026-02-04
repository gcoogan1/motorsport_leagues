import { useModal } from '@/providers/modal/useModal';
import Dialog from '@/components/Dialog/Dialog'

const ProfileCreated = () => {
  const { closeModal } = useModal();
  
  return (
    <Dialog 
      type='success'
      title='Profile Created!'
      subtitle={`Your Profile has been successfully created. You can now use it to create or join Squads and Leagues.`}
      buttons={{
        onContinue: {
          label: 'Yay!',
          action: () => closeModal(),
        }
      }}
    />
  )
}

export default ProfileCreated;