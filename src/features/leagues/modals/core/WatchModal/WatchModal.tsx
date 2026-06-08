
import { useModal } from '@/providers/modal/useModal';
import FormModal from '@/components/Forms/FormModal/FormModal';
import ReadOnlyInput from '@/components/Inputs/ReadOnlyInput/ReadOnlyInput';
import ExternalIcon from "@assets/Icon//External.svg?react";

type WatchModalProps = {
  broadcastUrl?: string;
}

const WatchModal = ({ broadcastUrl }: WatchModalProps) => {

  const { closeModal } = useModal();

  const handleOnClose = () => {
    closeModal();
  }

  const handleContinue = () => {
  if (!broadcastUrl) return;

  const url = broadcastUrl.startsWith("http")
    ? broadcastUrl
    : `https://${broadcastUrl}`;

  window.open(url, "_blank", "noopener,noreferrer");
};

  return (
    <FormModal
      question={'Watch Broadcast'}
      helperMessage='You’ll be redirected to the following link...'
      buttons={{
          onCancel: { label: "Close", action: handleOnClose },
          onContinue: {
            label: "Continue",
            rightIcon: <ExternalIcon />,
            action: handleContinue,
          },
        }}
      >
        <ReadOnlyInput 
          label="Stream Link"
          textValue={broadcastUrl}
        />
      </FormModal>
  );
};

export default WatchModal;