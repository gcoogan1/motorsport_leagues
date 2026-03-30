import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import { type AppDispatch, type RootState } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { editBannerThunk } from "@/store/squads/squad.thunk";
import { withMinDelay } from "@/utils/withMinDelay";
import { clearSquadDraft } from "@/store/squads/squad.slice";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import ImageUploadInput from "@/components/Inputs/ImageUploadInput/ImageUploadInput";
import SelectGraphicInput from "@/components/Inputs/SelectGraphicInput/SelectGraphicInput";
import {
  editBannerFormSchema,
  type EditBannerFormValues,
} from "./editBanner.schema";
import FormModal from "@/components/Forms/FormModal/FormModal";
import type { SquadBanner } from "@/types/squad.types";

const EditBanner = () => {
  const { openModal, closeModal } = useModal();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const currentSquad = useSelector(
    (state: RootState) => state.squad.currentSquad,
  );
  const accountId = useSelector((state: RootState) => state.account.data?.id);

  const dispatch = useDispatch<AppDispatch>();

  // -- Form setup -- //
  const formMethods = useForm<EditBannerFormValues>({
    resolver: zodResolver(editBannerFormSchema),
    defaultValues: {
      banner: {
        type: "preset",
        variant: "badge1",
      },
    },
  });

  // Populate form with current banner on open
    useEffect(() => {
      if (!currentSquad) return;
      // For presets, we can set the variant directly
      if (currentSquad.banner_type === "preset") {
        formMethods.setValue(
          "banner",
          {
            type: "preset",
            variant: currentSquad.banner_value as SquadBanner,
          },
          { shouldDirty: false },
        );
      }
      // For uploads, we don't have the actual File, but we can set a preview URL for display
      if (currentSquad.banner_type === "upload") {
        formMethods.setValue(
          "banner",
          {
            type: "upload",
            // IMPORTANT: no File yet — preview comes from URL
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            file: undefined as any,
            previewUrl: currentSquad.banner_value,
          },
          { shouldDirty: false },
        );
      }
    }, [currentSquad, formMethods]);

  const {
    handleSubmit,
    formState: { errors },
  } = formMethods;

  // -- Handlers -- //
  const handleOnSubmit = async (data: EditBannerFormValues) => {
    try {
      setIsLoading(true);
      if (!currentSquad) return;

      await withMinDelay(
        (async () => {
          const bannerPayload =
            data.banner.type === "preset"
              ? { type: "preset" as const, variant: data.banner.variant }
              : data.banner.file
                ? { type: "upload" as const, file: data.banner.file }
                : null;

          if (!bannerPayload) {
            closeModal();
            return null;
          }

          const squad = await dispatch(
            editBannerThunk({ squadId: currentSquad?.id, banner: bannerPayload, accountId }),
          ).unwrap();
          await dispatch(clearSquadDraft());
          return squad;
        })(),
        1000,
      );

      // Show success toast on success
      showToast({
        usage: "success",
        message: "Squad’s Banner updated.",
      });
      closeModal();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleSupabaseError({ code: error?.code ?? "SERVER_ERROR" }, openModal);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnBack = () => {
    closeModal();
    return;
  };

  return (
    <FormProvider {...formMethods}>
      <FormModal
        question={"Edit Banner Image"}
        onSubmit={handleSubmit(handleOnSubmit)}
        buttons={{
          onCancel: {
            label: "Cancel",
            action: handleOnBack,
          },
          onContinue: {
            label: "Save",
            loading: isLoading,
            loadingText: "Loading...",
          },
        }}
      >
        <ImageUploadInput
          name="banner"
          hasError={!!errors.banner}
          errorMessage={"Image upload failed. Please try again."}
          helperMessage="JPG or PNG up to 5MB"
        />

        <SelectGraphicInput name="banner" label="Select Banner" />
      </FormModal>
    </FormProvider>
  );
};

export default EditBanner;
