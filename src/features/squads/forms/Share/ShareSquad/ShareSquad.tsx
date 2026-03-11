
import { useState } from 'react';
import { useToast } from "@/providers/toast/useToast"
import { useModal } from '@/providers/modal/useModal';
import { handleSupabaseError } from '@/utils/handleSupabaseErrors';
import FormModal from '@/components/Forms/FormModal/FormModal';
import ReadOnlyInput from '@/components/Inputs/ReadOnlyInput/ReadOnlyInput';
import LinkIcon from "@assets/Icon/Link.svg?react";

type ShareSquadProps = {
  squadUrl: string;
  onClose: () => void;
}

const ShareSquad = ({ squadUrl, onClose }: ShareSquadProps) => {

  const { showToast } = useToast();
  const { openModal } = useModal();
  const [, setCopied] = useState(false);

  const handleOnClose = () => {
    onClose();
  }

  const handleShareUrl = () => {
    try {
      navigator.clipboard.writeText(squadUrl);
      setCopied(true);

      
      // Reset after 4 seconds
      setTimeout(() => setCopied(false), 4000); 
    } catch {
      handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
    }
    showToast({ usage: "success", message: "Link copied." });
    return
  }

  return (
    <FormModal
      question={'Share Squad'}
      helperMessage='Send a link to view this Squad.'
      buttons={{
          onCancel: { label: "Close", action: handleOnClose },
          onContinue: {
            label: "Copy Link",
            leftIcon: <LinkIcon />,
            action: handleShareUrl,
          },
        }}
      >
        <ReadOnlyInput 
          label="Copy Link"
          textValue={squadUrl}
        />
      </FormModal>
  )
}

export default ShareSquad