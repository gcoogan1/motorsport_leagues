import { useState } from "react";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import { withMinDelay } from "@/utils/withMinDelay";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { useRemoveLeagueParticipant } from "@/hooks/rtkQuery/mutations/useLeagueMutation";
import Dialog from "@/components/Dialog/Dialog";

type RemoveParticipantProps = {
  profileId: string;
  leagueId: string;
};

const RemoveParticipant = ({ leagueId, profileId }: RemoveParticipantProps) => {
  const { openModal, closeModal } = useModal();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [removeLeagueParticipant] = useRemoveLeagueParticipant();

  const handleRemoveParticipant = async () => {
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
        throw new Error("Failed to remove participant.");
      }

      showToast({
        usage: "success",
        message: "Participant removed from League.",
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
      title={"Remove Participant"}
      subtitle={"Are you sure you want to remove this participant from the League?"}
      buttons={{
        onCancel: {
          label: "Cancel",
          action: () => closeModal(),
        },
        onContinue: {
          label: "Remove Participant",
          action: () => handleRemoveParticipant(),
          isDanger: true,
          loading: isLoading,
          loadingText: "Loading...",
        },
      }}
    />
  );
};

export default RemoveParticipant;