/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendVerificationCode } from "@/services/auth.service";
import { useModal } from "@/providers/modal/useModal";
import { withMinDelay } from "@/utils/withMinDelay";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import type { ProfileTable } from "@/types/profile.types";
import { changeEmailSchema, type ChangeEmailSchema } from "./changeEmailSchema";
import FormModal from "@/components/Forms/FormModal/FormModal";
import TextInput from "@/components/Inputs/TextInput/TextInput";
import CheckEmail from "../CheckEmail/CheckEmail";

type ChangeEmailProps = {
  profile: ProfileTable;
};

const ChangeEmail = ({ profile }: ChangeEmailProps) => {
  const { openModal, closeModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);

  // -- Form setup -- //
  const formMethods = useForm<ChangeEmailSchema>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: {
      email: profile.email,
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = formMethods;

  // -- Handlers -- //
  const handleOnSubmit = async (data: ChangeEmailSchema) => {
    setIsLoading(true);
    try {
      const res = await withMinDelay(sendVerificationCode(data.email, "change_email"), 1000);
      
      if (!res.success) {
        throw res.error;
      }
      // Open check email modal on success
      openModal(<CheckEmail profile={profile} newEmail={data.email} />);
    } catch (error: any) {
      handleSupabaseError({ status: error?.status ?? 500 }, openModal);
      return;
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
        question={"Change Email"}
        helperMessage="Enter a new email address to associate with your Motorsport Leagues account. We’ll send a verification code to this email."
        onSubmit={handleSubmit(handleOnSubmit)}
        buttons={{
          onCancel: {
            label: "Cancel",
            action: handleOnCancel,
          },
          onContinue: {
            label: "Send Code",
            loading: isLoading,
            loadingText: "Loading...",
          },
        }}
      >
        <TextInput
          name={"email"}
          label={"New Email Address"}
          hasError={!!errors.email}
          errorMessage={errors.email?.message}
        />
      </FormModal>
    </FormProvider>
  );
};

export default ChangeEmail;
