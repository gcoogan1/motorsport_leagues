import Dialog from '@/components/Dialog/Dialog'
import { useModal } from '@/providers/modal/useModal';


const ExistingUsername = () => {
  const { closeModal } = useModal();
  
  return (
    <Dialog 
      type='alert'
      title='Existing Username'
      subtitle='A GT7 Profile already exists with this username.'
      buttons={{
        onContinue: {
          label: 'Okay',
          action: () => closeModal(),
        },
      }}
    />
  )
}

export default ExistingUsername