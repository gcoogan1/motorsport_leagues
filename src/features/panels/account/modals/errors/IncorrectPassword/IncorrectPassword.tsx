import Dialog from "@/components/Dialog/Dialog";
import { useModal } from "@/providers/modal/ModalProvider";

const IncorrectPassword = () => {
  const { closeModal } = useModal();

  return (
    <Dialog
      type="alert"
      title="Incorrect Password"
      subtitle="Your current password is incorrect. Try again or log out to reset your password.."
      buttons={{
        onCancel: {
          label: "Okay",
          action: () => {
            closeModal();
          },
        },
      }}
    />
  );
};

export default IncorrectPassword;
