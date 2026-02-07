/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type AppDispatch, type RootState } from "@/store";
import { withMinDelay } from "@/utils/withMinDelay";
import FormBlock from "@/components/Forms/FormBlock/FormBlock";
import ImageUploadInput from "@/components/Inputs/ImageUploadInput/ImageUploadInput";
import SelectGraphicInput from "@/components/Inputs/SelectGraphicInput/SelectGraphicInput";
import { avatarFormSchema, type AvatarFormValues } from "./avatarFormSchema";
import { createProfileThunk } from "@/store/profile/profile.thunk";
import { clearProfileDraft } from "@/store/profile/profile.slice";
import ProfileCreated from "@/features/profiles/modals/success/ProfileCreated/ProfileCreated";
import { useModal } from "@/providers/modal/useModal";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";

type AvatarFormProps = {
  onBack?: () => void;
};

const AvatarForm = ({ onBack }: AvatarFormProps) => {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const draft = useSelector((state: RootState) => state.profile.draft);
  const account = useSelector((state: RootState) => state.account.data);

  //  - Form setup -- //

  const formMethods = useForm<AvatarFormValues>({
    resolver: zodResolver(avatarFormSchema),
    defaultValues: {
      avatar: {
        type: "preset",
        variant: "black",
      },
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = formMethods;

  // - Handlers -- //

  const handleGoBack = () => {
    if (onBack) onBack();
    else if (window.history.length > 1) navigate(-1);
    else navigate("/", { replace: true });
  };

  const handleOnSubmit = async (data: AvatarFormValues) => {
    setIsLoading(true);
    try {
      if (!account) throw new Error("SERVER_ERROR");

      const payload = {
        accountId: account.id,
        username: draft.username as string,
        gameType: draft.gameType as string,
        avatar: data.avatar,
      };

      const result = await withMinDelay(
        (async () => {
          const profile = await dispatch(createProfileThunk(payload)).unwrap();
          await dispatch(clearProfileDraft());
          return profile;
        })(),
        1000,
      );

      // Navigate to created profile
      if (result) navigate(`/profile/${result.data.id}`);
      openModal(<ProfileCreated />);
    } catch (error: any) {
      // General error handling
      handleSupabaseError({ code: error?.code ?? "SERVER_ERROR" }, openModal);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <FormBlock
        title="Create New Profile"
        question="Select a Display Picture for your Profile"
        onSubmit={handleSubmit(handleOnSubmit)}
        buttons={{
          onCancel: { label: "Back", action: handleGoBack },
          onContinue: {
            label: "Finish",
            loading: isLoading,
            loadingText: "Loading...",
          },
        }}
      >
        <ImageUploadInput
          name="avatar"
          isAvatar
          hasError={!!errors.avatar}
          errorMessage={errors.avatar?.message}
        />

        <SelectGraphicInput name="avatar" label="Select Avatar" />
      </FormBlock>
    </FormProvider>
  );
};

export default AvatarForm;
