import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormModal from "@/components/Forms/FormModal/FormModal";
import { useModal } from "@/providers/modal/useModal";
import TextInput from "@/components/Inputs/TextInput/TextInput.tsx";
import type { ProfileTable } from "@/types/profile.types";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import {
  confirmDeleteAccountSchema,
  type ConfirmDeleteAccountSchema,
} from "./confirmDeleteAccount";
import { deleteAccount } from "@/services/auth.service";
import { useAuth } from "@/providers/auth/useAuth";
import { navigate } from "@/app/navigation/navigation";
import { useState } from "react";
import { withMinDelay } from "@/utils/withMinDelay";

type DeleteAccountProps = {
  profile: ProfileTable;
  closePanel: () => void;
};

const DeleteAccountForm = ({ profile, closePanel }: DeleteAccountProps) => {
  const { openModal, closeModal } = useModal();
  const { resetAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // -- Form setup -- //
  const formMethods = useForm<ConfirmDeleteAccountSchema>({
    resolver: zodResolver(confirmDeleteAccountSchema),
    defaultValues: {
      confirmation: "",
    },
  });

  const {
    handleSubmit,
    setError,
    formState: { errors },
  } = formMethods;

  // -- Handlers -- //
  const handleOnSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await withMinDelay(deleteAccount(profile.id), 1000);

      if (!res.success) {
        // Set form error on failure
        setError("confirmation", {
          type: "manual",
          message: res.error?.message || "Failed to delete account.",
        });
        return;
      }
      // On success, reset auth and navigate to home
      resetAuth();
      closeModal();
      closePanel();
      navigate("/");
      return
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
        question={"Delete Account"}
        helperMessage={
          <>
            Your entire account, including your Profiles, will be deleted and
            unrecoverable. Squads that you are the sole Founder of, and Leagues
            that you are the only Director of, will also be deleted. All data
            that you contributed to a Squad or League, including your results,
            will remain there until deleted.
            <br />
            <br />
            <strong>Please type “delete account” below to confirm.</strong>
          </>
        }
        onSubmit={handleSubmit(handleOnSubmit)}
        buttons={{
          onCancel: { label: "Cancel", action: closeModal },
          onContinue: {
            label: "Delete Account",
            loading: isLoading,
            loadingText: "Loading...",
          },
        }}
      >
        <TextInput
          name={"confirmation"}
          label={"Confirm Deletion"}
          hasError={!!errors.confirmation}
          errorMessage={errors.confirmation?.message}
        />
      </FormModal>
    </FormProvider>
  );
};

export default DeleteAccountForm;
