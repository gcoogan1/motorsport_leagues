import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { navigate } from "@/app/navigation/navigation";
import { withMinDelay } from "@/utils/withMinDelay";
import TextInput from "@/components/Inputs/TextInput/TextInput.tsx";
import FormModal from "@/components/Forms/FormModal/FormModal";
import {
  confirmDeleteSeasonSchema,
  type ConfirmDeleteSeasonSchema,
} from "./confirmDeleteSeason.schema";
import { useRemoveLeagueSeason } from "@/rtkQuery/hooks/mutations/useLeagueMutation";

type DeleteSeasonProps = {
  seasonId: string;
  leagueId: string;
};

const DeleteSeason = ({ seasonId, leagueId }: DeleteSeasonProps) => {
  const { openModal, closeModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const [removeLeagueSeason] = useRemoveLeagueSeason();

  // -- Form setup -- //
  const formMethods = useForm<ConfirmDeleteSeasonSchema>({
    resolver: zodResolver(confirmDeleteSeasonSchema),
    defaultValues: {
      confirmation: "",
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = formMethods;

  if (!seasonId) return null;

  // -- Handlers -- //
  const handleOnSubmit = async () => {
    setIsLoading(true);
    try {
      const result = await withMinDelay(
        removeLeagueSeason({
          seasonId,
        }).unwrap(),
        1000,
      );

      if (!result.success) {
        throw new Error("Failed to delete season. Please try again.");
      }

      navigate(`/league/${leagueId}`);
      closeModal();
      showToast({
        usage: "success",
        message: "Previous Season has been deleted.",
      });
      return;
    } catch {
      handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <FormModal
        question={"Delete Season"}
        helperMessage={
          <>
            This entire Season will be deleted and unrecoverable. All data that
            has been stored in this Season will also be deleted and become
            unrecoverable.
            <br />
            <br />
            <strong>Please type “delete season” below to confirm.</strong>
          </>
        }
        onSubmit={handleSubmit(handleOnSubmit)}
        buttons={{
          onCancel: { label: "Cancel", action: closeModal },
          onContinue: {
            label: "Delete Season",
            loading: isLoading,
            loadingText: "Loading...",
            isDanger: true,
          },
        }}
      >
        <TextInput
          name={"confirmation"}
          label={"Confirm Deletion"}
          hasError={!!errors.confirmation}
          errorMessage={errors.confirmation?.message}
          placeholder={'"delete season"'}
        />
      </FormModal>
    </FormProvider>
  );
};

export default DeleteSeason;
