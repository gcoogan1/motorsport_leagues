import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AppDispatch, RootState } from "@/store";
import { updateLeagueDraft } from "@/store/leagues/league.slice";
import { useModal } from "@/providers/modal/useModal";
import { withMinDelay } from "@/utils/withMinDelay";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import FormBlock from "@/components/Forms/FormBlock/FormBlock";
import { coverFormSchema, type CoverFormValues } from "./coverFormSchema";
import SelectGraphicInput from "@/components/Inputs/SelectGraphicInput/SelectGraphicInput";
import ImageUploadInput from "@/components/Inputs/ImageUploadInput/ImageUploadInput";

type CoverFormProps = {
  onBack: () => void;
  onSuccess?: () => void;
};

const CoverForm = ({ onBack, onSuccess }: CoverFormProps) => {
  const { openModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const draft = useSelector((state: RootState) => state.league.draft);

  // -- Form setup -- //
  const formMethods = useForm<CoverFormValues>({
    resolver: zodResolver(coverFormSchema),
    defaultValues: {
      cover: draft.cover_image ?? { type: "preset", variant: "cover1" },
      themeColor: draft.theme_color ?? "yellow",
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = formMethods;

  // -- Handlers -- //
  const handleOnSubmit = async (data: CoverFormValues) => {
    try {
      setIsLoading(true);

      await withMinDelay(
        (async () => {
          dispatch(
            updateLeagueDraft({
              cover_image: data.cover,  
              theme_color: data.themeColor,
            }),
          );
        })(),
        1000,
      );

      onSuccess?.();
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
        title="Create New League"
        question="Customize Your League"
        onSubmit={handleSubmit(handleOnSubmit)}
        buttons={{
          onCancel: { label: "Back", action: handleOnBack },
          onContinue: {
            label: "Continue",
            loading: isLoading,
            loadingText: "Loading...",
          },
        }}
      >
        <ImageUploadInput
          name="cover"
          hasError={!!errors.cover}
          errorMessage={errors.cover?.message || "Image upload failed. Please try again."}
          helperMessage="JPG or PNG up to 5MB"
        />

        <SelectGraphicInput name="cover" label="Select Cover Image" />
        <SelectGraphicInput name="themeColor" label="Select Theme Color"  />
      </FormBlock>
    </FormProvider>
  );
};

export default CoverForm;
