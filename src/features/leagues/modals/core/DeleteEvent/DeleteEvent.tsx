import Dialog from "@/components/Dialog/Dialog";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import { useDeleteEvent } from "@/rtkQuery/hooks/mutations/useEventMutaion";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { withMinDelay } from "@/utils/withMinDelay";
import { useState } from "react";

type DeleteEventProps = {
  eventId: string;
};

const DeleteEvent = ({ eventId }: DeleteEventProps) => {
    const { openModal, closeModal } = useModal();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [deleteEvent] = useDeleteEvent();

    const handleDeleteEvent = async () => {
        try {
            setIsLoading(true);
            const result = await withMinDelay(
              (async () => {
                return deleteEvent({ eventId }).unwrap();
              })(),
              1000,
            );
      
            if (!result) {
              throw new Error("Failed to delete the event.");
            }
      
            showToast({
              usage: "success",
              message: "Event has been deleted.",
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
        title={"Delete Event"}
        subtitle={"All information within this Event will be deleted."}
        buttons={{
          onCancel: {
            label: "Cancel",
            action: () => closeModal(),
          },
          onContinue: {
            label: "Delete Event",
            action: () => handleDeleteEvent(),
            isDanger: true,
            loading: isLoading,
            loadingText: "Loading...",
          },
        }}
      />
  )
}

export default DeleteEvent;