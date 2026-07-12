import { useState } from "react";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import { withMinDelay } from "@/utils/withMinDelay";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import Dialog from "@/components/Dialog/Dialog";
import { useDeleteDecision } from "@/rtkQuery/hooks/mutations/useReportsMutation";

type DeleteDecisionProps = {
  decisionId: string;
};

const DeleteDecision = ({ decisionId }: DeleteDecisionProps) => {
  const { openModal, closeModal } = useModal();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [deleteDecision] = useDeleteDecision();



  const handleDelete = async () => {
    try {
      setIsLoading(true);

      await withMinDelay(
        deleteDecision(decisionId).unwrap(),
        1000,
      );

      showToast({
        usage: "success",
        message: "Decision has been deleted.",
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
      title="Delete Steward’s Decision"
      subtitle="Are you sure you want to delete this steward’s decision?"
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

export default DeleteDecision;
