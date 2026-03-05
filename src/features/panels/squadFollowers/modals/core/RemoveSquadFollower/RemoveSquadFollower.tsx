import { useState } from "react";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import { withMinDelay } from "@/utils/withMinDelay";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import Dialog from "@/components/Dialog/Dialog";
import { useRemoveSquadFollowerMutation } from "@/store/rtkQueryAPI/squadApi";

type RemoveSquadFollowerProps = {
  followerProfileId: string;
  currentSquadId: string;
};

const RemoveSquadFollower = ({ followerProfileId, currentSquadId }: RemoveSquadFollowerProps) => {
  const { openModal, closeModal } = useModal();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [removeSquadFollower] = useRemoveSquadFollowerMutation();

  const handleUnfollow = async () => {
    try {
      setIsLoading(true);

      await withMinDelay(
        removeSquadFollower({
          squadId: currentSquadId,
          followerProfileId: followerProfileId,
        }).unwrap(),
        1000,
      );

      showToast({
        usage: "success",
        message: "Follower removed.",
      });
      closeModal();
    } catch {
      handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      type="core"
      title="Remove Follower"
      subtitle="This Profile will no longer be in the Squad’s Followers list. The user will not be notified of this change."
      buttons={{
        onCancel: { label: "Cancel", action: () => closeModal() },
        onContinue: {
          label: "Remove Follower",
          action: () => handleUnfollow(),
          loading: isLoading,
          isDanger: true,
          loadingText: "Loading...",
        },
      }}
    />
  );
};

export default RemoveSquadFollower;
