import { useModal } from "@/providers/modal/useModal";
import Dialog from "@/components/Dialog/Dialog";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { useRemoveMemberFromSquad } from "@/hooks/rtkQuery/mutations/useSquadMutation";
import { withMinDelay } from "@/utils/withMinDelay";
import { useToast } from "@/providers/toast/useToast";
import { navigate } from "@/app/navigation/navigation";
import { useState } from "react";

type LeaveSquadProps = {
  squadId: string;
  profileId: string;
};

const LeaveSquad = ({ squadId, profileId }: LeaveSquadProps) => {
  const { openModal, closeModal } = useModal();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [removeSquadMember] = useRemoveMemberFromSquad();

  const handleLeaveSquad = async () => {
      try {
      setIsLoading(true);
      await withMinDelay(
        removeSquadMember({
          squadId,
          profileId,
        }).unwrap(),
        1000,
      );

    navigate(`/profile/${profileId}`);
    showToast({
        usage: "success",
        message: "You’ve left the Squad.",
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
      title={'Leave Squad'}
      subtitle={'Are you sure you want to leave this Squad?'}
      buttons={{
        onCancel: {
          label: "Cancel",
          action: () => closeModal(),
        },
        onContinue: {
          label: "Leave Squad",
          action: () => handleLeaveSquad(),
          isDanger: true,
          loading: isLoading,
          loadingText: "Loading...",
        },
      }}
    />
  );
};

export default LeaveSquad;