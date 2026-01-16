import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormModal from "@/components/Forms/FormModal/FormModal";
import { useModal } from "@/providers/modal/ModalProvider";
import TextInput from "@/components/Inputs/TextInput/TextInput";
import type { ProfileTable } from "@/types/profile.types";
import { type ChangeEmailSchema, changeEmailSchema } from "./changeEmailSchema";
import { sendVerificationCode } from "@/services/auth.service";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import CheckEmail from "../CheckEmail/CheckEmail";

type ChangeEmailProps = {
  profile: ProfileTable;
};

const ChangeEmail = ({ profile }: ChangeEmailProps) => {
  const { openModal, closeModal } = useModal();

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
    try {
      const res = await sendVerificationCode(data.email, "change_email");
      if (!res.success) {
        if (res.error.status === 409) {  
          handleSupabaseError({ status: res.error.status }, openModal);
          return;
        }
        handleSupabaseError({ status: 500 }, openModal);
        return;
      }
      openModal(<CheckEmail profile={profile} newEmail={data.email} />);
    } catch (error) {
      console.error("Change email error:", error);
      handleSupabaseError({ status: 500 }, openModal);
      return;
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
