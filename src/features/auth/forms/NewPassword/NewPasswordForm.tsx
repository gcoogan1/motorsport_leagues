/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FormProvider, useForm } from "react-hook-form";
import { resetPassword } from "@/services/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/providers/auth/useAuth";
import { useModal } from "@/providers/modal/useModal";
import { withMinDelay } from "@/utils/withMinDelay";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { newPasswordSchema, type NewPasswordSchema } from "./newPasswordSchema";
import FormBlock from "@/components/Forms/FormBlock/FormBlock";
import ArrowForward from "@assets/Icon/Arrow_Forward.svg?react";
import PasswordInput from "@/components/Inputs/PasswordInput/PasswordInput";

const NewPasswordForm = () => {
  const { resetAuth } = useAuth();
  const { openModal } = useModal();
  const navigate = useNavigate();
  const email = localStorage.getItem("pending_email");
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    if (!email) {
      handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
      return;
    }

    setIsLoading(true);

    try {
      // Reset Password
      // Adding minimum delay for better UX (1s)
      const result = await withMinDelay(
        resetPassword(data.newPassword, email),
        1000,
      );

      if (!result.success) {
        // Throw other errors
        throw result.error;
      }

      // Success
      setPasswordUpdated(true);
    } catch (error: any) {
      // General error handling
      handleSupabaseError({ code: error?.code ?? "SERVER_ERROR" }, openModal);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToLogin = () => {
    localStorage.removeItem("pending_email");
    navigate("/login");
    return;
  };

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
                loading: isLoading,
                loadingText: "Loading...",
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
