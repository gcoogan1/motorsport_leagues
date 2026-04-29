import { useState } from "react";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import { withMinDelay } from "@/utils/withMinDelay";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { useRemoveLeagueParticipant } from "@/rtkQuery/hooks/mutations/useLeagueMutation";
import Dialog from "@/components/Dialog/Dialog";

type LeaveLeagueProps = {
  profileId: string;
  leagueId: string;
};

const LeaveLeague = ({ leagueId, profileId }: LeaveLeagueProps) => {
  const { openModal, closeModal } = useModal();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [removeLeagueParticipant] = useRemoveLeagueParticipant();

  const handleLeaveLeague = async () => {
    try {
      setIsLoading(true);
      const result = await withMinDelay(
        removeLeagueParticipant({
          profileId,
          leagueId,
        }).unwrap(),
        1000,
      );

      if (!result.success) {
        throw new Error("Failed to leave the League.");
      }

      showToast({
        usage: "success",
        message: "You’ve left the League.",
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
      title={"Leave League"}
      subtitle={"Are you sure you want to leave this League?"}
      buttons={{
        onCancel: {
          label: "Cancel",
          action: () => closeModal(),
        },
        onContinue: {
          label: "Leave League",
          action: () => handleLeaveLeague(),
          isDanger: true,
          loading: isLoading,
          loadingText: "Loading...",
        },
      }}
    />
  );
};

export default LeaveLeague;