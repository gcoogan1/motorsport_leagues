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
import { deleteProfileThunk } from "@/store/profile/profile.thunk";
import { selectCurrentProfile } from "@/store/profile/profile.selectors";
import TextInput from "@/components/Inputs/TextInput/TextInput.tsx";
import FormModal from "@/components/Forms/FormModal/FormModal";
import {
  type ConfirmDeleteProfileSchema,
  confirmDeleteProfileSchema,
} from "./confirmDeleteProfile.schema";

type DeleteProfileProps = {
  closePanel: () => void;
};

const DeleteProfile = ({ closePanel }: DeleteProfileProps) => {
  const { openModal, closeModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const dispatch = useDispatch<AppDispatch>();

  const profile = useSelector(selectCurrentProfile);

  // -- Form setup -- //
  const formMethods = useForm<ConfirmDeleteProfileSchema>({
    resolver: zodResolver(confirmDeleteProfileSchema),
    defaultValues: {
      confirmation: "",
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = formMethods;

  if (!profile) return null;

  // -- Handlers -- //
  const handleOnSubmit = async () => {
    setIsLoading(true);
    try {
      if (profile?.avatar_type === "upload") {
        // If the profile has an uploaded avatar
        await withMinDelay(
          dispatch(
            deleteProfileThunk({
              profileId: profile.id,
              avatarValue: profile.avatar_value,
            }),
          ),
          1000,
        );
      } else {
        // If the profile has a preset avatar (which doesn't require deletion from storage)
        await withMinDelay(
          dispatch(deleteProfileThunk({ profileId: profile.id })),
          1000,
        );
      }

      navigate("/");
      closeModal();
      closePanel();
      showToast({
        usage: "success",
        message: "Profile deleted.",
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
        question={"Delete Profile"}
        helperMessage={
          <>
            Your entire Profile will be deleted and unrecoverable. Squads that
            this Profile is the sole Founder of, and Leagues’ that it is the
            only Director of, will also be deleted. All data that you
            contributed to a Squad or League, including your results, will
            remain there until deleted.
            <br />
            <br />
            <strong>Please type “delete profile” below to confirm.</strong>
          </>
        }
        onSubmit={handleSubmit(handleOnSubmit)}
        buttons={{
          onCancel: { label: "Cancel", action: closeModal },
          onContinue: {
            label: "Delete Profile",
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
          placeholder={'"delete profile"'}
        />
      </FormModal>
    </FormProvider>
  );
};

export default DeleteProfile;
