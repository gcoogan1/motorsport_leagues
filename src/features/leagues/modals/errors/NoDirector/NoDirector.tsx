import Dialog from "@/components/Dialog/Dialog";
import { useModal } from "@/providers/modal/useModal";

type NoDirectorProps = {
  removeAttempt?: boolean;
};

const NoDirector = ({ removeAttempt }: NoDirectorProps) => {
  const { closeModal } = useModal();

  const subtitle = removeAttempt
    ? "Please assign another participant as a League Director before removing this participant."
    : "Please ensure there is at least one Director role assigned.";

  return (
    <Dialog
      type="alert"
      title="No League Director"
      subtitle={subtitle}
      buttons={{
        onContinue: {
          label: "Okay",
          action: () => closeModal(),
        },
      }}
    />
  );
};

export default NoDirector;
