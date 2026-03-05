import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { navigate } from "@/app/navigation/navigation";
import { withMinDelay } from "@/utils/withMinDelay";
import { type AppDispatch } from "@/store";
import { deleteSquadThunk } from "@/store/squads/squad.thunk";
import { selectCurrentSquad } from "@/store/squads/squad.selectors";
import TextInput from "@/components/Inputs/TextInput/TextInput.tsx";
import FormModal from "@/components/Forms/FormModal/FormModal";
import { confirmDeleteSquadSchema, type ConfirmDeleteSquadSchema } from "./confirmDeleteSquad.schmea";


type DeleteSquadProps = {
  closePanel?: () => void;
};

const DeleteSquad = ({ closePanel }: DeleteSquadProps) => {
  const { openModal, closeModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const dispatch = useDispatch<AppDispatch>();

  const currentSquad = useSelector(selectCurrentSquad);

  // -- Form setup -- //
  const formMethods = useForm<ConfirmDeleteSquadSchema>({
    resolver: zodResolver(confirmDeleteSquadSchema),
    defaultValues: {
      confirmation: "",
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = formMethods;

  if (!currentSquad) return null;

  // -- Handlers -- //
  const handleOnSubmit = async () => {
    setIsLoading(true);
    try {
      await withMinDelay(
        dispatch(deleteSquadThunk(currentSquad.id)).unwrap(),
        1000,
      );

      navigate("/");
      closeModal();
      if (closePanel) closePanel();
      showToast({
        usage: "success",
        message: "Squad deleted.",
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
        question={"Delete Squad"}
        helperMessage={
          <>
            Your entire Squad will be deleted and unrecoverable. All Leagues that are hosted by this Squad will also be deleted and become unrecoverable. 
            <br />
            <br />
            <strong>Please type “delete squad” below to confirm.</strong>
          </>
        }
        onSubmit={handleSubmit(handleOnSubmit)}
        buttons={{
          onCancel: { label: "Cancel", action: closeModal },
          onContinue: {
            label: "Delete Squad",
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
          placeholder={'"delete squad"'}
        />
      </FormModal>
    </FormProvider>
  );
};

export default DeleteSquad;
