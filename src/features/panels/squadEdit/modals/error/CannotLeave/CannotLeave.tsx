import Dialog from '@/components/Dialog/Dialog'
import { useModal } from '@/providers/modal/useModal';
import DeleteSquad from '../../../forms/DeleteSquad/DeleteSquad';


const CannotLeave = () => {
  const { openModal, closeModal } = useModal();

  const handleDeleteSquad = () => {
    closeModal();
    openModal(<DeleteSquad />);
    return;
  }
  
  return (
    <Dialog 
      type='alert'
      title='Can’t Leave Squad'
      subtitle="You are the only Founder on this Squad. You’ll have to assign another Member as a Founder or delete the Squad."
      buttons={{
        onCancel: {
          label: "Cancel",
          action: () => closeModal(),
        },
        onContinue: {
          label: "Delete Squad",
          isDanger: true,
          action: () => handleDeleteSquad(),
        },
      }}
    />
  )
}

export default CannotLeave;