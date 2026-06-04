import Dialog from "@/components/Dialog/Dialog";
import { useModal } from "@/providers/modal/useModal";

const SelectSession = () => {
  const { closeModal } = useModal();

  return (
    <Dialog
      type="alert"
      title="Select Session"
      subtitle="At least one session must be selected at all times."
      buttons={{
        onContinue: {
          label: "Okay",
          action: () => {
            closeModal();
          },
        },
      }}
    />
  );
};

export default SelectSession;