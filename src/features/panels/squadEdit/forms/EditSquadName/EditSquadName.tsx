
import { useDispatch, useSelector } from "react-redux";
import { useForm, FormProvider } from "react-hook-form";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import { isSquadNameAvailable } from "@/services/squad/squad.service";
import type { AppDispatch, RootState } from "@/store";
import { editSquadNameThunk } from "@/store/squads/squad.thunk";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { withMinDelay } from "@/utils/withMinDelay";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import FormModal from "@/components/Forms/FormModal/FormModal";
import TextInput from "@/components/Inputs/TextInput/TextInput";
import SquadIcon from "@assets/Icon/Squad.svg?react";
import { editSquadNameSchema, type EditSquadNameSchema } from "./editSquadName.schema";

const EditSquadName = () => {
  const { openModal, closeModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { showToast } = useToast();
  const currentSquad = useSelector(
      (state: RootState) => state.squad.currentSquad,
    );


  // -- Form setup -- //
  const formMethods = useForm<EditSquadNameSchema>({
    resolver: zodResolver(editSquadNameSchema),
    defaultValues: {
      name: currentSquad?.squad_name || "",
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = formMethods;

  if (!currentSquad) return null;

  // -- Handlers -- //
  const handleOnSubmit = async (data: EditSquadNameSchema) => {
    try {
      setIsLoading(true);

      const res = await withMinDelay(
        isSquadNameAvailable(data.name, currentSquad.id),
        1000,
      );

      if (!res) {
        handleSupabaseError({ code: "NAME_TAKEN" }, openModal);
        return;
      }

      await withMinDelay(
        (async () => {
          dispatch(
            editSquadNameThunk({
              squadId: currentSquad?.id,
              newSquadName: data.name,
            }),
          );
        })(),
        1000,
      );

      // Show success toast on success
      showToast({
        usage: "success",
        message: "Squad Name updated.",
      });
      closeModal();
    } catch {
      // General error handling
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
        question={"Edit Squad Name"}
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
          name={"name"}
          label={"Squad Name"}
          maxLength={64}
          showCounter
          icon={<SquadIcon />}
          hasError={!!errors.name}
          errorMessage={errors.name?.message}
        />
      </FormModal>
    </FormProvider>
  );
}

export default EditSquadName