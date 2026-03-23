import { useState } from "react";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import { withMinDelay } from "@/utils/withMinDelay";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { useRemoveMemberFromSquad } from "@/hooks/rtkQuery/mutations/useSquadMutation";
import Dialog from "@/components/Dialog/Dialog";

type RemoveSquadMemberProps = {
  squadId: string;
  profileId: string;
};

const RemoveSquadMember = ({ squadId, profileId }: RemoveSquadMemberProps) => {
  const { openModal, closeModal } = useModal();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [removeSquadMember] = useRemoveMemberFromSquad();

  const handleRemoveSquadMember = async () => {
    try {
      setIsLoading(true);
      const res = await withMinDelay(
        removeSquadMember({
          squadId,
          profileId,
        }).unwrap(),
        1000,
      );

      if (!res.success) {
        throw new Error("Failed to leave squad");
      }
      showToast({
        usage: "success",
        message: "Member removed from Squad.",
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
      title={"Remove Member"}
      subtitle={"This Member will be removed from this Squad."}
      buttons={{
        onCancel: {
          label: "Cancel",
          action: () => closeModal(),
        },
        onContinue: {
          label: "Remove Member",
          action: () => handleRemoveSquadMember(),
          isDanger: true,
          loading: isLoading,
          loadingText: "Loading...",
        },
      }}
    />
  );
};

export default RemoveSquadMember;
