import { useState } from "react";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import { withMinDelay } from "@/utils/withMinDelay";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { useRemoveLeagueInvite } from "@/rtkQuery/hooks/mutations/useLeagueMutation";
import Dialog from "@/components/Dialog/Dialog";

type CancelInviteProps = {
  inviteId: string;
  leagueId: string;
  onSuccess?: () => void;
};

const CancelInvite = ({
  leagueId,
  inviteId,
  onSuccess,
}: CancelInviteProps) => {
  const { openModal, closeModal } = useModal();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [removeLeagueInvite] = useRemoveLeagueInvite();

  const handleCancelInvite = async () => {
    try {
      setIsLoading(true);
      const result = await withMinDelay(
        removeLeagueInvite({
          inviteId,
          leagueId,
        }).unwrap(),
        1000,
      );

      if (!result.success) {
        throw new Error("Failed to cancel invite.");
      }

      showToast({
        usage: "success",
        message: "Invitation to user cancelled.",
      });

      onSuccess?.();
    } catch {
      handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
    } finally {
      setIsLoading(false);
      closeModal();
    }
  };

  return (
    <Dialog
      type="core"
      title={"Cancel Invite"}
      subtitle={"Are you sure you want to cancel the invitation to this user?"}
      buttons={{
        onCancel: {
          label: "Cancel",
          action: () => closeModal(),
        },
        onContinue: {
          label: "Yes, Cancel",
          action: () => handleCancelInvite(),
          isDanger: true,
          loading: isLoading,
          loadingText: "Loading...",
        },
      }}
    />
  );
};

export default CancelInvite;