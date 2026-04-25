import { useState } from "react";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import { withMinDelay } from "@/utils/withMinDelay";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import Dialog from "@/components/Dialog/Dialog";
import { useRemoveLeagueJoinRequest } from "@/hooks/rtkQuery/mutations/useLeagueMutation";

type RejectRequestProps = {
  requestId: string;
  leagueId: string;
};

const RejectRequest = ({ leagueId, requestId }: RejectRequestProps) => {
  const { openModal, closeModal } = useModal();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [removeLeagueJoinRequest] = useRemoveLeagueJoinRequest();

  const handleRejectRequest = async () => {
    try {
      setIsLoading(true);
      const result = await withMinDelay(
        removeLeagueJoinRequest({
          requestId,
          leagueId,
        }).unwrap(),
        1000,
      );

      if (!result.success) {
        throw new Error("Failed to reject request.");
      }

      showToast({
        usage: "success",
        message: "User’s request to join rejected.",
      });
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
      title={"Reject Request"}
      subtitle={"Are you sure you want to reject this user’s request?"}
      buttons={{
        onCancel: {
          label: "Cancel",
          action: () => closeModal(),
        },
        onContinue: {
          label: "Reject Request",
          action: () => handleRejectRequest(),
          isDanger: true,
          loading: isLoading,
          loadingText: "Loading...",
        },
      }}
    />
  );
};

export default RejectRequest;