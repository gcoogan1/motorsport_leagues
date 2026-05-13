import Dialog from '@/components/Dialog/Dialog'
import { useModal } from '@/providers/modal/useModal';


const NoTeams = () => {
  const { closeModal } = useModal();
  
  return (
    <Dialog 
      type='alert'
      title='No Teams Created'
      subtitle="Please create a team before assigning drivers."
      buttons={{
        onContinue: {
          label: "Okay",
          action: () => closeModal(),
        },
      }}
    />
  )
}

export default NoTeams;