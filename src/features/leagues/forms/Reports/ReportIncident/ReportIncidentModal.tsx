import { useState } from "react";
import { FormProvider, useForm, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import FormModal from "@/components/Forms/FormModal/FormModal";
import { useCreateTicket } from "@/rtkQuery/hooks/mutations/useReportsMutation";
import FilterBar from "@/components/Tabs/FilterBar/FilterBar";
import ProfileSelectInput from "@/components/Inputs/ProfileSelectInput/ProfileSelectInput";
import RichTextEditor from "@/components/Inputs/RichTextEditor/RichTextEditor";
import { useLeagueSeasonDrivers } from "@/rtkQuery/hooks/queries/useLeagueSeasons";
import { convertDriversToSelectOptions } from "@/utils/convertDriversToSelectOptions";
import {
  createTicketSchema,
  type CreateTicketSchema,
} from "./ReportIncident.schema";

type ReportIncidentModalProps = {
  roundId: string;
  seasonId: string;
  seasonName: string;
};

const ReportIncidentModal = ({
  roundId,
  seasonId,
  seasonName,
}: ReportIncidentModalProps) => {
  const { closeModal } = useModal();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [createTicket] = useCreateTicket();
  const { data: seasonDrivers } = useLeagueSeasonDrivers(seasonId);

  const profiles = convertDriversToSelectOptions(seasonDrivers || []);

  console.log(seasonDrivers);

  // Form setup -- //
  const formMethods = useForm<CreateTicketSchema>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      offendingDriver: "",
      description: "",
    },
  });

  const {
    handleSubmit,
    watch,
    setValue,
  } = formMethods;

  const { errors } = useFormState({ control: formMethods.control });

  // -- Handlers -- //
  const handleOnCancel = () => {
    closeModal();
  };
  const handleOnSubmit = async (data: CreateTicketSchema) => {
    setIsLoading(true);
    try {
      // await createTicket({ roundId, seasonId, ...data });
      showToast({
        usage: "success",
        message: "Incident report submitted successfully.",
      });
      closeModal();
    } catch {
      showToast({
        usage: "error",
        message: "Failed to submit incident report. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <FormModal 
        question={"Report Incident"} 
        helperMessage="Use this form to report an incident."
        onSubmit={handleSubmit(handleOnSubmit)}
        buttons={{
          onCancel: {
            label: "Cancel",
            action: handleOnCancel,
          },
          onContinue: {
            label: "Report",
            loading: isLoading,
            loadingText: "Loading...",
          },
        }}
      >
      <FilterBar divisions={[]} rounds={[]} events={[]} sessions={[]}        
      />
      <ProfileSelectInput
        name="offendingDriver"
        fieldLabel="Offending Driver" 
        type={"profile"}
        profiles={profiles}
        placeholder="Select driver..."    
        hasError={!!errors.offendingDriver}
        errorMessage={errors.offendingDriver?.message}
      />
      <RichTextEditor
        value={watch("description")}
        onChange={(html) => setValue("description", html)}
        hasError={!!errors.description}
        errorMessage={errors.description?.message}
        label="Incident Description"
        placeholder="Describe the incident with all the details..."
        maxCharacters={2000}
        showCount={true}
      />
      </FormModal>
    </FormProvider>
  );
};

export default ReportIncidentModal;
