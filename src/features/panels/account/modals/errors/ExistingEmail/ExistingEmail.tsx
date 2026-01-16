import Dialog from "@/components/Dialog/Dialog";
import { useModal } from "@/providers/modal/ModalProvider";

const ExistingEmail = () => {
  const { closeModal } = useModal();

  return (
    <Dialog
      type="alert"
      title="Existing Account"
      subtitle="An account already exists with this email."
      buttons={{
        onCancel: {
          label: "Cancel",
          action: () => {
            closeModal();
          },
        },
      }}
    />
  );
};

export default ExistingEmail;
