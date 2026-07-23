import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import FormModal from "@/components/Forms/FormModal/FormModal";
import ProfileSelectInput from "@/components/Inputs/ProfileSelectInput/ProfileSelectInput";
import TextInput from "@/components/Inputs/TextInput/TextInput";
import TextAreaInput from "@/components/Inputs/TextAreaInput/TextAreaInput";
import Button from "@/components/Button/Button";
import DeleteTicket from "../../modals/chore/DeleteTicket/DeleteTicket";
import TrashIcon from "@assets/Icon/Delete.svg?react";
import {
  resolveTicketSchema,
  type ResolveTicketSchema,
} from "./resolveTicket.schema";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { withMinDelay } from "@/utils/withMinDelay";
import { useCreateDecision } from "@/rtkQuery/hooks/mutations/useReportsMutation";
import type { Tag } from "@/components/Tags/Tags.variants";

type ResolveTicketProps = {
  ticketId: string;
  seasonId: string;
  ticketNum: number;
  stewardId: string;
  eventId: string;
  eventName: string;
  sessionType: string;
  offendingDriver: {
    id: string;
    username: string;
    avatarType: "preset" | "upload";
    avatarValue: string;
    tags?: Tag[];
  };
};

const ResolveTicket = ({
  ticketId,
  seasonId,
  ticketNum,
  stewardId,
  eventId,
  eventName,
  sessionType,
  offendingDriver,
}: ResolveTicketProps) => {
  const { openModal, closeModal } = useModal();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [createDecision] = useCreateDecision();

  // Form setup -- //
  const formMethods = useForm<ResolveTicketSchema>({
    resolver: zodResolver(resolveTicketSchema),
    defaultValues: {
      offendingDriver: offendingDriver.username,
      incidentTitle: "",
      decisionSummary: "",
      detailedReasoning: "",
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

  const handleDeleteTicket = () => {
    // Handle delete ticket action
    closeModal();
    return openModal(<DeleteTicket ticketId={ticketId} />);
  };

  const handleOnSubmit = async (data: ResolveTicketSchema) => {
    try {
      setIsLoading(true);
      await withMinDelay(
        createDecision({
          ticketId: ticketId,
          ticketNum: ticketNum,
          offendingDriverId: offendingDriver.id,
          stewardId: stewardId,
          seasonId: seasonId,
          incidentTitle: data.incidentTitle,
          decisionSummary: data.decisionSummary,
          detailedReasoning: data.detailedReasoning,
          eventId: eventId,
          eventName: eventName,
          sessionType: sessionType,
        }).unwrap(),
        1000,
      );
        
      showToast({
        usage: "success",
        message: "Ticket has been resolved.",
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
        question={`Resolve Ticket #${ticketNum}`}
        helperMessage="Use this form to resolve the ticket."
        onSubmit={handleSubmit(handleOnSubmit)}
        buttons={{
          onCancel: {
            label: "Cancel",
            action: handleOnCancel,
          },
          onContinue: {
            label: "Resolve",
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
              tags: offendingDriver.tags,
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
        <div style={{ alignSelf: "center" }}>
          <Button
            color="danger"
            variant="outlined"
            icon={{ left: <TrashIcon /> }}
            onClick={handleDeleteTicket}
          >
            Delete Ticket
          </Button>
        </div>
      </FormModal>
    </FormProvider>
  );
};

export default ResolveTicket;
