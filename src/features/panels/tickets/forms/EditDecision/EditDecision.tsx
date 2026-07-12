import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import FormModal from "@/components/Forms/FormModal/FormModal";
import ProfileSelectInput from "@/components/Inputs/ProfileSelectInput/ProfileSelectInput";
import TextInput from "@/components/Inputs/TextInput/TextInput";
import TextAreaInput from "@/components/Inputs/TextAreaInput/TextAreaInput";
import {
  editDecisionSchema,
  type EditDecisionSchema,
} from "./editDecision.schema";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { withMinDelay } from "@/utils/withMinDelay";
import { useUpdateDecision } from "@/rtkQuery/hooks/mutations/useReportsMutation";

type EditDecisionProps = {
  decisionId: string;
  seasonId: string;
  seasonName: string;
  ticketNum: number;
  incidentTitle: string;
  decisionSummary: string;
  detailedReasoning: string;
  offendingDriver: {
    id: string;
    username: string;
    avatarType: "preset" | "upload";
    avatarValue: string;
  };
};

const EditDecision = ({
  decisionId,
  seasonId,
  seasonName,
  ticketNum,
  incidentTitle,
  decisionSummary,
  detailedReasoning,
  offendingDriver,
}: EditDecisionProps) => {
  const { openModal, closeModal } = useModal();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [updateDecision] = useUpdateDecision();

  // Form setup -- //
  const formMethods = useForm<EditDecisionSchema>({
    resolver: zodResolver(editDecisionSchema),
    defaultValues: {
      offendingDriver: offendingDriver.username,
      incidentTitle: incidentTitle,
      decisionSummary: decisionSummary,
      detailedReasoning: detailedReasoning,
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = formMethods;

  // -- Handlers -- //
  const handleOnCancel = () => {
    closeModal();
  };

  const handleOnSubmit = async (data: EditDecisionSchema) => {
    try {
      setIsLoading(true);
      await withMinDelay(
        updateDecision({
          decisionId,
          seasonId,
          offendingDriverId: offendingDriver.id,
          incidentTitle: data.incidentTitle,
          decisionSummary: data.decisionSummary,
          detailedReasoning: data.detailedReasoning,
        }).unwrap(),
        1000,
      );
        
      showToast({
        usage: "success",
        message: "Decision has been edited.",
      });
      closeModal();
    } catch {
      handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <FormModal
        question={`Decision for Ticket #${ticketNum}`}
        helperMessage={seasonName}
        onSubmit={handleSubmit(handleOnSubmit)}
        buttons={{
          onCancel: {
            label: "Cancel",
            action: handleOnCancel,
          },
          onContinue: {
            label: "Save",
            loading: isLoading,
            loadingText: "Loading...",
          },
        }}
      >
        <ProfileSelectInput
          name="offendingDriver"
          fieldLabel="Offending Driver"
          type="driver"
          profiles={[
            {
              label: offendingDriver.username,
              value: offendingDriver.username,
              avatar: {
                avatarType: offendingDriver.avatarType,
                avatarValue: offendingDriver.avatarValue,
              },
            },
          ]}
        />
        <TextInput
          label="Incident Title"
          name="incidentTitle"
          placeholder="e.g. “Driver #99 Impeded Driver #98”, etc."
          showCounter
          maxLength={120}
          hasError={!!errors.incidentTitle}
          errorMessage={errors.incidentTitle?.message}
        />
        <TextInput
          label="Decision Summary"
          name="decisionSummary"
          placeholder="e.g. “5 Place Grid Drop”, etc."
          showCounter
          maxLength={120}
          hasError={!!errors.decisionSummary}
          errorMessage={errors.decisionSummary?.message}
        />
        <TextAreaInput
          label="Detailed Reasoning"
          name="detailedReasoning"
          placeholder="e.g. “The stewards review the footage...”, etc."
          showCounter
          maxLength={2000}
          hasError={!!errors.detailedReasoning}
          errorMessage={errors.detailedReasoning?.message}
        />
      </FormModal>
    </FormProvider>
  );
};

export default EditDecision;
