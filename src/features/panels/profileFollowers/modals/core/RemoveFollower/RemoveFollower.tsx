import { useState } from "react";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import { withMinDelay } from "@/utils/withMinDelay";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { useRemoveFollowerMutation } from "@/store/rtkQueryAPI/profileApi";
import Dialog from "@/components/Dialog/Dialog";

type RemoveFollowerProps = {
  followerProfileId: string;
  currentProfileId: string;
};

const RemoveFollower = ({ followerProfileId, currentProfileId }: RemoveFollowerProps) => {
  const { openModal, closeModal } = useModal();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [removeFollower] = useRemoveFollowerMutation();

  const handleUnfollow = async () => {
    try {
      setIsLoading(true);

      await withMinDelay(
        removeFollower({
          followerProfileId: followerProfileId,
          currentProfileId: currentProfileId,
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
      subtitle="This Profile will no longer be in your Followers list. The user will not be notified of this change."
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

export default RemoveFollower;
