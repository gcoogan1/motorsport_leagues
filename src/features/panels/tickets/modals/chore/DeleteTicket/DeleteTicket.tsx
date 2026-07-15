import { useState } from "react";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import { withMinDelay } from "@/utils/withMinDelay";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import Dialog from "@/components/Dialog/Dialog";
import { useDeleteTicket } from "@/rtkQuery/hooks/mutations/useReportsMutation";

type DeleteTicketProps = {
  ticketId: string;
};

const DeleteTicket = ({ ticketId }: DeleteTicketProps) => {
  const { openModal, closeModal } = useModal();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [deleteTicket] = useDeleteTicket();



  const handleDelete = async () => {
    try {
      setIsLoading(true);

      await withMinDelay(
        deleteTicket(ticketId).unwrap(),
        1000,
      );

      showToast({
        usage: "success",
        message: "Ticket has been deleted.",
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
      title="Delete Ticket"
      subtitle="Are you sure you want to delete this incident report?"
      buttons={{
        onCancel: { label: "Cancel", action: () => closeModal() },
        onContinue: {
          label: "Delete",
          action: () => handleDelete(),
          loading: isLoading,
          isDanger: true,
          loadingText: "Loading...",
        },
      }}
    />
  );
};

export default DeleteTicket;
