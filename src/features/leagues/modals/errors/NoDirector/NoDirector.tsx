import Dialog from '@/components/Dialog/Dialog'
import { useModal } from '@/providers/modal/useModal';


const NoDirector = () => {
  const { closeModal } = useModal();
  
  return (
    <Dialog 
      type='alert'
      title='No League Director'
      subtitle="Please ensure there is at least one Director role assigned."
      buttons={{
        onContinue: {
          label: "Okay",
          action: () => closeModal(),
        },
      }}
    />
  )
}

export default NoDirector;