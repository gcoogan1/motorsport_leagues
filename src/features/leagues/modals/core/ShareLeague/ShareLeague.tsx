
import { useState } from 'react';
import { useToast } from "@/providers/toast/useToast"
import { useModal } from '@/providers/modal/useModal';
import { handleSupabaseError } from '@/utils/handleSupabaseErrors';
import FormModal from '@/components/Forms/FormModal/FormModal';
import ReadOnlyInput from '@/components/Inputs/ReadOnlyInput/ReadOnlyInput';
import LinkIcon from "@assets/Icon/Link.svg?react";

type ShareLeagueProps = {
  leagueUrl: string;
  onClose: () => void;
}

const ShareLeague = ({ leagueUrl, onClose }: ShareLeagueProps) => {

  const { showToast } = useToast();
  const { openModal } = useModal();
  const [, setCopied] = useState(false);

  const handleOnClose = () => {
    onClose();
  }

  const handleShareUrl = () => {
    try {
      navigator.clipboard.writeText(leagueUrl);
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
      question={'Share League'}
      helperMessage='Send a link to view this League.'
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
          textValue={leagueUrl}
        />
      </FormModal>
  )
}

export default ShareLeague