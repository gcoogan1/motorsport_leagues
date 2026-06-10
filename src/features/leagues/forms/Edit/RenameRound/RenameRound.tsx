import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/providers/toast/useToast";
import { useModal } from "@/providers/modal/useModal";
import { withMinDelay } from "@/utils/withMinDelay";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import FormModal from "@/components/Forms/FormModal/FormModal";
import TextInput from "@/components/Inputs/TextInput/TextInput";
import { updateRoundNameSchema, type UpdateRoundNameSchema } from "./RenameRound.schema";
import { useUpdateRound } from "@/rtkQuery/hooks/mutations/useRoundMutation";


type RenameRoundProps = {
  roundId: string;
  currentRoundName: string;
};

const RenameRound = ({ roundId, currentRoundName }: RenameRoundProps) => {
  const { openModal, closeModal } = useModal();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [updateRound] = useUpdateRound();


  //  - Form setup -- //
  const formMethods = useForm<UpdateRoundNameSchema>({
    resolver: zodResolver(updateRoundNameSchema),
    defaultValues: {
      roundName: currentRoundName,
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = formMethods;

  // - Handlers -- //

  const handleOnSubmit = async (data: UpdateRoundNameSchema) => {
    setIsLoading(true);
    try {


      await withMinDelay(
        updateRound({ roundId, ...data }),
        1000,
      );

      // Show success toast on success
      showToast({
        usage: "success",
        message: "Round name has been updated.",
      });
      closeModal();
    } catch {
      handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnCancel = () => {
    closeModal();
  };

  return (
    <FormProvider {...formMethods}>
      <FormModal
        question={"Rename Round"}
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
        <TextInput
          name={"roundName"}
          type="text"
          label={"Round Name"}
          hasError={!!errors.roundName}
          errorMessage={errors.roundName?.message}
          showCounter
          maxLength={24}
        />
      </FormModal>
    </FormProvider>
  );
};

export default RenameRound;
