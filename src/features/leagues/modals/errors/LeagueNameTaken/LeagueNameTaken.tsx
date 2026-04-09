import Dialog from '@/components/Dialog/Dialog'
import { useModal } from '@/providers/modal/useModal';


const LeagueNameTaken = () => {
  const { closeModal } = useModal();
  
  return (
    <Dialog 
      type='alert'
      title='Name Taken'
      subtitle="A League already exists with this name."
      buttons={{
        onContinue: {
          label: "Okay",
          action: () => closeModal(),
        },
      }}
    />
  )
}

export default LeagueNameTaken;