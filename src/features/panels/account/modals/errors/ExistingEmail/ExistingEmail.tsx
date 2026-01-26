import Dialog from "@/components/Dialog/Dialog";
import { useModal } from "@/providers/modal/useModal";

const ExistingEmail = () => {
  const { closeModal } = useModal();

  return (
    <Dialog
      type="alert"
      title="Existing Account"
      subtitle="An account already exists with this email."
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

export default ExistingEmail;
