import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormModal from "@/components/Forms/FormModal/FormModal";
import { useModal } from "@/providers/modal/ModalProvider";
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

type DeleteAccountProps = {
  profile: ProfileTable;
  closePanel: () => void;
};

const DeleteAccountForm = ({ profile, closePanel }: DeleteAccountProps) => {
  const { openModal, closeModal } = useModal();
  const { resetAuth } = useAuth();

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
  const handleOnSubmit = async (data: ConfirmDeleteAccountSchema) => {
    try {
      const res = await deleteAccount(profile.id);

      if (!res.success) {
        setError("confirmation", {
          type: "manual",
          message: res.error?.message || "Failed to delete account.",
        });
        return;
      }
      resetAuth();
      closeModal();
      closePanel();
      navigate("/");
      return
    } catch (error) {
      console.error("Delete account error:", error);
      handleSupabaseError({ status: 500 }, openModal);
      return;
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
