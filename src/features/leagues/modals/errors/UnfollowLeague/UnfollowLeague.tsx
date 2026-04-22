import { useState } from "react";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import { withMinDelay } from "@/utils/withMinDelay";
import { useUnfollowLeague } from "@/hooks/rtkQuery/mutations/useLeagueMutation";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import Dialog from "@/components/Dialog/Dialog";

type UnfollowLeagueProps = {
  leagueId: string;
  accountId: string;
};

const UnfollowLeague = ({ leagueId, accountId }: UnfollowLeagueProps) => {
  const { openModal, closeModal } = useModal();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [unfollowLeague] = useUnfollowLeague();

  const handleUnfollow = async () => {
    try {
      setIsLoading(true);

      await withMinDelay(
        unfollowLeague({
          leagueId: leagueId,
          accountId: accountId,
        }).unwrap(),
        1000,
      );

      showToast({
        usage: "success",
        message: "No longer following this League.",
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
      title="Unfollow League"
      subtitle="Are you sure you want to unfollow this League?"
      buttons={{
        onCancel: { label: "Cancel", action: () => closeModal() },
        onContinue: {
          label: "Unfollow League",
          action: () => handleUnfollow(),
          loading: isLoading,
          isDanger: true,
          loadingText: "Loading...",
        },
      }}
    />
  );
};

export default UnfollowLeague;
