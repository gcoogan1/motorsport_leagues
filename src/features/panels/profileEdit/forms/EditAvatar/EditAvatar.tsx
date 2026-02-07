import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type AppDispatch } from "@/store";
import { type AvatarVariant } from "@/types/profile.types";
import { selectCurrentProfile } from "@/store/profile/profile.selectors";
import { updateProfileAvatarThunk } from "@/store/profile/profile.thunk";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import { withMinDelay } from "@/utils/withMinDelay";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import FormModal from "@/components/Forms/FormModal/FormModal";
import ImageUploadInput from "@/components/Inputs/ImageUploadInput/ImageUploadInput";
import SelectGraphicInput from "@/components/Inputs/SelectGraphicInput/SelectGraphicInput";
import { avatarFormSchema, type AvatarFormValues } from "./editAvatar.schema";

type EditAvatarProps = {
  profileId: string;
};

const EditAvatar = ({ profileId }: EditAvatarProps) => {
  const { openModal, closeModal } = useModal();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const profile = useSelector(selectCurrentProfile);

  // -- Form setup -- //
  const formMethods = useForm<AvatarFormValues>({
    resolver: zodResolver(avatarFormSchema),
    defaultValues: {
      avatar: {
        type: "preset",
        variant: "black",
      },
    },
  });

  // Populate form with current avatar on open
  useEffect(() => {
    if (!profile) return;
    // For presets, we can set the variant directly
    if (profile.avatar_type === "preset") {
      formMethods.setValue(
        "avatar",
        {
          type: "preset",
          variant: profile.avatar_value as AvatarVariant,
        },
        { shouldDirty: false },
      );
    }
    // For uploads, we don't have the actual File, but we can set a preview URL for display
    if (profile.avatar_type === "upload") {
      formMethods.setValue(
        "avatar",
        {
          type: "upload",
          // IMPORTANT: no File yet — preview comes from URL
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          file: undefined as any,
          previewUrl: profile.avatar_value,
        },
        { shouldDirty: false },
      );
    }
  }, [profile, formMethods]);

  const {
    handleSubmit,
    formState: { errors },
  } = formMethods;

  // -- Handlers -- //

  const handleOnSubmit = async (data: AvatarFormValues) => {
    setIsLoading(true);
    try {
      await withMinDelay(
        dispatch(
          updateProfileAvatarThunk({
            profileId,
            accountId: profile!.account_id,
            avatar: data.avatar,
          }),
        ),
        1000,
      );

      // Show success toast on success
      showToast({
        usage: "success",
        message: "Profile's Avatar updated.",
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
        question={"Edit Profile Avatar"}
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
        <ImageUploadInput
          name="avatar"
          isAvatar
          hasError={!!errors.avatar}
          errorMessage={"Image upload failed. Please try again."}
        />
        <SelectGraphicInput name="avatar" label="Select Avatar" />
      </FormModal>
    </FormProvider>
  );
};

export default EditAvatar;
