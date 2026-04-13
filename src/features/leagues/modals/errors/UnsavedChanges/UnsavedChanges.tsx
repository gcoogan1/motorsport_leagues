import Dialog from '@/components/Dialog/Dialog'
import { useModal } from '@/providers/modal/useModal';

type UnsavedChangesProps = {
  onDiscard: () => void;
  onCancel?: () => void;
};

const UnsavedChanges = ({ onDiscard, onCancel }: UnsavedChangesProps) => {
  const { closeModal } = useModal();

  const handleDiscard = () => {
    closeModal();
    onDiscard();
  };

  const handleCancel = () => {
    closeModal();
    onCancel?.();
  };
  
  return (
    <Dialog 
      type='alert'
      title='Unsaved Changes'
      subtitle="Are you sure you want to discard your changes?"
      buttons={{
        onContinue: {
          label: "Yes, Discard",
          action: handleDiscard,
        },
        onCancel: {
          label: "No, Cancel",
          action: handleCancel,
        },
      }}
    />
  )
}

export default UnsavedChanges;