import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/providers/auth/useAuth";
import { useModal } from "@/providers/modal/ModalProvider";
import FormBlock from "@/components/Forms/FormBlock/FormBlock";
import ArrowForward from "@assets/Icon/Arrow_Forward.svg?react";
import { newPasswordSchema, type NewPasswordSchema } from "./newPasswordSchema";
import PasswordInput from "@/components/Inputs/PasswordInput/PasswordInput";
import { resetPassword } from "@/services/auth.service";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";

const NewPasswordForm = () => {
  const { resetAuth } = useAuth();
  const { openModal } = useModal();
  const navigate = useNavigate();
  const email = localStorage.getItem("pending_email");
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  // -- Clear Auth //
  useEffect(() => {
    resetAuth();
  }, [resetAuth]);

  // -- Form setup -- //
  const formMethods = useForm<NewPasswordSchema>({
    resolver: zodResolver(newPasswordSchema),
  });

  const {
    handleSubmit,
    formState: { errors },
  } = formMethods;

  
  // -- Handlers -- //

  const handleOnSubmit = async (data: NewPasswordSchema) => {
    try {
      if (!email) {
        handleSupabaseError({ status: 500 }, openModal);
        console.error("No pending email found for password reset.");
        return;
      }

      const result = await resetPassword(data.newPassword, email);

      if (!result.success && result?.error?.status) {
        handleSupabaseError({ status: result.error.status }, openModal);
        return;
      } 
      setPasswordUpdated(true);
    } catch (error) {
      handleSupabaseError({ status: 500 }, openModal);
      console.error("Error resetting password:", error);
    }   
  };

  const handleGoToLogin = () => {
    localStorage.removeItem("pending_email");
    navigate("/login");
  }

  return (
    <>
    {!passwordUpdated ? (
      <FormProvider {...formMethods}>
      <FormBlock
        title={"Reset Password"}
        question={"Create New Password"}
        onSubmit={handleSubmit(handleOnSubmit)}
        buttons={{
          onContinue: {
            label: "Update Password",
            rightIcon: <ArrowForward />,
          },
        }}
      >
        <PasswordInput
          name={"newPassword"}
          label={"Create Password"}
          helperText="Minimum of 8 characters."
          hasError={!!errors.newPassword}
          errorMessage={errors.newPassword?.message}
        />
      </FormBlock>
    </FormProvider>
    ) : (
      <FormBlock
        title={"Reset Password"}
        question={"Successfully Updated"}
        helperMessage="Your password has been changed."
        onSubmit={handleSubmit(handleGoToLogin)}
        buttons={{
          onContinue: {
            label: "Go to Log in",
            rightIcon: <ArrowForward />,
          },
        }}
      />
    )}
    </>
  );
};

export default NewPasswordForm;
