import { useState } from "react";
import { useDispatch } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type AppDispatch } from "@/store";
import { useModal } from "@/providers/modal/useModal";
import { withMinDelay } from "@/utils/withMinDelay";
import { updateSquadDraft } from "@/store/squads/squad.slice";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import SquadIcon from "@assets/Icon/Squad.svg?react";
import FormBlock from "@/components/Forms/FormBlock/FormBlock";
import TextInput from "@/components/Inputs/TextInput/TextInput";
import { createNameSchema, type CreateNameSchema } from "./nameSchema";
import { isSquadNameAvailable } from "@/services/squad.service";
import NameTaken from "@/features/squads/modals/errors/NameTaken/NameTaken";

type NameProps = {
  onSuccess: () => void;
  onBack: () => void;
};

const Name = ({ onSuccess, onBack }: NameProps) => {
  const { openModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  // -- Form setup -- //
  const formMethods = useForm<CreateNameSchema>({
    resolver: zodResolver(createNameSchema),
  });

  const {
    handleSubmit,
    formState: { errors },
  } = formMethods;

  // -- Handlers -- //
  const handleOnSubmit = async (data: CreateNameSchema) => {
    try {
      setIsLoading(true);

      const res = await withMinDelay(
        isSquadNameAvailable(data.name),
        1000,
      );

      if (!res) {
        openModal(<NameTaken />);
        return;
      }

      await withMinDelay(
        (async () => {
          dispatch(
            updateSquadDraft({
              squad_name: data.name,
            }),
          );
        })(),
        1000,
      );

      onSuccess();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // General error handling
      handleSupabaseError({ code: error?.code ?? "SERVER_ERROR" }, openModal);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnBack = () => {
    onBack();
  };
  return (
    <FormProvider {...formMethods}>
      <FormBlock
        title={"Create new Squad"}
        question={"What is the name of your Squad?"}
        onSubmit={handleSubmit(handleOnSubmit)}
        buttons={{
          onCancel: {
            label: "Back",
            action: handleOnBack,
          },
          onContinue: {
            label: "Continue",
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
          placeholder="e.g. Victory Racing Team, Speedy Racers, etc."
          hasError={!!errors.name}
          errorMessage={errors.name?.message}
        />
      </FormBlock>
    </FormProvider>
  );
};

export default Name;
