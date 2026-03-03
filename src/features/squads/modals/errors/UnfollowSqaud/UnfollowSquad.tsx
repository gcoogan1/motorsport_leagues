import { useState } from "react";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import { withMinDelay } from "@/utils/withMinDelay";
import { useUnfollowSquad } from "@/hooks/rtkQuery/mutations/useSquadMutation";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import Dialog from "@/components/Dialog/Dialog";

type UnfollowSquadProps = {
  squadId: string;
  accountId: string;
};

const UnfollowSquad = ({ squadId, accountId }: UnfollowSquadProps) => {
  const { openModal, closeModal } = useModal();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [unfollowSquad] = useUnfollowSquad();

  const handleUnfollow = async () => {
    try {
      setIsLoading(true);

      await withMinDelay(
        unfollowSquad({
          squadId: squadId,
          accountId: accountId,
        }).unwrap(),
        1000,
      );

      showToast({
        usage: "success",
        message: "No longer following this Squad.",
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
      type="alert"
      title="Unfollow Squad"
      subtitle="Are you sure you want to unfollow this Squad?"
      buttons={{
        onCancel: { label: "Cancel", action: () => closeModal() },
        onContinue: {
          label: "Unfollow Squad",
          action: () => handleUnfollow(),
          loading: isLoading,
          isDanger: true,
          loadingText: "Loading...",
        },
      }}
    />
  );
};

export default UnfollowSquad;
