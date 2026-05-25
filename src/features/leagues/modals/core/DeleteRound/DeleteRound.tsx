import Dialog from "@/components/Dialog/Dialog";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import { useDeleteEventsByRoundId } from "@/rtkQuery/hooks/mutations/useEventMutaion";

import { useDeleteRoundMutation } from "@/rtkQuery/API/roundApi";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { withMinDelay } from "@/utils/withMinDelay";
import { useState } from "react";

type DeleteRoundProps = {
  roundId: string;
};

const DeleteRound = ({ roundId }: DeleteRoundProps) => {
    const { openModal, closeModal } = useModal();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [deleteEventsByRoundId] = useDeleteEventsByRoundId();
    const [deleteRound] = useDeleteRoundMutation();

    const handleDeleteRound = async () => {
        try {
            setIsLoading(true);
            const result = await withMinDelay(
              (async () => {
                const deletedEvents = await deleteEventsByRoundId(roundId).unwrap();

                if (!deletedEvents) {
                  throw new Error("Failed to delete round events.");
                }

                return deleteRound({ roundId }).unwrap();
              })(),
              1000,
            );
      
            if (!result) {
              throw new Error("Failed to delete the round.");
            }
      
            showToast({
              usage: "success",
              message: "Round has been deleted.",
            });
          } catch {
            handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
          } finally {
            setIsLoading(false);
            closeModal();
          }
    }
  return (
      <Dialog
        type="core"
        title={"Delete Round"}
        subtitle={"All events within this round will also be deleted."}
        buttons={{
          onCancel: {
            label: "Cancel",
            action: () => closeModal(),
          },
          onContinue: {
            label: "Delete Round",
            action: () => handleDeleteRound(),
            isDanger: true,
            loading: isLoading,
            loadingText: "Loading...",
          },
        }}
      />
  )
}

export default DeleteRound