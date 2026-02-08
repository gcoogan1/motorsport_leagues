import Dialog from '@/components/Dialog/Dialog'
import type { GameType } from '@/types/profile.types';
import { useModal } from '@/providers/modal/useModal';

type ExistingUsernameProps = {
  gameType?: GameType;
  buttonLabel?: string;
}


const ExistingUsername = ({ gameType = "gt7", buttonLabel = "Okay" }: ExistingUsernameProps) => {
  const { closeModal } = useModal();
  
  return (
    <Dialog 
      type='alert'
      title='Existing Username'
      subtitle={`A ${gameType.toUpperCase()} Profile already exists with this username.`}
      buttons={{
        onContinue: {
          label: buttonLabel,
          action: () => closeModal(),
        },
      }}
    />
  )
}

export default ExistingUsername