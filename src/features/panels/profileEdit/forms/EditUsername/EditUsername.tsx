import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type AppDispatch } from "@/store";
import { selectCurrentProfile } from "@/store/profile/profile.selectors";
import { updateProfileUsernameThunk } from "@/store/profile/profile.thunk";
import { useToast } from "@/providers/toast/useToast";
import { useModal } from "@/providers/modal/useModal";
import { isProfileUsernameAvailable } from "@/services/profile.service";
import { withMinDelay } from "@/utils/withMinDelay";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import FormModal from "@/components/Forms/FormModal/FormModal";
import ProfileIcon from "@assets/Icon/Profile.svg?react";
import TextInput from "@/components/Inputs/TextInput/TextInput";
import ExistingUsername from "@/features/profiles/modals/errors/ExistingUsername/ExistingUsername";
import { EDIT_USERNAME_VARIANTS } from "./EditUsername.variants";
import {
  type EditUsernameFormValues,
  getUsernameSchema,
} from "./editUsername.schema";

type EditUsernameProps = {
  profileId: string;
};

const EditUsername = ({ profileId }: EditUsernameProps) => {
  const { openModal, closeModal } = useModal();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const profile = useSelector(selectCurrentProfile);
  const schema = getUsernameSchema(profile?.game_type);
  const content = EDIT_USERNAME_VARIANTS[profile?.game_type || "gt7"];

  //  - Form setup -- //
  const formMethods = useForm<EditUsernameFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: profile?.username,
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = formMethods;

  // - Handlers -- //

  const handleOnSubmit = async (data: EditUsernameFormValues) => {
    setIsLoading(true);
    try {
      const res = await withMinDelay(
        isProfileUsernameAvailable(data.username, profile?.game_type, profileId),
        1000,
      );

      // If username exists
      if (!res.success) {
        if (res.error?.code === "EXISTING_USERNAME") {
          openModal(<ExistingUsername gameType={profile?.game_type} buttonLabel="Try Again" />);
          return;
        }
        throw res.error;
      }
      await withMinDelay(
        dispatch(
          updateProfileUsernameThunk({
            profileId,
            username: data.username,
          }),
        ),
        1000,
      );

      // Show success toast on success
      showToast({
        usage: "success",
        message: "Profile's Username updated.",
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
        question={content.question}
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
          name={"username"}
          type="text"
          autoComplete="username"
          label={content.label}
          helperText={content.inputHelpMsg}
          hasError={!!errors.username}
          errorMessage={errors.username?.message}
          icon={<ProfileIcon />}
          showCounter
          maxLength={16}
        />
      </FormModal>
    </FormProvider>
  );
};

export default EditUsername;
